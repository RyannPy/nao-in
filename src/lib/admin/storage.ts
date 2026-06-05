import { createClient as createBrowserClient } from "@/lib/supabase/client";

export const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Maps a MIME type to its corresponding file extension.
 * Only handles the four allowed image MIME types.
 */
export function getExtFromMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

/**
 * Uploads an article image to the Supabase Storage `articles` bucket.
 *
 * Validates MIME type and file size before uploading.
 * Returns the public URL of the uploaded file.
 *
 * @param file - The File object to upload (from a browser file input or drop event)
 * @param slug - The article slug used to generate the storage filename
 * @returns The public URL of the uploaded image
 * @throws If the MIME type is not allowed, the file is too large, or the upload fails
 */
export async function uploadArticleImage(
  file: File,
  slug: string,
): Promise<string> {
  // Validate MIME type
  if (!(ALLOWED_TYPES as readonly string[]).includes(file.type)) {
    throw new Error(
      "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.",
    );
  }

  // Validate file size
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("File too large. Maximum size is 5MB.");
  }

  const supabase = createBrowserClient();
  const filename = `${crypto.randomUUID()}.${getExtFromMime(file.type)}`;

  const { error } = await supabase.storage
    .from("articles")
    .upload(filename, file, { upsert: false });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from("articles").getPublicUrl(filename);
  return data.publicUrl;
}

export function extractStoragePath(url: string) {
  try {
    const parsed = new URL(url);

    const parts = parsed.pathname.split("/");

    const bucketIndex = parts.indexOf("articles");

    if (bucketIndex === -1) return null;

    return parts.slice(bucketIndex + 1).join("/");
  } catch {
    return null;
  }
}
