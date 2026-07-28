import React, { useEffect, useRef, useState } from 'react';

export default function HeroFrameAnimation({ 
  frameCount = 240, 
  fps = 22, 
  mode = 'scroll', // 'scroll' | 'loop'
  scrollTargetRef = null,
  overlayGradient = 'linear-gradient(180deg, rgba(0, 0, 0, 0.42) 0%, rgba(0, 0, 0, 0.28) 50%, rgba(0, 0, 0, 0.48) 100%)' 
}) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const frameIndexRef = useRef(0);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const lastDrawnIndexRef = useRef(-1);
  const animationFrameIdRef = useRef(null);
  const lastDrawTimeRef = useRef(0);
  const lastDrawnImgRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Preload frames with bulletproof path resolution
  useEffect(() => {
    let isMounted = true;
    const loadedImages = [];
    let loadedCount = 0;

    const getFrameUrl = (index) => {
      const paddedNum = String(index + 1).padStart(3, '0');
      const metaBase = import.meta.env.BASE_URL;
      let base = metaBase;
      if (!base || base === './' || base === '.') {
        const pathname = window.location.pathname;
        if (pathname.includes('.html')) {
          base = pathname.substring(0, pathname.lastIndexOf('/') + 1);
        } else {
          base = pathname.endsWith('/') ? pathname : `${pathname}/`;
        }
      } else {
        base = base.endsWith('/') ? base : `${base}/`;
      }
      return `${base}frames/ezgif-frame-${paddedNum}.jpg`;
    };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        if (!isMounted) return;
        loadedCount++;
        if (loadedCount >= Math.min(10, frameCount) && !isLoaded) {
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        console.warn(`[HeroFrameAnimation] Failed frame ${i + 1} at ${img.src}`);
      };
      loadedImages.push(img);
    }
    imagesRef.current = loadedImages;

    return () => {
      isMounted = false;
    };
  }, [frameCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect && rect.width > 0 && rect.height > 0) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        drawFrame(Math.round(currentFrameRef.current));
      }
    };

    const drawFrame = (index) => {
      if (!canvas || canvas.width === 0 || canvas.height === 0) return;
      const clampedIndex = Math.max(0, Math.min(frameCount - 1, index));
      const img = imagesRef.current[clampedIndex];

      if (img && img.complete && img.naturalWidth > 0) {
        lastDrawnImgRef.current = img;
      }

      const targetImg = (img && img.complete && img.naturalWidth > 0) ? img : lastDrawnImgRef.current;

      if (targetImg) {
        const cw = canvas.width;
        const ch = canvas.height;
        const fullW = targetImg.naturalWidth;
        const fullH = targetImg.naturalHeight;

        // Crop strictly top and bottom letterbox black bars (9.5% each) while keeping 100% full width (no side cropping)
        const topCropRatio = 0.095;
        const bottomCropRatio = 0.095;
        
        const sx = 0;
        const sw = fullW;
        const sy = fullH * topCropRatio;
        const sh = fullH * (1 - topCropRatio - bottomCropRatio);

        const scale = Math.max(cw / sw, ch / sh);
        const nw = sw * scale;
        const nh = sh * scale;
        const cx = (cw - nw) / 2;
        const cy = (ch - nh) / 2;

        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(targetImg, sx, sy, sw, sh, cx, cy, nw, nh);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    if (mode === 'scroll') {
      const calculateTargetFrame = () => {
        const track = scrollTargetRef?.current || canvas.parentElement?.parentElement;
        if (!track) return;

        const rect = track.getBoundingClientRect();
        const scrollableDistance = rect.height - window.innerHeight;
        let progress = 0;
        if (scrollableDistance > 0) {
          progress = Math.max(0, Math.min(1, (-rect.top) / scrollableDistance));
        }
        targetFrameRef.current = progress * (frameCount - 1);
      };

      calculateTargetFrame();

      const handleScroll = () => {
        calculateTargetFrame();
      };

      window.addEventListener('scroll', handleScroll, { passive: true });

      // Continuous smooth LERP rendering loop
      const lerpSpeed = 0.08; // Ultra-smooth inertia factor
      const loop = () => {
        const diff = targetFrameRef.current - currentFrameRef.current;

        if (Math.abs(diff) > 0.01) {
          currentFrameRef.current += diff * lerpSpeed;
          const rounded = Math.round(currentFrameRef.current);
          if (rounded !== lastDrawnIndexRef.current) {
            lastDrawnIndexRef.current = rounded;
            drawFrame(rounded);
          }
        } else if (lastDrawnIndexRef.current !== Math.round(targetFrameRef.current)) {
          currentFrameRef.current = targetFrameRef.current;
          const rounded = Math.round(currentFrameRef.current);
          lastDrawnIndexRef.current = rounded;
          drawFrame(rounded);
        }

        animationFrameIdRef.current = requestAnimationFrame(loop);
      };

      animationFrameIdRef.current = requestAnimationFrame(loop);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        window.removeEventListener('scroll', handleScroll);
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
        }
      };
    } else {
      // Loop mode (time based playback)
      const interval = 1000 / fps;

      const render = (timestamp) => {
        if (!lastDrawTimeRef.current) lastDrawTimeRef.current = timestamp;
        const elapsed = timestamp - lastDrawTimeRef.current;

        if (elapsed >= interval) {
          lastDrawTimeRef.current = timestamp - (elapsed % interval);
          drawFrame(frameIndexRef.current);
          frameIndexRef.current = (frameIndexRef.current + 1) % frameCount;
        }

        animationFrameIdRef.current = requestAnimationFrame(render);
      };

      animationFrameIdRef.current = requestAnimationFrame(render);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
        }
      };
    }
  }, [mode, fps, frameCount, isLoaded, scrollTargetRef]);

  return (
    <div 
      className="hero-frame-bg"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'cover'
        }}
      />
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: overlayGradient,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
