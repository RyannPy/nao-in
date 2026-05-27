"use client";

import { useEffect, useRef, useState } from "react";
import { uploadArticleImage } from "@/lib/admin/storage";

// ─── Types ────────────────────────────────────────────────────────────────────
type UploadState = "idle" | "uploading" | "success" | "error";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImageUrl?: string;
  slug: string;
}

// ─── Corner tick helper ───────────────────────────────────────────────────────
function CornerTicks() {
  return (
    <>
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#999]" />
      <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#999]" />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#999]" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#999]" />
    </>
  );
}

// ─── ImageUpload ──────────────────────────────────────────────────────────────
export default function ImageUpload({
  onUpload,
  currentImageUrl,
  slug,
}: ImageUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // On mount: if currentImageUrl is provided, show success state with preview
  useEffect(() => {
    if (currentImageUrl) {
      setUploadState("success");
      setPreviewUrl(currentImageUrl);
    }
  }, [currentImageUrl]);

  // ─── File handling ──────────────────────────────────────────────────────────
  async function handleFile(file: File) {
    setUploadState("uploading");
    setErrorMessage(null);
    try {
      const url = await uploadArticleImage(file, slug);
      setPreviewUrl(url);
      setUploadState("success");
      onUpload(url);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      setErrorMessage(msg);
      setUploadState("error");
    }
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  function resetToIdle() {
    setUploadState("idle");
    setPreviewUrl(null);
    setErrorMessage(null);
    setIsDragOver(false);
    // Reset file input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="border border-[#b8b8b8] bg-[#c4c4c4] relative overflow-hidden">
      {/* Header bar */}
      <div className="bg-[#1a1a1a] px-5 py-2 flex items-center justify-between">
        <span className="text-[8px] tracking-[0.3em] text-[#555] font-mono uppercase">
          IMAGE MODULE — UPLOAD MODE
        </span>
        <span className="text-[7px] tracking-[0.2em] text-[#444] font-mono uppercase">
          {uploadState.toUpperCase()}
        </span>
      </div>

      {/* ── IDLE STATE ── */}
      {uploadState === "idle" && (
        <div className="p-5">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
            aria-label="Upload image file"
          />

          {/* Drop zone */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Drop image file here or click to browse"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed cursor-pointer transition-colors duration-150 p-8 flex flex-col items-center justify-center gap-3 ${
              isDragOver
                ? "border-[#e8c830] bg-[#c8c800]/10"
                : "border-[#b5b5b5] hover:border-[#999]"
            }`}
          >
            <CornerTicks />
            <span className="text-[11px] tracking-[0.15em] text-[#555] font-mono uppercase select-none">
              {"> DROP IMAGE FILE HERE OR CLICK TO BROWSE"}
            </span>
            <span className="text-[8px] tracking-[0.2em] text-[#aaa] font-mono uppercase">
              JPEG · PNG · WEBP · GIF — MAX 5MB
            </span>
          </div>
        </div>
      )}

      {/* ── UPLOADING STATE ── */}
      {uploadState === "uploading" && (
        <div className="p-5">
          <div className="border border-[#b5b5b5] bg-[#c4c4c4] p-8 flex flex-col items-center justify-center gap-4 relative">
            <CornerTicks />
            {/* Animated progress bar */}
            <div className="w-full h-[3px] bg-[#b5b5b5] overflow-hidden">
              <div className="h-full bg-[#e8c830] animate-pulse w-2/3" />
            </div>
            <span className="text-[11px] tracking-[0.3em] text-[#1a1a1a] font-mono uppercase">
              UPLOADING...
            </span>
            <span className="text-[8px] tracking-[0.2em] text-[#888] font-mono uppercase">
              PLEASE WAIT — DO NOT CLOSE THIS PAGE
            </span>
          </div>
        </div>
      )}

      {/* ── SUCCESS STATE ── */}
      {uploadState === "success" && previewUrl && (
        <div className="p-5 flex flex-col gap-4">
          {/* Image preview */}
          <div className="border border-[#b5b5b5] overflow-hidden relative">
            <div className="bg-[#1a1a1a] px-3 py-1 flex items-center gap-2">
              <span className="w-[5px] h-[5px] border-t border-r border-[#444]" />
              <span className="text-[8px] tracking-[0.3em] text-[#555] font-mono uppercase">
                PREVIEW
              </span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Uploaded image preview"
              className="w-full h-48 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          {/* Public URL display */}
          <div className="border border-[#b5b5b5] bg-[#bdbdbd] px-4 py-3 relative">
            <CornerTicks />
            <p className="text-[8px] tracking-[0.2em] text-[#888] font-mono uppercase mb-1">
              PUBLIC URL
            </p>
            <p className="text-[10px] text-[#1a1a1a] font-mono break-all leading-relaxed">
              {previewUrl}
            </p>
          </div>

          {/* Change image button */}
          <button
            type="button"
            onClick={resetToIdle}
            className="self-start px-5 py-2 bg-[#1a1a1a] border border-[#1a1a1a] text-[#e8c830] text-[9px] tracking-[0.3em] font-mono uppercase hover:bg-[#2a2a2a] transition-colors duration-150"
          >
            CHANGE IMAGE
          </button>
        </div>
      )}

      {/* ── ERROR STATE ── */}
      {uploadState === "error" && (
        <div className="p-5">
          <div className="border border-[#cc3333] bg-[#fff0f0] px-5 py-4 relative flex flex-col gap-3">
            <CornerTicks />
            <div className="flex items-start gap-3">
              <span className="text-[#cc3333] font-mono text-[11px] font-bold mt-px">✕</span>
              <div>
                <p className="text-[9px] tracking-[0.25em] text-[#cc3333] font-mono uppercase font-semibold mb-1">
                  UPLOAD FAILED
                </p>
                <p className="text-[10px] text-[#cc3333] font-mono leading-relaxed">
                  {errorMessage ?? "An unknown error occurred."}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={resetToIdle}
              className="self-start px-5 py-2 bg-[#cc3333] border border-[#cc3333] text-white text-[9px] tracking-[0.3em] font-mono uppercase hover:bg-[#aa2222] transition-colors duration-150"
            >
              RETRY
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
