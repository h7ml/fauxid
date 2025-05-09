"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { CopyButton } from './copy-button';

interface CopyFieldProps {
  label?: string;
  value: string;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  showLabel?: boolean;
}

export function CopyField({
  label,
  value,
  className,
  labelClassName,
  valueClassName,
  showLabel = true,
}: CopyFieldProps) {
  return (
    <div className={cn('flex flex-col space-y-1', className)}>
      {showLabel && label && (
        <span className={cn('text-sm font-medium text-muted-foreground', labelClassName)}>
          {label}
        </span>
      )}
      <div className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2">
        <code className={cn('text-sm font-mono', valueClassName)}>
          {value}
        </code>
        <CopyButton
          value={value}
          className="ml-2 h-8 w-8"
          tooltipMessage={`Copy ${label || 'value'}`}
        />
      </div>
    </div>
  );
} 
