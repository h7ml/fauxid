"use client";

import { useState } from 'react';
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons';
import { useCopyToClipboard } from '@/utils/clipboard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CopyButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  value: string;
  className?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showTooltip?: boolean;
  tooltipMessage?: string;
  onCopy?: () => void;
}

export function CopyButton({
  value,
  className,
  variant = 'ghost',
  size = 'icon',
  showTooltip = true,
  tooltipMessage = 'Copy to clipboard',
  onCopy,
}: CopyButtonProps) {
  const [status, copy] = useCopyToClipboard();

  const handleCopy = async () => {
    await copy(value);
    onCopy?.();
  };

  const buttonContent = (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn(className)}
      aria-label="Copy to clipboard"
    >
      {status === 'copied' ? (
        <CheckIcon className="h-4 w-4 text-green-500" />
      ) : (
        <CopyIcon className="h-4 w-4" />
      )}
    </Button>
  );

  if (!showTooltip) {
    return buttonContent;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {buttonContent}
        </TooltipTrigger>
        <TooltipContent>
          <p>{status === 'copied' ? 'Copied!' : tooltipMessage}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 
