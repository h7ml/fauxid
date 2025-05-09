"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { uploadAvatar } from "@/app/actions/profile-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AvatarUploadProps {
  initialAvatarUrl?: string | null;
  email?: string;
}

export default function AvatarUpload({ initialAvatarUrl, email }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("avatar", file);

      const result = await uploadAvatar(formData);

      if (result.success && result.data) {
        setAvatarUrl(result.data.avatarUrl);
        toast({
          title: "上传成功",
          description: "头像已更新",
          variant: "default",
        });
      } else {
        toast({
          title: "上传失败",
          description: result.error || "未知错误",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("上传处理错误:", error);
      toast({
        title: "上传失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative group">
        <Avatar className="h-24 w-24 bg-primary/10 mb-4">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt="用户头像" />
          ) : (
            <AvatarFallback className="text-primary text-2xl">
              {email?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          )}
        </Avatar>

        <button
          onClick={triggerFileInput}
          disabled={isUploading}
          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="更换头像"
        >
          {isUploading ? (
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          ) : (
            <Camera className="h-6 w-6 text-white" />
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="上传头像"
      />

      <Button
        variant="outline"
        size="sm"
        onClick={triggerFileInput}
        disabled={isUploading}
        className="mt-2"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            上传中...
          </>
        ) : (
          "更换头像"
        )}
      </Button>
    </div>
  );
} 
