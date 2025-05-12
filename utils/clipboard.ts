"use client";

import { useState, useCallback } from 'react';

type CopyStatus = 'inactive' | 'copied' | 'failed';

/**
 * Safely tries to copy text to clipboard using different methods
 * Falls back to creating a temporary textarea element if the Clipboard API is not available
 */
export const safeCopyToClipboard = async (text: string): Promise<boolean> => {
  // Try using the Clipboard API first
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API failed:', err);
      // Fall through to fallback
    }
  }

  // Fallback using document.execCommand (older browsers)
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (err) {
    console.error('Failed to copy text using fallback:', err);
    return false;
  }
};

export function useCopyToClipboard(resetInterval = 2000): [CopyStatus, (text: string) => Promise<boolean>] {
  const [status, setStatus] = useState<CopyStatus>('inactive');

  const copy = useCallback(async (text: string) => {
    try {
      const success = await safeCopyToClipboard(text);
      
      if (success) {
        setStatus('copied');
        
        const timer = setTimeout(() => {
          setStatus('inactive');
        }, resetInterval);
        
        return true;
      } else {
        throw new Error('Copy operation failed');
      }
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
