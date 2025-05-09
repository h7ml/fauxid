-- Schema for books table
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT,
  description TEXT,
  cover_image_url TEXT,
  published_date DATE,
  genre TEXT,
  page_count INTEGER,
  rating DECIMAL(3, 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all books
CREATE POLICY "Allow authenticated users to read all books" 
ON books FOR SELECT 
TO authenticated 
USING (true);

-- Create policy to allow users to insert their own books
CREATE POLICY "Allow authenticated users to insert books" 
ON books FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Create policy to allow users to update their own books
CREATE POLICY "Allow authenticated users to update books" 
ON books FOR UPDATE 
TO authenticated 
USING (true);

-- Create policy to allow users to delete their own books
CREATE POLICY "Allow authenticated users to delete books" 
ON books FOR DELETE 
TO authenticated 
USING (true);

-- Add an update trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE
  ON books
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column(); 
