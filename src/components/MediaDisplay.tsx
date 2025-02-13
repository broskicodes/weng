'use client';

import { useEffect, useState, useRef } from 'react';

type MediaDisplayProps = {
  src: string | null;
  alt: string;
  className?: string;
  autoplayOnHover?: boolean;
  minimalControls?: boolean;
  autoPlay?: boolean;
};

export function MediaDisplay({ src, alt, className = '', autoplayOnHover = false, minimalControls = false, autoPlay = false }: MediaDisplayProps) {
  const [isVideo, setIsVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!src) return;
    fetch(src, { method: 'HEAD' }).then(res => {
      setIsVideo(res.headers.get('content-type')?.startsWith('video/') ?? false);
    });
  }, [src]);

  const handleMouseEnter = () => {
    if (autoplayOnHover && videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (autoplayOnHover && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!src) return null;

  if (isVideo) {
    return (
      <div className="group relative">
        <video 
          ref={videoRef}
          controls={!autoplayOnHover && !minimalControls}
          className={`w-full ${className}`}
          preload="metadata"
          muted={autoplayOnHover || autoPlay}
          loop={autoplayOnHover}
          autoPlay={autoPlay}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {minimalControls && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center transition-colors group-hover:bg-black/20"
          >
            {isPlaying ? (
              <svg className="size-16 text-white opacity-0 transition-opacity group-hover:opacity-100" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            ) : (
              <svg className="size-16 text-white opacity-0 transition-opacity group-hover:opacity-100" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            )}
          </button>
        )}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt}
      className={className}
    />
  );
} 