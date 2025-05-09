"use client";

import { createClient } from "@/utils/supabase/client";
import { Book, BookFormData, NewBook, BookUpdate } from "./types";

export async function getBooks(): Promise<Book[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching books:", error);
    throw new Error(`Error fetching books: ${error.message}`);
  }

  return data || [];
}

export async function getBook(id: string): Promise<Book | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching book with id ${id}:`, error);
    throw new Error(`Error fetching book: ${error.message}`);
  }

  return data;
}

export async function createBook(book: BookFormData): Promise<Book> {
  const supabase = createClient();
  const newBook: NewBook = {
    ...book,
    published_date: book.published_date || null,
    page_count: book.page_count || null,
    rating: book.rating || null,
  };

  const { data, error } = await supabase
    .from("books")
    .insert(newBook)
    .select()
    .single();

  if (error) {
    console.error("Error creating book:", error);
    throw new Error(`Error creating book: ${error.message}`);
  }

  return data;
}

export async function updateBook(id: string, book: BookFormData): Promise<Book> {
  const supabase = createClient();
  const bookUpdate: BookUpdate = {
    ...book,
    published_date: book.published_date || null,
    page_count: book.page_count || null,
    rating: book.rating || null,
  };

  const { data, error } = await supabase
    .from("books")
    .update(bookUpdate)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating book with id ${id}:`, error);
    throw new Error(`Error updating book: ${error.message}`);
  }

  return data;
}

export async function deleteBook(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("books")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting book with id ${id}:`, error);
    throw new Error(`Error deleting book: ${error.message}`);
  }
} 
