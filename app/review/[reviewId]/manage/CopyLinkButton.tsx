'use client';

import { Button } from '@/components/ui/button';

interface CopyLinkButtonProps {
  url: string;
}

export function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      Copy Link
    </Button>
  );
}
