import { useAuth } from "@clerk/clerk-react";
import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { toast } from "react-toastify";
import { X, Loader2 } from "lucide-react";

import { uploadAttachment } from "@/config/uploadAttachments";
import RenderFileIcon from "@/common/RenderFileIcon";

export type AttachmentUploaderHandle = {
  triggerFileSelect: () => void;
  clearFile: () => void;
};

const AttachmentUploader = forwardRef(function AttachmentUploader(
  {
    chatId,
    onUpload,
    onRemove,
    previewUrl,
    setPreviewUrl,
  }: {
    chatId: string;
    onUpload: (url: string) => void;
    onRemove?: () => void;
    previewUrl: string | null;
    setPreviewUrl: (url: string | null) => void;
  },
  ref
) {
  const { getToken } = useAuth();
  const [fileType, setFileType] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ACCEPTED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast.error("Unsupported file type");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    setFileType(file.type);
    setIsUploading(true);

    try {
      const token = await getToken();
      if (!token) throw new Error("No token found");

      const url = await uploadAttachment(file, chatId, token);
      onUpload(url);
      setPreviewUrl(
        file.type.startsWith("image/") ? URL.createObjectURL(file) : file.name
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
      console.error("Upload failed:", err);
      clearFile();
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setPreviewUrl(null);
    setFileType(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onRemove?.();
  };

  useImperativeHandle(ref, () => ({
    triggerFileSelect: () => {
      inputRef?.current?.click();
    },
    clearFile,
  }));

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        accept={ACCEPTED_FILE_TYPES.join(",")}
        className="hidden"
        disabled={isUploading}
      />

      {isUploading ? (
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-800">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading file...</span>
        </div>
      ) : previewUrl ? (
        <div className="relative mt-4 text-sm">
          <div className="relative inline-block">
            <RenderFileIcon
              fileType={fileType}
              attachmentUrl={previewUrl}
              className={`max-w-xs rounded ${
                fileType?.startsWith("image/") ? "w-40" : "w-24"
              }`}
            />
            <button
              type="button"
              onClick={clearFile}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              disabled={isUploading}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
});

export default AttachmentUploader;
