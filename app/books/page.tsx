"use client";

import { useEffect, useState } from "react";
import { Book, BookFormData } from "./types";
import { getBooks, createBook, updateBook, deleteBook } from "./services";
import { BookForm } from "./components/BookForm";
import { BookItem } from "./components/BookItem";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Loader2, BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | undefined>(undefined);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBooks(books);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredBooks(
        books.filter(
          (book) =>
            book.title.toLowerCase().includes(term) ||
            book.author.toLowerCase().includes(term) ||
            (book.genre && book.genre.toLowerCase().includes(term)) ||
            (book.description && book.description.toLowerCase().includes(term))
        )
      );
    }
  }, [searchTerm, books]);

  async function fetchBooks() {
    setLoading(true);
    setError(null);
    try {
      const data = await getBooks();
      setBooks(data);
      setFilteredBooks(data);
    } catch (err) {
      setError("加载图书失败，请稍后重试。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddEditBook(data: BookFormData) {
    setIsSubmitting(true);
    setError(null);
    try {
      if (currentBook) {
        // 更新现有图书
        const updatedBook = await updateBook(currentBook.id, data);
        setBooks(books.map(book => book.id === updatedBook.id ? updatedBook : book));
      } else {
        // 添加新图书
        const newBook = await createBook(data);
        setBooks([newBook, ...books]);
      }
      setIsDialogOpen(false);
      setCurrentBook(undefined);
    } catch (err) {
      const action = currentBook ? "更新" : "创建";
      setError(`${action}图书失败，请重试。`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteBook(id: string) {
    try {
      await deleteBook(id);
      setBooks(books.filter(book => book.id !== id));
    } catch (err) {
      setError("删除图书失败，请重试。");
      console.error(err);
    }
  }

  function handleEdit(book: Book) {
    setCurrentBook(book);
    setIsDialogOpen(true);
  }

  function handleAddNew() {
    setCurrentBook(undefined);
    setIsDialogOpen(true);
  }

  return (
    <div className="container mx-auto py-12 px-4 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">我的藏书</h1>
            <p className="text-gray-500">管理您珍贵的图书收藏</p>
          </div>
          <Button onClick={handleAddNew} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            添加新书
          </Button>
        </div>

        <div className="mb-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="搜索图书标题、作者或类型..."
            className="pl-10 py-6 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded mb-6 shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            <span className="ml-4 text-lg text-gray-600">正在加载图书...</span>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl shadow-sm border border-dashed border-gray-200">
            <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {searchTerm ? "未找到匹配图书" : "暂无图书"}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm
                ? "尝试使用不同的搜索词，或清除搜索以查看所有图书。"
                : "开始添加您的第一本书，建立您的个人图书馆。"}
            </p>
            {!searchTerm && (
              <Button onClick={handleAddNew} className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                添加新书
              </Button>
            )}
            {searchTerm && (
              <Button
                variant="outline"
                onClick={() => setSearchTerm("")}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                清除搜索
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <BookItem
                key={book.id}
                book={book}
                onEdit={handleEdit}
                onDelete={handleDeleteBook}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              {currentBook ? "编辑图书" : "添加新书"}
            </DialogTitle>
          </DialogHeader>
          <BookForm
            book={currentBook}
            onSubmit={handleAddEditBook}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
