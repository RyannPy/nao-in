// @vitest-environment jsdom

/**
 * Unit tests for ImageUpload component states.
 *
 * Requirements: 5.3, 5.7, 5.8, 5.10
 *
 * Tests cover:
 * - Idle state: drop zone with correct prompt text
 * - Success state: image preview when currentImageUrl is provided
 * - Error state: error message and retry button when upload fails
 */

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";

// ─── Mock uploadArticleImage ──────────────────────────────────────────────────
// We mock the storage module so no real network calls are made.
vi.mock("@/lib/admin/storage", () => ({
  uploadArticleImage: vi.fn(),
}));

import { uploadArticleImage } from "@/lib/admin/storage";
import ImageUpload from "./ImageUpload";

const mockUpload = uploadArticleImage as ReturnType<typeof vi.fn>;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeFile(name = "photo.jpg", type = "image/jpeg", size = 1024): File {
  const blob = new Blob(["x".repeat(size)], { type });
  return new File([blob], name, { type });
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("ImageUpload — idle state (Requirement 5.3)", () => {
  it("renders the drop zone with the correct terminal prompt text", () => {
    render(
      <ImageUpload onUpload={vi.fn()} slug="test-article" />
    );

    // The prompt text must match exactly as specified in the task
    expect(
      screen.getByText(/DROP IMAGE FILE HERE OR CLICK TO BROWSE/i)
    ).toBeInTheDocument();
  });

  it("renders the IMAGE MODULE — UPLOAD MODE header", () => {
    render(
      <ImageUpload onUpload={vi.fn()} slug="test-article" />
    );

    expect(
      screen.getByText(/IMAGE MODULE — UPLOAD MODE/i)
    ).toBeInTheDocument();
  });

  it("renders a hidden file input that accepts images", () => {
    render(
      <ImageUpload onUpload={vi.fn()} slug="test-article" />
    );

    const input = screen.getByLabelText(/upload image file/i) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.type).toBe("file");
    expect(input.accept).toBe("image/*");
  });

  it("does NOT show uploading, success, or error UI in idle state", () => {
    render(
      <ImageUpload onUpload={vi.fn()} slug="test-article" />
    );

    expect(screen.queryByText(/UPLOADING\.\.\./i)).not.toBeInTheDocument();
    expect(screen.queryByText(/CHANGE IMAGE/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/UPLOAD FAILED/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/RETRY/i)).not.toBeInTheDocument();
  });
});

describe("ImageUpload — success state with currentImageUrl (Requirement 5.10)", () => {
  const EXISTING_URL = "https://example.com/existing-image.jpg";

  it("shows image preview when currentImageUrl is provided", () => {
    render(
      <ImageUpload
        onUpload={vi.fn()}
        slug="test-article"
        currentImageUrl={EXISTING_URL}
      />
    );

    // Should render an img element with the provided URL
    const img = screen.getByRole("img", { name: /uploaded image preview/i }) as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe(EXISTING_URL);
  });

  it("displays the public URL text in the success panel", () => {
    render(
      <ImageUpload
        onUpload={vi.fn()}
        slug="test-article"
        currentImageUrl={EXISTING_URL}
      />
    );

    expect(screen.getByText(EXISTING_URL)).toBeInTheDocument();
  });

  it("shows the CHANGE IMAGE button in success state", () => {
    render(
      <ImageUpload
        onUpload={vi.fn()}
        slug="test-article"
        currentImageUrl={EXISTING_URL}
      />
    );

    expect(screen.getByRole("button", { name: /CHANGE IMAGE/i })).toBeInTheDocument();
  });

  it("resets to idle state when CHANGE IMAGE is clicked", () => {
    render(
      <ImageUpload
        onUpload={vi.fn()}
        slug="test-article"
        currentImageUrl={EXISTING_URL}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /CHANGE IMAGE/i }));

    // Should now show idle drop zone
    expect(
      screen.getByText(/DROP IMAGE FILE HERE OR CLICK TO BROWSE/i)
    ).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: /uploaded image preview/i })).not.toBeInTheDocument();
  });

  it("does NOT show idle drop zone when currentImageUrl is provided", () => {
    render(
      <ImageUpload
        onUpload={vi.fn()}
        slug="test-article"
        currentImageUrl={EXISTING_URL}
      />
    );

    expect(
      screen.queryByText(/DROP IMAGE FILE HERE OR CLICK TO BROWSE/i)
    ).not.toBeInTheDocument();
  });
});

describe("ImageUpload — success state after upload (Requirement 5.7)", () => {
  const UPLOADED_URL = "https://storage.example.com/articles/test-article-123.jpg";

  beforeEach(() => {
    mockUpload.mockResolvedValue(UPLOADED_URL);
  });

  it("calls onUpload with the returned URL after a successful upload", async () => {
    const onUpload = vi.fn();
    render(
      <ImageUpload onUpload={onUpload} slug="test-article" />
    );

    const input = screen.getByLabelText(/upload image file/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile()] } });

    await waitFor(() => {
      expect(onUpload).toHaveBeenCalledWith(UPLOADED_URL);
    });
  });

  it("shows image preview after successful upload", async () => {
    render(
      <ImageUpload onUpload={vi.fn()} slug="test-article" />
    );

    const input = screen.getByLabelText(/upload image file/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile()] } });

    await waitFor(() => {
      const img = screen.getByRole("img", { name: /uploaded image preview/i }) as HTMLImageElement;
      expect(img.src).toBe(UPLOADED_URL);
    });
  });

  it("shows CHANGE IMAGE button after successful upload", async () => {
    render(
      <ImageUpload onUpload={vi.fn()} slug="test-article" />
    );

    const input = screen.getByLabelText(/upload image file/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile()] } });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /CHANGE IMAGE/i })).toBeInTheDocument();
    });
  });
});

describe("ImageUpload — error state (Requirement 5.8)", () => {
  const ERROR_MSG = "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.";

  beforeEach(() => {
    mockUpload.mockRejectedValue(new Error(ERROR_MSG));
  });

  it("displays the error message when upload fails", async () => {
    render(
      <ImageUpload onUpload={vi.fn()} slug="test-article" />
    );

    const input = screen.getByLabelText(/upload image file/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile("bad.bmp", "image/bmp")] } });

    await waitFor(() => {
      expect(screen.getByText(ERROR_MSG)).toBeInTheDocument();
    });
  });

  it("shows the UPLOAD FAILED heading in error state", async () => {
    render(
      <ImageUpload onUpload={vi.fn()} slug="test-article" />
    );

    const input = screen.getByLabelText(/upload image file/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile()] } });

    await waitFor(() => {
      expect(screen.getByText(/UPLOAD FAILED/i)).toBeInTheDocument();
    });
  });

  it("shows a RETRY button in error state", async () => {
    render(
      <ImageUpload onUpload={vi.fn()} slug="test-article" />
    );

    const input = screen.getByLabelText(/upload image file/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile()] } });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /RETRY/i })).toBeInTheDocument();
    });
  });

  it("resets to idle state when RETRY is clicked", async () => {
    render(
      <ImageUpload onUpload={vi.fn()} slug="test-article" />
    );

    const input = screen.getByLabelText(/upload image file/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile()] } });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /RETRY/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /RETRY/i }));

    // Should return to idle drop zone
    expect(
      screen.getByText(/DROP IMAGE FILE HERE OR CLICK TO BROWSE/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/UPLOAD FAILED/i)).not.toBeInTheDocument();
  });

  it("does NOT call onUpload when upload fails", async () => {
    const onUpload = vi.fn();
    render(
      <ImageUpload onUpload={onUpload} slug="test-article" />
    );

    const input = screen.getByLabelText(/upload image file/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile()] } });

    await waitFor(() => {
      expect(screen.getByText(/UPLOAD FAILED/i)).toBeInTheDocument();
    });

    expect(onUpload).not.toHaveBeenCalled();
  });
});

describe("ImageUpload — drag-over visual feedback (Requirement 5.4)", () => {
  it("applies drag-over styling when a file is dragged over the drop zone", () => {
    render(
      <ImageUpload onUpload={vi.fn()} slug="test-article" />
    );

    const dropZone = screen.getByRole("button", {
      name: /drop image file here or click to browse/i,
    });

    fireEvent.dragOver(dropZone);

    // The border should change to yellow on drag-over
    expect(dropZone.className).toContain("border-[#e8c830]");
  });

  it("removes drag-over styling when drag leaves the drop zone", () => {
    render(
      <ImageUpload onUpload={vi.fn()} slug="test-article" />
    );

    const dropZone = screen.getByRole("button", {
      name: /drop image file here or click to browse/i,
    });

    fireEvent.dragOver(dropZone);
    fireEvent.dragLeave(dropZone);

    expect(dropZone.className).not.toContain("border-[#e8c830]");
  });
});
