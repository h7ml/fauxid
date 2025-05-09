"use client";

import React, { useEffect, useState } from 'react';
import { CopyField } from './copy-field';
import { cn } from '@/lib/utils';

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
    <div className={cn("space-y-4 rounded-lg border p-4", className)}>
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="grid gap-3">
        {systemInfo.os && (
          <CopyField label="操作系统" value={systemInfo.os} />
        )}
        {systemInfo.browser && (
          <CopyField label="浏览器" value={systemInfo.browser} />
        )}
        {systemInfo.device && (
          <CopyField label="设备类型" value={systemInfo.device} />
        )}
        {systemInfo.screenSize && (
          <CopyField label="屏幕分辨率" value={systemInfo.screenSize} />
        )}
        {systemInfo.timeZone && (
          <CopyField label="时区" value={systemInfo.timeZone} />
        )}
        {systemInfo.language && (
          <CopyField label="语言" value={systemInfo.language} />
        )}
        {systemInfo.userAgent && (
          <CopyField label="User Agent" value={systemInfo.userAgent} />
        )}
      </div>
    </div>
  );
} 
