import { z } from "zod";

export const ArticleSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/),

  title: z.string().min(1).max(200),

  category: z.enum(["games", "coding", "science", "study", "story"]),

  excerpt: z.string().min(1).max(500),

  content: z.string().min(1).max(50000),

  image_src: z.string().url().nullable().optional(),

  published: z.boolean(),
});

export type ArticleInput = z.infer<typeof ArticleSchema>;
