// Feature: admin-crud-supabase, Property 3: invalid MIME type rejection
// Feature: admin-crud-supabase, Property 4: file size limit enforcement

/**
 * Property 3: Invalid MIME Type Rejection
 *
 * For any string that is not in the set {'image/jpeg', 'image/png',
 * 'image/webp', 'image/gif'}, calling uploadArticleImage with a File of
 * that MIME type should throw an error with the message
 * "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed."
 *
 * Validates: Requirements 4.4
 *
 * Property 4: File Size Limit Enforcement
 *
 * For any file size greater than 5,242,880 bytes (5MB) with a valid MIME
 * type, calling uploadArticleImage should throw an error with the message
 * "File too large. Maximum size is 5MB."
 * Files at exactly 5MB or below with a valid MIME type should NOT throw
 * for size reasons.
 *
 * Validates: Requirements 4.5
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fc from "fast-check";

// ─── Mock the browser Supabase client ────────────────────────────────────────
// vi.hoisted() ensures variables are available inside the vi.mock() factory.

const { mockUpload, mockGetPublicUrl, mockStorageFrom, mockCreateClient } =
  vi.hoisted(() => {
    const mockUpload = vi.fn();
    const mockGetPublicUrl = vi.fn(() => ({
      data: { publicUrl: "https://example.com/image.jpg" },
    }));
    const mockStorageFrom = vi.fn(() => ({
      upload: mockUpload,
      getPublicUrl: mockGetPublicUrl,
    }));
    const mockCreateClient = vi.fn(() => ({
      storage: { from: mockStorageFrom },
    }));

    return { mockUpload, mockGetPublicUrl, mockStorageFrom, mockCreateClient };
  });

vi.mock("@/lib/supabase/client", () => ({
  createClient: mockCreateClient,
}));

// Import AFTER mocking
import { uploadArticleImage, ALLOWED_TYPES, MAX_SIZE_BYTES } from "./storage";

// ─── Custom File mock for Node environment ────────────────────────────────────
// The browser File API is not available in the Node test environment.
// We create a minimal mock that satisfies the interface used by uploadArticleImage.

class MockFile {
  name: string;
  type: string;
  size: number;

  constructor(
    _parts: unknown[],
    name: string,
    options: { type?: string; size?: number } = {}
  ) {
    this.name = name;
    this.type = options.type ?? "";
    // Allow explicit size override for testing without allocating real buffers
    this.size = options.size ?? 0;
  }
}

// ─── Arbitraries ──────────────────────────────────────────────────────────────

/** Generates strings that are NOT in the allowed MIME type set */
const invalidMimeArb = fc
  .string({ minLength: 0, maxLength: 100 })
  .filter((s) => !(ALLOWED_TYPES as readonly string[]).includes(s));

/** Generates a valid MIME type from the allowed set */
const validMimeArb = fc.constantFrom(...ALLOWED_TYPES);

/** Generates file sizes strictly greater than MAX_SIZE_BYTES (5MB) */
const oversizedFileArb = fc.integer({
  min: MAX_SIZE_BYTES + 1,
  max: MAX_SIZE_BYTES + 50 * 1024 * 1024, // up to 55MB
});

/** Generates file sizes at or below MAX_SIZE_BYTES (0 to 5MB inclusive) */
const validSizeArb = fc.integer({ min: 0, max: MAX_SIZE_BYTES });

/** URL-safe slug */
const slugArb = fc
  .stringMatching(/^[a-z][a-z0-9-]{0,49}$/)
  .filter((s) => s.length >= 1);

// ─── Property 3: Invalid MIME Type Rejection ─────────────────────────────────

describe("Property 3: Invalid MIME Type Rejection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Ensure upload would succeed if validation passes (it shouldn't be reached)
    mockUpload.mockResolvedValue({ data: { path: "test.jpg" }, error: null });
  });

  it(
    "throws the exact error message for any non-allowed MIME type",
    async () => {
      await fc.assert(
        fc.asyncProperty(invalidMimeArb, slugArb, async (invalidMime, slug) => {
          const file = new MockFile([], "test", {
            type: invalidMime,
            size: 1024,
          }) as unknown as File;

          await expect(uploadArticleImage(file, slug)).rejects.toThrow(
            "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed."
          );

          // Supabase upload must NOT be called — validation is synchronous
          expect(mockUpload).not.toHaveBeenCalled();
        }),
        { numRuns: 100 }
      );
    }
  );

  it(
    "does NOT throw for MIME type rejection when MIME type is valid",
    async () => {
      await fc.assert(
        fc.asyncProperty(validMimeArb, slugArb, async (validMime, slug) => {
          const file = new MockFile([], "test", {
            type: validMime,
            size: 1024,
          }) as unknown as File;

          // Upload succeeds — no MIME error should be thrown
          mockUpload.mockResolvedValue({
            data: { path: "test.jpg" },
            error: null,
          });

          await expect(uploadArticleImage(file, slug)).resolves.not.toThrow();
        }),
        { numRuns: 100 }
      );
    }
  );
});

// ─── Property 4: File Size Limit Enforcement ─────────────────────────────────

describe("Property 4: File Size Limit Enforcement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpload.mockResolvedValue({ data: { path: "test.jpg" }, error: null });
  });

  it(
    "throws the exact error message for any file size exceeding 5MB",
    async () => {
      await fc.assert(
        fc.asyncProperty(
          oversizedFileArb,
          validMimeArb,
          slugArb,
          async (size, validMime, slug) => {
            const file = new MockFile([], "test", {
              type: validMime,
              size,
            }) as unknown as File;

            await expect(uploadArticleImage(file, slug)).rejects.toThrow(
              "File too large. Maximum size is 5MB."
            );

            // Supabase upload must NOT be called — validation is synchronous
            expect(mockUpload).not.toHaveBeenCalled();
          }
        ),
        { numRuns: 100 }
      );
    }
  );

  it(
    "does NOT throw for size reasons when file size is at or below 5MB",
    async () => {
      await fc.assert(
        fc.asyncProperty(
          validSizeArb,
          validMimeArb,
          slugArb,
          async (size, validMime, slug) => {
            const file = new MockFile([], "test", {
              type: validMime,
              size,
            }) as unknown as File;

            // Upload succeeds — no size error should be thrown
            mockUpload.mockResolvedValue({
              data: { path: "test.jpg" },
              error: null,
            });

            // Should not throw "File too large" — may resolve or throw for other reasons
            let thrownError: Error | null = null;
            try {
              await uploadArticleImage(file, slug);
            } catch (err) {
              thrownError = err as Error;
            }

            if (thrownError !== null) {
              expect(thrownError.message).not.toBe(
                "File too large. Maximum size is 5MB."
              );
            }
          }
        ),
        { numRuns: 100 }
      );
    }
  );

  it(
    "file at exactly 5MB (5,242,880 bytes) does NOT throw for size reasons",
    async () => {
      const file = new MockFile([], "test", {
        type: "image/jpeg",
        size: MAX_SIZE_BYTES, // exactly 5MB
      }) as unknown as File;

      mockUpload.mockResolvedValue({ data: { path: "test.jpg" }, error: null });

      // Should not throw "File too large"
      let thrownError: Error | null = null;
      try {
        await uploadArticleImage(file, "test-slug");
      } catch (err) {
        thrownError = err as Error;
      }

      if (thrownError !== null) {
        expect(thrownError.message).not.toBe("File too large. Maximum size is 5MB.");
      }
    }
  );

  it(
    "file at exactly 5MB + 1 byte throws for size reasons",
    async () => {
      const file = new MockFile([], "test", {
        type: "image/jpeg",
        size: MAX_SIZE_BYTES + 1,
      }) as unknown as File;

      await expect(uploadArticleImage(file, "test-slug")).rejects.toThrow(
        "File too large. Maximum size is 5MB."
      );
    }
  );
});
