"use client";

import { useEffect } from "react";

type AutoDismissNoticeProps = {
  message: string;
  className?: string;
  duration?: number;
  onDismiss: () => void;
};

export function AutoDismissNotice({
  message,
  className,
  duration = 3500,
  onDismiss,
}: AutoDismissNoticeProps) {
  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = window.setTimeout(onDismiss, duration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [duration, message, onDismiss]);

  if (!message) {
    return null;
  }

  return <p className={className}>{message}</p>;
}
