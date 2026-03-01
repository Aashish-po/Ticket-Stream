import { useState, useRef } from 'react';
import { Upload, X, File, Download, Loader2, AlertCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

/**
 * FileUpload Component
 * Design: Gradient Elegance - File upload interface with drag-and-drop support
 * Features: Drag-and-drop, file preview, upload progress, file management
 */

interface FileUploadProps {
  ticketId?: string;
  articleId?: number;
  onUploadSuccess?: (file: any) => void;
  maxFileSize?: number; // in bytes, default 10MB
}

export default function FileUpload({
  ticketId,
  articleId,
  onUploadSuccess,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
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

  const files = ticketId ? ticketAttachments.data : articleAttachments.data;

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

  const processFiles = async (filesToProcess: File[]) => {
    for (const file of filesToProcess) {
      // Validate file size
      if (file.size > maxFileSize) {
        toast.error(`File "${file.name}" exceeds 10MB limit`);
        continue;
      }

      // Read file as base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = (e.target?.result as string).split(',')[1];

        try {
          const result = await uploadMutation.mutateAsync({
            fileName: file.name,
            fileData: base64Data,
            mimeType: file.type,
            fileSize: file.size,
            ticketId,
            articleId,
          });

          if (result.success) {
            toast.success(`File "${file.name}" uploaded successfully`);
            setUploadedFiles([...uploadedFiles, result.file]);
            onUploadSuccess?.(result.file);
            // Refetch attachments
            if (ticketId) ticketAttachments.refetch();
            if (articleId) articleAttachments.refetch();
          }
        } catch (error) {
          toast.error(`Failed to upload "${file.name}"`);
        }
      };
      reader.readAsDataURL(file);
    }
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

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border bg-white hover:border-primary/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploadMutation.isPending}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="w-full flex flex-col items-center gap-3 cursor-pointer"
        >
          {uploadMutation.isPending ? (
            <>
              <Loader2 className="text-primary animate-spin" size={32} />
              <div>
                <p className="font-medium text-foreground">Uploading...</p>
                <p className="text-sm text-muted-foreground">Please wait</p>
              </div>
            </>
          ) : (
            <>
              <Upload className="text-primary" size={32} />
              <div>
                <p className="font-medium text-foreground">Drop files here or click to upload</p>
                <p className="text-sm text-muted-foreground">Max 10MB per file</p>
              </div>
            </>
          )}
        </button>
      </div>

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
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {uploadMutation.isError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="text-red-600" size={16} />
          <p className="text-sm text-red-700">Failed to upload file. Please try again.</p>
        </div>
      )}
    </div>
  );
}
