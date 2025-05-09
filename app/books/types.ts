import { Database } from "@/lib/database.types";

export type Book = Database["public"]["Tables"]["books"]["Row"];

export type NewBook = Omit<Book, "id" | "created_at" | "updated_at"> & {
  id?: string;
};

export type BookUpdate = Partial<Omit<Book, "id" | "created_at" | "updated_at">>;

export type BookFormData = {
  title: string;
  author: string;
  isbn?: string | null;
  description?: string | null;
  cover_image_url?: string | null;
  published_date?: string | null;
  genre?: string | null;
  page_count?: number | null;
  rating?: number | null;
}; 
