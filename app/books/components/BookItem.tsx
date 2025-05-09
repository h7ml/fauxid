"use client";

import { Book } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Star, Trash, Edit, BookOpen, Calendar, Hash } from "lucide-react";

interface BookItemProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => Promise<void>;
}

export function BookItem({ book, onEdit, onDelete }: BookItemProps) {
  const handleDelete = async () => {
    if (confirm("确定要删除这本书吗？")) {
      await onDelete(book.id);
    }
  };

  const placeholderCover = "https://via.placeholder.com/150x200?text=无封面";

  return (
    <Card className="h-full flex flex-col overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200">
      <div className="relative pt-[80%] bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {book.cover_image_url ? (
            <img
              src={book.cover_image_url}
              alt={`${book.title}的封面`}
              className="object-cover w-full h-full"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full bg-gray-200 text-gray-400">
              <BookOpen className="h-12 w-12 mb-2" />
              <span className="text-sm">无封面图片</span>
            </div>
          )}
        </div>
      </div>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-lg font-bold line-clamp-1 text-gray-800">{book.title}</CardTitle>
        <CardDescription className="line-clamp-1 text-gray-600">作者：{book.author}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow px-4 pb-2">
        <div className="flex flex-wrap items-center gap-2 mb-3 text-sm">
          {book.rating && (
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md">
              <Star className="h-3.5 w-3.5 text-yellow-500 mr-1" fill="currentColor" />
              <span className="text-yellow-700">{book.rating.toFixed(1)}</span>
            </div>
          )}

          {book.genre && (
            <span className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs">
              {book.genre}
            </span>
          )}

          {book.page_count && (
            <div className="flex items-center text-xs text-gray-500">
              <Hash className="h-3 w-3 mr-1" />
              <span>{book.page_count}页</span>
            </div>
          )}

          {book.published_date && (
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{new Date(book.published_date).getFullYear()}</span>
            </div>
          )}
        </div>

        {book.description && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-2">{book.description}</p>
        )}
      </CardContent>

      <CardFooter className="pt-2 px-4 pb-4 flex justify-between gap-2 mt-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(book)}
          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          <Edit className="h-3.5 w-3.5 mr-1" />
          编辑
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
          onClick={handleDelete}
        >
          <Trash className="h-3.5 w-3.5 mr-1" />
          删除
        </Button>
      </CardFooter>
    </Card>
  );
} 
