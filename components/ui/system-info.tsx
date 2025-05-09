"use client";

import React, { useEffect, useState } from 'react';
import { CopyField } from './copy-field';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SystemInfo {
  os?: string;
  browser?: string;
  device?: string;
  screenSize?: string;
  timeZone?: string;
  language?: string;
  userAgent?: string;
}

interface SystemInfoProps {
  className?: string;
  title?: string;
}

export function SystemInfo({ className, title = "系统信息" }: SystemInfoProps) {
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const info: SystemInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenSize: `${window.screen.width}x${window.screen.height}`,
    };

    // 检测操作系统
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf("Win") !== -1) info.os = "Windows";
    else if (userAgent.indexOf("Mac") !== -1) info.os = "MacOS";
    else if (userAgent.indexOf("Linux") !== -1) info.os = "Linux";
    else if (userAgent.indexOf("Android") !== -1) info.os = "Android";
    else if (userAgent.indexOf("iPhone") !== -1 || userAgent.indexOf("iPad") !== -1) info.os = "iOS";
    else info.os = "Unknown";

    // 检测浏览器
    if (userAgent.indexOf("Chrome") !== -1) info.browser = "Chrome";
    else if (userAgent.indexOf("Firefox") !== -1) info.browser = "Firefox";
    else if (userAgent.indexOf("Safari") !== -1) info.browser = "Safari";
    else if (userAgent.indexOf("Edge") !== -1) info.browser = "Edge";
    else if (userAgent.indexOf("MSIE") !== -1 || userAgent.indexOf("Trident") !== -1) info.browser = "Internet Explorer";
    else info.browser = "Unknown";

    // 检测设备类型
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)) {
      info.device = "Mobile";
    } else {
      info.device = "Desktop";
    }

    setSystemInfo(info);
  }, []);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("rounded-lg border border-border/30", className)}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-base font-medium">{title}</h2>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span className="sr-only">
              {isOpen ? "关闭" : "展开"} {title}
            </span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="px-4 pb-4">
        <div className="grid gap-3">
          {systemInfo.os && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">操作系统</span>
              <span className="text-sm font-medium">{systemInfo.os}</span>
            </div>
          )}
          {systemInfo.browser && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">浏览器</span>
              <span className="text-sm font-medium">{systemInfo.browser}</span>
            </div>
          )}
          {systemInfo.device && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">设备类型</span>
              <span className="text-sm font-medium">{systemInfo.device}</span>
            </div>
          )}
          {systemInfo.screenSize && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">屏幕分辨率</span>
              <span className="text-sm font-medium">{systemInfo.screenSize}</span>
            </div>
          )}
          {systemInfo.timeZone && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">时区</span>
              <span className="text-sm font-medium">{systemInfo.timeZone}</span>
            </div>
          )}
          {systemInfo.language && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">语言</span>
              <span className="text-sm font-medium">{systemInfo.language}</span>
            </div>
          )}
        </div>

        {systemInfo.userAgent && (
          <div className="mt-3 pt-3 border-t border-border/30">
            <p className="text-xs text-muted-foreground mb-1">User Agent</p>
            <div className="bg-muted/50 rounded p-2 overflow-auto">
              <code className="text-xs font-mono break-all">{systemInfo.userAgent}</code>
            </div>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
} 
