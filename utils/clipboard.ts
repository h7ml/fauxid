"use client";

import { useState, useCallback } from 'react';

type CopyStatus = 'inactive' | 'copied' | 'failed';

export function useCopyToClipboard(resetInterval = 2000): [CopyStatus, (text: string) => Promise<boolean>] {
  const [status, setStatus] = useState<CopyStatus>('inactive');

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
      
      const timer = setTimeout(() => {
        setStatus('inactive');
      }, resetInterval);
      
      return true;
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setStatus('failed');
      
      const timer = setTimeout(() => {
        setStatus('inactive');
      }, resetInterval);
      
      return false;
    }
  }, [resetInterval]);

  return [status, copy];
} 
