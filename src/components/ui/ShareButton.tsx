
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  className?: string;
  size?: 'sm' | 'lg' | 'default';
  variant?: 'default' | 'outline' | 'secondary';
}

const ShareButton = ({ className, size = 'default', variant = 'default' }: ShareButtonProps) => {
  const { toast } = useToast();

  const handleShare = async () => {
    const shareData = {
      title: 'SendBoulder - Your AI Climbing Coach',
      text: 'Stop guessing, start sending! Check out this amazing AI climbing coach that helps you level up faster.',
      url: window.location.origin
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast({
          title: "Link copied!",
          description: "Share link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Try clipboard as final fallback
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Link copied!",
          description: "App link has been copied to your clipboard.",
        });
      } catch (clipboardError) {
        toast({
          title: "Share failed",
          description: "Unable to share or copy link. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Button 
      onClick={handleShare}
      className={className}
      size={size}
      variant={variant}
    >
      <Share2 className="h-4 w-4 mr-2" />
      Share App
    </Button>
  );
};

export default ShareButton;
