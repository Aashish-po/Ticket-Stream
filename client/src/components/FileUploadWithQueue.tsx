import { useState, useRef, useEffect } from 'react';
import { Upload, X, File, Download, Loader2, AlertCircle, Pause, Play, Trash2, CheckCircle2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useUploadQueue, type UploadItem } from '@/hooks/useUploadQueue';
import ProgressBar from './ProgressBar';

/**
 * FileUploadWithQueue Component
 * Design: Gradient Elegance - Advanced file upload with batch queuing and progress tracking
 * Features: Drag-and-drop, batch uploads, progress bars, queue management, concurrent uploads
 */

interface FileUploadWithQueueProps {
  ticketId?: string;
  articleId?: number;
  onUploadSuccess?: (file: any) => void;
  maxFileSize?: number;
  maxConcurrentUploads?: number;
}

export default function FileUploadWithQueue({
  ticketId,
  articleId,
  onUploadSuccess,
  maxFileSize = 10 * 1024 * 1024,
  maxConcurrentUploads = 2,
}: FileUploadWithQueueProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [pausedUploads, setPausedUploads] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = trpc.files.uploadAttachment.useMutation();
  const ticketAttachments = trpc.files.getTicketAttachments.useQuery(
    { ticketId: ticketId || '' },
    { enabled: !!ticketId }
  );
  const articleAttachments = trpc.files.getArticleAttachments.useQuery(
    { articleId: articleId || 0 },
    { enabled: !!articleId }
  );
  const deleteMutation = trpc.files.deleteAttachment.useMutation();

  const uploadQueue = useUploadQueue({
    maxConcurrentUploads,
    onUploadComplete: (item) => {
      onUploadSuccess?.(item);
      if (ticketId) ticketAttachments.refetch();
      if (articleId) articleAttachments.refetch();
    },
    onUploadError: (item, error) => {
      toast.error(`Failed to upload ${item.file.name}`);
    },
  });

  const files = ticketId ? ticketAttachments.data : articleAttachments.data;

  useEffect(() => {
    const processQueue = async () => {
      const pending = uploadQueue.getPendingUploads();

      for (const item of pending) {
        if (!uploadQueue.canProcessMore()) break;
        if (pausedUploads.has(item.id)) continue;

        uploadQueue.markUploading(item.id);

        try {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const base64Data = (e.target?.result as string).split(',')[1];

            try {
              let progress = 0;
              const progressInterval = setInterval(() => {
                if (progress < 90) {
                  progress += Math.random() * 30;
                  uploadQueue.updateProgress(item.id, progress);
                }
              }, 500);

              const result = await uploadMutation.mutateAsync({
                fileName: item.file.name,
                fileData: base64Data,
                mimeType: item.file.type,
                fileSize: item.file.size,
                ticketId,
                articleId,
              });

              clearInterval(progressInterval);
              uploadQueue.updateProgress(item.id, 100);
              uploadQueue.markCompleted(item.id);
              toast.success(`${item.file.name} uploaded successfully`);
            } catch (error) {
              clearInterval(progressInterval);
              uploadQueue.markFailed(item.id, 'Upload failed');
            }
          };
          reader.readAsDataURL(item.file);
        } catch (error) {
          uploadQueue.markFailed(item.id, 'Failed to read file');
        }
      }
    };

    if (uploadQueue.state.items.some((item) => item.status === 'pending')) {
      processQueue();
    }
  }, [uploadQueue.state.items, pausedUploads, ticketId, articleId]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };

  const processFiles = (filesToProcess: File[]) => {
    const validFiles: File[] = [];

    for (const file of filesToProcess) {
      if (file.size > maxFileSize) {
        toast.error(`File "${file.name}" exceeds 10MB limit`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      uploadQueue.addToQueue(validFiles, ticketId, articleId);
      toast.success(`Added ${validFiles.length} file(s) to upload queue`);
    }
  };

  const handlePauseResume = (id: string) => {
    if (pausedUploads.has(id)) {
      pausedUploads.delete(id);
      setPausedUploads(new Set(pausedUploads));
    } else {
      pausedUploads.add(id);
      setPausedUploads(new Set(pausedUploads));
    }
  };

  const handleCancelUpload = (id: string) => {
    uploadQueue.cancelUpload(id);
    toast.info('Upload cancelled');
  };

  const handleDelete = async (fileId: number) => {
    try {
      await deleteMutation.mutateAsync({ fileId });
      toast.success('File deleted successfully');
      if (ticketId) ticketAttachments.refetch();
      if (articleId) articleAttachments.refetch();
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('sheet')) return '📊';
    return '📎';
  };

  const stats = uploadQueue.getStats();

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border bg-white hover:border-primary/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={stats.uploading >= maxConcurrentUploads}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={stats.uploading >= maxConcurrentUploads}
          className="w-full flex flex-col items-center gap-3 cursor-pointer"
        >
          <Upload className="text-primary" size={32} />
          <div>
            <p className="font-medium text-foreground">Drop files here or click to upload</p>
            <p className="text-sm text-muted-foreground">
              Max 10MB per file • {maxConcurrentUploads} concurrent uploads
            </p>
          </div>
        </button>
      </div>

      {/* Queue Statistics */}
      {stats.total > 0 && (
        <div className="flex gap-4 p-3 bg-secondary rounded-lg">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Queue Progress</p>
            <ProgressBar
              progress={uploadQueue.state.totalProgress}
              showPercentage={true}
              size="sm"
              animated={stats.uploading > 0}
            />
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <p className="font-semibold text-foreground">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Done</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">{stats.uploading}</p>
              <p className="text-xs text-muted-foreground">Uploading</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            {stats.failed > 0 && (
              <div className="text-center">
                <p className="font-semibold text-red-600">{stats.failed}</p>
                <p className="text-xs text-muted-foreground">Failed</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Queue Items */}
      {uploadQueue.state.items.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Upload Queue</h3>
            {uploadQueue.state.items.some((item) => item.status !== 'completed') && (
              <button
                onClick={() => uploadQueue.cancelAll()}
                className="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {uploadQueue.state.items.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-secondary rounded-lg space-y-2 hover:bg-border transition-colors"
              >
                {/* File Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-lg">{getFileIcon(item.file.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(item.file.size)}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.status === 'completed' && <CheckCircle2 className="text-green-600" size={18} />}
                    {item.status === 'error' && <AlertCircle className="text-red-600" size={18} />}
                    {item.status === 'uploading' && <Loader2 className="text-primary animate-spin" size={18} />}
                  </div>
                </div>

                {/* Progress Bar */}
                {(item.status === 'uploading' || item.status === 'pending') && (
                  <ProgressBar progress={item.progress} showPercentage={true} size="sm" animated={item.status === 'uploading'} />
                )}

                {/* Error Message */}
                {item.status === 'error' && item.error && <p className="text-xs text-red-600">{item.error}</p>}

                {/* Actions */}
                {item.status !== 'completed' && (
                  <div className="flex items-center gap-2 pt-2">
                    {item.status === 'uploading' && (
                      <button
                        onClick={() => handlePauseResume(item.id)}
                        className="flex-1 py-1 px-2 text-xs bg-white hover:bg-border rounded transition-colors text-foreground font-medium flex items-center justify-center gap-1"
                      >
                        {pausedUploads.has(item.id) ? (
                          <>
                            <Play size={14} />
                            Resume
                          </>
                        ) : (
                          <>
                            <Pause size={14} />
                            Pause
                          </>
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => handleCancelUpload(item.id)}
                      className="flex-1 py-1 px-2 text-xs bg-red-50 hover:bg-red-100 rounded transition-colors text-red-600 font-medium flex items-center justify-center gap-1"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Files List */}
      {files && files.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <File size={16} />
            Attachments ({files.length})
          </h3>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-border transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xl">{getFileIcon(file.mimeType)}</span>
                  <div className="flex-1 min-w-0">
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline truncate block"
                    >
                      {file.fileName}
                    </a>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.fileSize)} • {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={file.fileUrl}
                    download
                    className="p-2 hover:bg-white rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                    title="Download"
                  >
                    <Download size={16} />
                  </a>
                  <button
                    onClick={() => handleDelete(file.id)}
                    disabled={deleteMutation.isPending}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-muted-foreground hover:text-red-600 disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
