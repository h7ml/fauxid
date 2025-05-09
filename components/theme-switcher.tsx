"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 18;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full bg-primary/5 hover:bg-primary/10 transition-colors"
        >
          {theme === "light" ? (
            <Sun
              key="light"
              size={ICON_SIZE}
              className="text-primary transition-transform duration-300 rotate-0"
            />
          ) : theme === "dark" ? (
            <Moon
              key="dark"
              size={ICON_SIZE}
              className="text-primary transition-transform duration-300 rotate-0"
            />
          ) : (
            <Laptop
              key="system"
              size={ICON_SIZE}
              className="text-primary transition-transform duration-300 rotate-0"
            />
          )}
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="animate-slideUp min-w-32">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(e) => setTheme(e)}
        >
          <DropdownMenuRadioItem
            className="flex items-center gap-2 cursor-pointer"
            value="light"
          >
            <Sun size={ICON_SIZE - 2} className="text-amber-500" />{" "}
            <span>浅色</span>
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem
            className="flex items-center gap-2 cursor-pointer"
            value="dark"
          >
            <Moon size={ICON_SIZE - 2} className="text-blue-500" />{" "}
            <span>深色</span>
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem
            className="flex items-center gap-2 cursor-pointer"
            value="system"
          >
            <Laptop size={ICON_SIZE - 2} className="text-emerald-500" />{" "}
            <span>系统</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };
