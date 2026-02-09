"use client";

import { useState, useCallback, useRef, useId } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { isValidFileType, formatFileSize, MAX_FILE_SIZE } from "@/lib/cloudinary";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  file: File | null;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
}

export function FileUpload({
  onFileSelect,
  file,
  isUploading = false,
  error,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const labelId = `${inputId}-label`;
  const helperId = `${inputId}-helper`;
  const shouldReduceMotion = useReducedMotion() ?? false;

  const handleFile = useCallback(
    (selectedFile: File) => {
      setLocalError(null);

      if (!isValidFileType(selectedFile)) {
        setLocalError("Please upload a PDF or image file (JPG, PNG, WebP)");
        return;
      }

      if (selectedFile.size > MAX_FILE_SIZE) {
        setLocalError("File size must be under 10MB");
        return;
      }

      onFileSelect(selectedFile);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFile(droppedFile);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFile(selectedFile);
      }
    },
    [handleFile]
  );

  const displayError = error || localError;
  const describedBy = displayError ? "file-error" : helperId;

  return (
    <div className="w-full">
      <label
        id={labelId}
        htmlFor={inputId}
        className="block text-body-sm font-medium text-text-primary mb-2"
      >
        Return label
      </label>

      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={`
          relative w-full p-8 rounded-2xl border-2 border-dashed
          cursor-pointer transition-all duration-200
          ${
            isDragging
              ? "border-primary bg-primary-light"
              : displayError
                ? "border-error bg-error/5"
                : file
                  ? "border-success bg-success/5"
                  : "border-border bg-surface-base hover:border-border-strong hover:bg-white"
          }
        `}
        role="button"
        tabIndex={0}
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        whileTap={{ scale: 0.99 }}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept=".pdf,image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleInputChange}
          className="sr-only"
          aria-describedby={describedBy}
        />

        <AnimatePresence mode="wait">
          {isUploading ? (
            <UploadingState reduceMotion={shouldReduceMotion} />
          ) : file ? (
            <FilePreview file={file} />
          ) : (
            <EmptyState isDragging={isDragging} />
          )}
        </AnimatePresence>
      </motion.div>

      {displayError && (
        <p id="file-error" className="mt-2 text-body-sm text-error">
          {displayError}
        </p>
      )}

      <p id={helperId} className="mt-2 text-caption text-text-muted">
        PDF or image up to 10MB. Snap a photo of your label or upload the file from
        your email.
      </p>
    </div>
  );
}

function EmptyState({ isDragging }: { isDragging: boolean }) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center text-center"
    >
      <div
        className={`
        w-14 h-14 rounded-xl flex items-center justify-center mb-4
        ${isDragging ? "bg-primary text-white" : "bg-surface-elevated text-text-secondary"}
      `}
      >
        <UploadIcon />
      </div>
      <p className="font-medium text-text-primary">
        {isDragging ? "Drop your label here" : "Drag and drop your return label"}
      </p>
      <p className="mt-1 text-body-sm text-text-secondary">
        or <span className="text-primary font-medium">click to browse</span>
      </p>
    </motion.div>
  );
}

function FilePreview({ file }: { file: File }) {
  const isPDF = file.type === "application/pdf";

  return (
    <motion.div
      key="preview"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-4"
    >
      <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center text-success">
        {isPDF ? <PDFIcon /> : <ImageIcon />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-text-primary truncate">{file.name}</p>
        <p className="text-body-sm text-text-secondary">{formatFileSize(file.size)}</p>
      </div>
      <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
        <CheckIcon />
      </div>
    </motion.div>
  );
}

function UploadingState({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.div
      key="uploading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center"
    >
      <div className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center">
        <motion.div
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={reduceMotion ? undefined : { duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <SpinnerIcon />
        </motion.div>
      </div>
      <p className="mt-4 font-medium text-text-primary">Uploading...</p>
    </motion.div>
  );
}

function UploadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 8L12 3L7 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PDFIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path
        d="M12 2C6.47715 2 2 6.47715 2 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
