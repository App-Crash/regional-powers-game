import React, { useEffect, useRef } from 'react';

interface Props {
  videoSrc: string;
  width?: number;
  height?: number;
  onComplete?: () => void;
}

export const WebmExplosion: React.FC<Props> = ({ 
  videoSrc, 
  width = 64, 
  height = 64, 
  onComplete 
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {});

    const handleEnded = () => {
      if (onComplete) onComplete();
    };

    video.addEventListener('ended', handleEnded);
    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, [onComplete]);

  return (
    <div className="relative pointer-events-none flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        autoPlay
        preload="auto"
        width={width}
        height={height}
        style={{ objectFit: 'contain' }}
      />
    </div>
  );
};