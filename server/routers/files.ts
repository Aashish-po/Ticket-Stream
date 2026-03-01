import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { storagePut } from "../storage";
import { uploadFileAttachment, getFileAttachmentsByTicketId, getFileAttachmentsByArticleId, deleteFileAttachment } from "../db";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";

export const filesRouter = router({
  /**
   * Upload a file attachment for a ticket or knowledge base article
   */
  uploadAttachment: protectedProcedure
    .input(
      z.object({
        fileName: z.string().min(1).max(255),
        fileData: z.string(), // Base64 encoded file data
        mimeType: z.string().min(1).max(100),
        fileSize: z.number().positive(),
        ticketId: z.string().optional(),
        articleId: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Validate that at least one of ticketId or articleId is provided
        if (!input.ticketId && !input.articleId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Either ticketId or articleId must be provided",
          });
        }

        // Validate file size (max 10MB)
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        if (input.fileSize > MAX_FILE_SIZE) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "File size exceeds 10MB limit",
          });
        }

        // Generate unique file key
        const fileExtension = input.fileName.split(".").pop() || "file";
        const fileKey = `tickets/${ctx.user.id}/${nanoid()}-${input.fileName}`;

        // Decode base64 and upload to S3
        const fileBuffer = Buffer.from(input.fileData, "base64");
        const { url } = await storagePut(fileKey, fileBuffer, input.mimeType);

        // Save file metadata to database
        const attachment = await uploadFileAttachment({
          userId: ctx.user.id,
          ticketId: input.ticketId,
          articleId: input.articleId,
          fileName: input.fileName,
          fileKey,
          fileUrl: url,
          mimeType: input.mimeType,
          fileSize: input.fileSize,
        });

        if (!attachment) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to save file metadata",
          });
        }

        return {
          success: true,
          file: attachment,
        };
      } catch (error) {
        console.error("[Files] Upload failed:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload file",
        });
      }
    }),

  /**
   * Get all file attachments for a ticket
   */
  getTicketAttachments: protectedProcedure
    .input(z.object({ ticketId: z.string() }))
    .query(async ({ input }) => {
      try {
        const attachments = await getFileAttachmentsByTicketId(input.ticketId);
        return attachments;
      } catch (error) {
        console.error("[Files] Failed to fetch ticket attachments:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch attachments",
        });
      }
    }),

  /**
   * Get all file attachments for a knowledge base article
   */
  getArticleAttachments: protectedProcedure
    .input(z.object({ articleId: z.number() }))
    .query(async ({ input }) => {
      try {
        const attachments = await getFileAttachmentsByArticleId(input.articleId);
        return attachments;
      } catch (error) {
        console.error("[Files] Failed to fetch article attachments:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch attachments",
        });
      }
    }),

  /**
   * Delete a file attachment
   */
  deleteAttachment: protectedProcedure
    .input(z.object({ fileId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // In a real app, verify the user owns this file before deleting
        const success = await deleteFileAttachment(input.fileId);

        if (!success) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "File not found",
          });
        }

        return { success: true };
      } catch (error) {
        console.error("[Files] Delete failed:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete file",
        });
      }
    }),
});
