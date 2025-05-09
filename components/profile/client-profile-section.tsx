"use client";

import React from 'react';
import { SystemInfo } from '@/components/ui/system-info';
import { CopyField } from '@/components/ui/copy-field';

interface ClientProfileSectionProps {
  userData: any;
}

export function ClientProfileSection({ userData }: ClientProfileSectionProps) {
  if (!userData) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">系统信息</h3>
        <div className="mb-4">
          <SystemInfo title="用户数据" className="bg-muted/30 border-border/30" />
        </div>
        <CopyField
          label="用户JSON数据"
          value={JSON.stringify(userData, null, 2)}
          valueClassName="whitespace-pre-wrap"
        />
      </div>
    </div>
  );
} 
