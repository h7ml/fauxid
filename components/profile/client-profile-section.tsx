"use client";

import React, { useState } from 'react';
import { SystemInfo } from '@/components/ui/system-info';
import { CopyField } from '@/components/ui/copy-field';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Code } from 'lucide-react';

interface ClientProfileSectionProps {
  userData: any;
}

export function ClientProfileSection({ userData }: ClientProfileSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!userData) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
          <Code className="w-4 h-4 mr-2" />
          系统信息
        </h3>
        <div className="mb-4">
          <SystemInfo title="用户数据" className="bg-muted/30 border-border/30" />
        </div>

        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-full rounded-md border border-border/30 bg-muted/30"
        >
          <div className="flex items-center justify-between px-4 py-3">
            <h4 className="text-sm font-medium">用户JSON数据</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {isOpen ? "关闭" : "展开"} 用户JSON数据
                </span>
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="px-4 pb-3">
            <div className="rounded-md bg-muted/50 p-3">
              <code className="whitespace-pre-wrap text-sm font-mono block overflow-auto max-h-[400px]">
                {JSON.stringify(userData, null, 2)}
              </code>
            </div>
            <div className="mt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(JSON.stringify(userData, null, 2))}
              >
                复制数据
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
} 
