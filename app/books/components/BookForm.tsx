"use client";

import { useState } from "react";
import { Book, BookFormData } from "../types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const bookSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  author: z.string().min(1, "作者不能为空"),
  isbn: z.string().optional(),
  description: z.string().optional(),
  cover_image_url: z.string().url("请输入有效的URL地址").optional().or(z.literal("")),
  published_date: z.string().optional(),
  genre: z.string().optional(),
  page_count: z.coerce.number().positive("页数必须为正数").optional(),
  rating: z.coerce.number().min(0, "评分最小为0").max(5, "评分最大为5").optional(),
});

type BookFormProps = {
  book?: Book;
  onSubmit: (data: BookFormData) => Promise<void>;
  isSubmitting: boolean;
};

export function BookForm({ book, onSubmit, isSubmitting }: BookFormProps) {
  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book?.title || "",
      author: book?.author || "",
      isbn: book?.isbn || "",
      description: book?.description || "",
      cover_image_url: book?.cover_image_url || "",
      published_date: book?.published_date ? new Date(book.published_date).toISOString().split("T")[0] : "",
      genre: book?.genre || "",
      page_count: book?.page_count || undefined,
      rating: book?.rating || undefined,
    },
  });

  const handleSubmit = async (data: z.infer<typeof bookSchema>) => {
    try {
      await onSubmit(data);
      if (!book) {
        form.reset();
      }
    } catch (error) {
      console.error("表单提交错误:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">书名</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="输入书名"
                      {...field}
                      className="rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">作者</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="输入作者姓名"
                      {...field}
                      className="rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="isbn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">ISBN</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="输入ISBN编号"
                      {...field}
                      className="rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">类型</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="例如：小说、科技、历史..."
                      {...field}
                      className="rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="published_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">出版日期</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className="rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="page_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">页数</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="输入页数"
                      {...field}
                      className="rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">评分 (0-5)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      placeholder="输入评分"
                      {...field}
                      className="rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="cover_image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">封面图片URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/cover.jpg"
                    {...field}
                    className="rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  输入图书封面的网络图片地址
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">图书简介</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="输入图书简介或内容摘要..."
                    className="min-h-[120px] rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
            disabled={isSubmitting}
          >
            重置
          </Button>
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "保存中..." : book ? "更新图书" : "添加图书"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 
