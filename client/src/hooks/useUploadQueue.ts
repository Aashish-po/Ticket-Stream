import { useState, useCallback, useRef } from 'react';

/**
 * Upload Queue Manager Hook
 * Manages batch file uploads with progress tracking, queuing, and concurrent upload limits
 */

export interface UploadItem {
  id: string;
  file: File;
  ticketId?: string;
  articleId?: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number; // 0-100
  error?: string;
  uploadedAt?: Date;
}

export interface UploadQueueState {
  items: UploadItem[];
  totalProgress: number; // Overall progress across all files
  activeUploads: number;
  completedUploads: number;
  failedUploads: number;
  isProcessing: boolean;
}

interface UseUploadQueueOptions {
  maxConcurrentUploads?: number;
  onUploadComplete?: (item: UploadItem) => void;
  onUploadError?: (item: UploadItem, error: Error) => void;
  onQueueComplete?: () => void;
}

export function useUploadQueue(options: UseUploadQueueOptions = {}) {
  const {
    maxConcurrentUploads = 2,
    onUploadComplete,
    onUploadError,
    onQueueComplete,
  } = options;

  const [state, setState] = useState<UploadQueueState>({
    items: [],
    totalProgress: 0,
    activeUploads: 0,
    completedUploads: 0,
    failedUploads: 0,
    isProcessing: false,
  });

  const processingRef = useRef(false);
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  /**
   * Add files to the upload queue
   */
  const addToQueue = useCallback(
    (files: File[], ticketId?: string, articleId?: number) => {
      const newItems: UploadItem[] = files.map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        ticketId,
        articleId,
        status: 'pending',
        progress: 0,
      }));

      setState((prev) => ({
        ...prev,
        items: [...prev.items, ...newItems],
      }));

      return newItems;
    },
    []
  );

  /**
   * Update progress for a specific upload
   */
  const updateProgress = useCallback((id: string, progress: number) => {
    setState((prev) => {
      const updatedItems = prev.items.map((item) =>
        item.id === id ? { ...item, progress: Math.min(100, progress) } : item
      );

      // Calculate total progress
      const totalProgress =
        updatedItems.length > 0
          ? Math.round(
              updatedItems.reduce((sum, item) => sum + item.progress, 0) /
                updatedItems.length
            )
          : 0;

      return {
        ...prev,
        items: updatedItems,
        totalProgress,
      };
    });
  }, []);

  /**
   * Mark upload as completed
   */
  const markCompleted = useCallback((id: string) => {
    setState((prev) => {
      const updatedItems = prev.items.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'completed' as const,
              progress: 100,
              uploadedAt: new Date(),
            }
          : item
      );

      const completedCount = updatedItems.filter(
        (item) => item.status === 'completed'
      ).length;
      const activeCount = updatedItems.filter(
        (item) => item.status === 'uploading'
      ).length;

      return {
        ...prev,
        items: updatedItems,
        activeUploads: activeCount,
        completedUploads: completedCount,
      };
    });

    onUploadComplete?.(state.items.find((item) => item.id === id)!);
  }, [state.items, onUploadComplete]);

  /**
   * Mark upload as failed
   */
  const markFailed = useCallback(
    (id: string, error: string) => {
      setState((prev) => {
        const updatedItems = prev.items.map((item) =>
          item.id === id
            ? {
                ...item,
                status: 'error' as const,
                error,
              }
            : item
        );

        const failedCount = updatedItems.filter(
          (item) => item.status === 'error'
        ).length;
        const activeCount = updatedItems.filter(
          (item) => item.status === 'uploading'
        ).length;

        return {
          ...prev,
          items: updatedItems,
          activeUploads: activeCount,
          failedUploads: failedCount,
        };
      });

      const failedItem = state.items.find((item) => item.id === id);
      if (failedItem) {
        onUploadError?.(failedItem, new Error(error));
      }
    },
    [state.items, onUploadError]
  );

  /**
   * Mark upload as uploading
   */
  const markUploading = useCallback((id: string) => {
    setState((prev) => {
      const updatedItems = prev.items.map((item) =>
        item.id === id ? { ...item, status: 'uploading' as const } : item
      );

      const activeCount = updatedItems.filter(
        (item) => item.status === 'uploading'
      ).length;

      return {
        ...prev,
        items: updatedItems,
        activeUploads: activeCount,
      };
    });
  }, []);

  /**
   * Get pending uploads that can be processed
   */
  const getPendingUploads = useCallback(() => {
    return state.items.filter((item) => item.status === 'pending');
  }, [state.items]);

  /**
   * Get number of active uploads
   */
  const getActiveUploadCount = useCallback(() => {
    return state.items.filter((item) => item.status === 'uploading').length;
  }, [state.items]);

  /**
   * Cancel a specific upload
   */
  const cancelUpload = useCallback((id: string) => {
    const controller = abortControllersRef.current.get(id);
    if (controller) {
      controller.abort();
      abortControllersRef.current.delete(id);
    }

    setState((prev) => {
      const updatedItems = prev.items.filter((item) => item.id !== id);
      return {
        ...prev,
        items: updatedItems,
      };
    });
  }, []);

  /**
   * Cancel all uploads
   */
  const cancelAll = useCallback(() => {
    abortControllersRef.current.forEach((controller) => {
      controller.abort();
    });
    abortControllersRef.current.clear();

    setState((prev) => ({
      ...prev,
      items: [],
      totalProgress: 0,
      activeUploads: 0,
      completedUploads: 0,
      failedUploads: 0,
      isProcessing: false,
    }));
  }, []);

  /**
   * Clear completed uploads from queue
   */
  const clearCompleted = useCallback(() => {
    setState((prev) => {
      const remainingItems = prev.items.filter(
        (item) => item.status !== 'completed'
      );
      return {
        ...prev,
        items: remainingItems,
        completedUploads: 0,
      };
    });
  }, []);

  /**
   * Get abort controller for a specific upload
   */
  const getAbortController = useCallback((id: string) => {
    if (!abortControllersRef.current.has(id)) {
      abortControllersRef.current.set(id, new AbortController());
    }
    return abortControllersRef.current.get(id)!;
  }, []);

  /**
   * Check if queue processing can continue
   */
  const canProcessMore = useCallback(() => {
    return getActiveUploadCount() < maxConcurrentUploads;
  }, [getActiveUploadCount, maxConcurrentUploads]);

  /**
   * Get queue statistics
   */
  const getStats = useCallback(() => {
    const total = state.items.length;
    const pending = state.items.filter((item) => item.status === 'pending').length;
    const uploading = state.items.filter((item) => item.status === 'uploading').length;
    const completed = state.items.filter((item) => item.status === 'completed').length;
    const failed = state.items.filter((item) => item.status === 'error').length;

    return {
      total,
      pending,
      uploading,
      completed,
      failed,
      isProcessing: uploading > 0 || pending > 0,
    };
  }, [state.items]);

  return {
    state,
    addToQueue,
    updateProgress,
    markCompleted,
    markFailed,
    markUploading,
    getPendingUploads,
    getActiveUploadCount,
    cancelUpload,
    cancelAll,
    clearCompleted,
    getAbortController,
    canProcessMore,
    getStats,
    maxConcurrentUploads,
  };
}
