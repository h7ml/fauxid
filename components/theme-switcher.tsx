"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Paintbrush, Palette, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [brandMode, setBrandMode] = useState<"apple" | "xiaomi">("apple");

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);

    // 检查body标签上是否有xiaomi类
    const hasXiaomiClass = document.documentElement.classList.contains("xiaomi");
    if (hasXiaomiClass) {
      setBrandMode("xiaomi");
    } else {
      setBrandMode("apple");
    }
  }, []);

  // 切换品牌主题
  const toggleBrandMode = (mode: "apple" | "xiaomi") => {
    if (mode === "xiaomi") {
      document.documentElement.classList.add("xiaomi");
      setBrandMode("xiaomi");
    } else {
      document.documentElement.classList.remove("xiaomi");
      setBrandMode("apple");
    }
  };

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 18;

  // 确定当前的亮/暗模式
  const isDark = resolvedTheme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full bg-primary/5 hover:bg-primary/10 transition-colors"
        >
          <Palette
            size={ICON_SIZE}
            className="text-primary transition-all duration-300"
          />
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="animate-slideUp min-w-56">
        <DropdownMenuLabel>外观</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">品牌风格</DropdownMenuLabel>

          <DropdownMenuItem
            className={`flex items-center gap-2 cursor-pointer ${brandMode === "apple" ? "bg-accent" : ""}`}
            onClick={() => toggleBrandMode("apple")}
          >
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.108 2.27C8.594 1.647 8.885 0.844 8.885 0C8.885 0.032 8.885 0.056 8.885 0.088C8.885 0.783 8.629 1.423 8.19 1.91C7.257 2.931 5.981 2.746 5.981 2.746C5.981 2.746 5.832 3.717 6.765 4.611C7.565 5.384 8.581 5.124 9.21 4.866C10.631 4.258 11.163 2.507 11.163 2.507C11.163 2.507 9.557 1.799 8.108 2.27ZM9.113 5.156C8.437 5.448 5.301 7.081 7.509 10C7.509 10 8.413 9.071 9.485 9.071C10.651 9.071 11.131 10 11.131 10C11.131 10 11.739 9.095 11.739 8.103C11.739 7.249 11.211 6.71 10.563 6.71C9.905 6.71 9.437 7.184 9.113 7.184C8.789 7.184 8.413 6.75 9.113 5.156ZM3 9.071C2.073 9.071 1.363 9.972 1.363 11.071C1.363 12.171 2.073 13.071 3 13.071C3.927 13.071 4.636 12.171 4.636 11.071C4.636 9.972 3.927 9.071 3 9.071ZM7 9.071C6.073 9.071 5.363 9.972 5.363 11.071C5.363 12.171 6.073 13.071 7 13.071C7.927 13.071 8.636 12.171 8.636 11.071C8.636 9.972 7.927 9.071 7 9.071Z" fill="currentColor" />
              </svg>
            </div>
            <span>Apple风格</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className={`flex items-center gap-2 cursor-pointer ${brandMode === "xiaomi" ? "bg-accent" : ""}`}
            onClick={() => toggleBrandMode("xiaomi")}
          >
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3.5C2 2.67157 2.67157 2 3.5 2H7V7H2V3.5Z" fill="currentColor" />
                <path d="M2 8H7V12H3.5C2.67157 12 2 11.3284 2 10.5V8Z" fill="currentColor" />
                <path d="M8 2H10.5C11.3284 2 12 2.67157 12 3.5V7H8V2Z" fill="currentColor" />
                <path d="M8 8H12V10.5C12 11.3284 11.3284 12 10.5 12H8V8Z" fill="currentColor" />
              </svg>
            </div>
            <span>小米风格</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">颜色模式</DropdownMenuLabel>

          <DropdownMenuItem
            className={`flex items-center gap-2 cursor-pointer ${!isDark ? "bg-accent" : ""}`}
            onClick={() => setTheme("light")}
          >
            <Sun size={ICON_SIZE - 2} className="text-amber-500" />
            <span>浅色</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className={`flex items-center gap-2 cursor-pointer ${isDark ? "bg-accent" : ""}`}
            onClick={() => setTheme("dark")}
          >
            <Moon size={ICON_SIZE - 2} className="text-blue-500" />
            <span>深色</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setTheme("system")}
          >
            <Laptop size={ICON_SIZE - 2} className="text-emerald-500" />
            <span>跟随系统</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };
