export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string
          title: string
          author: string
          isbn: string | null
          description: string | null
          cover_image_url: string | null
          published_date: string | null
          genre: string | null
          page_count: number | null
          rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          isbn?: string | null
          description?: string | null
          cover_image_url?: string | null
          published_date?: string | null
          genre?: string | null
          page_count?: number | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          isbn?: string | null
          description?: string | null
          cover_image_url?: string | null
          published_date?: string | null
          genre?: string | null
          page_count?: number | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 
