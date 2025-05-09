"use client";

import React from 'react';
import { SystemInfo } from '@/components/ui/system-info';
import { CopyField } from '@/components/ui/copy-field';

interface SystemInfoSectionProps {
  title?: string;
  className?: string;
  userData?: any;
}

export function SystemInfoSection({ title, className, userData }: SystemInfoSectionProps) {
  return (
    <div>
      <SystemInfo title={title} className={className} />
      {userData && (
        <CopyField
          label="用户JSON数据"
          value={JSON.stringify(userData, null, 2)}
          valueClassName="whitespace-pre-wrap"
        />
      )}
    </div>
  );
} 
