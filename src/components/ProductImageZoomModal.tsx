import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Move
} from 'lucide-react';

interface ProductImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  productName: string;
  selectedColor?: string;
  category?: string;
}

export const ProductImageZoomModal: React.FC<ProductImageZoomModalProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
  productName,
  selectedColor,
  category = 'eyeglasses'
}) => {
  // Zoom & Pan state
  const [scale, setScale] = useState<number>(1.8);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(true);

  // Drag & Touch tracking refs
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const positionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const scaleRef = useRef<number>(1.8);
  const containerRef = useRef<HTMLDivElement>(null);
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartScaleRef = useRef<number>(1.8);
  const lastTapRef = useRef<number>(0);

  // Sync refs with state
  positionRef.current = position;
  scaleRef.current = scale;

  // Reset zoom and pan whenever modal opens or image index changes
  const resetZoom = useCallback((targetScale = 1.8) => {
    setScale(targetScale);
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetZoom(1.8);
      setShowHint(true);
      const timer = setTimeout(() => setShowHint(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentIndex, resetZoom]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Angle badge helper
  const getAngleLabel = (img: string, idx: number) => {
    if (img.includes('how-to-wear')) return 'How to Wear';
    if (img.includes('how-to-remove')) return 'How to Remove';
    if (img.includes('how-to-clean')) return 'How to Clean';
    if (category === 'clear-contacts') {
      const clearLabels = ['Pack & Bottle View', 'Packaging Details', 'Alternate Angle'];
      return clearLabels[idx] || `View ${idx + 1}`;
    }
    if (category === 'color-contacts') {
      const contactLabels = ['Wearer Look', 'Iris Texture & Swatch', 'Alternate Look'];
      return contactLabels[idx] || `View ${idx + 1}`;
    }
    const badges = [
      'Angle 1: Front',
      'Angle 2: 3/4 Perspective',
      'Angle 3: Side Profile',
      'Angle 4: Inside Specs',
      'Angle 5: Folded Profile',
      'Angle 6: Alternate View'
    ];
    return badges[idx] || `Angle ${idx + 1}`;
  };

  // Helper to clamp position within boundary bounds based on zoom scale
  const clampPosition = useCallback((newX: number, newY: number, currentScale: number) => {
    if (!containerRef.current) return { x: newX, y: newY };
    const rect = containerRef.current.getBoundingClientRect();
    if (currentScale <= 1) {
      return { x: 0, y: 0 };
    }
    const maxPanX = Math.max(0, (rect.width * (currentScale - 1)) / 2 + 80);
    const maxPanY = Math.max(0, (rect.height * (currentScale - 1)) / 2 + 80);
    return {
      x: Math.min(maxPanX, Math.max(-maxPanX, newX)),
      y: Math.min(maxPanY, Math.max(-maxPanY, newY))
    };
  }, []);

  // Zoom step handlers
  const handleZoomIn = () => {
    setScale(prev => {
      const next = Math.min(4, Number((prev + 0.4).toFixed(2)));
      return next;
    });
  };

  const handleZoomOut = () => {
    setScale(prev => {
      const next = Math.max(1, Number((prev - 0.4).toFixed(2)));
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.25 : -0.25;
    setScale(prev => {
      const next = Math.min(4, Math.max(1, Number((prev + delta).toFixed(2))));
      if (next === 1) {
        setPosition({ x: 0, y: 0 });
      } else {
        setPosition(p => clampPosition(p.x, p.y, next));
      }
      return next;
    });
  };

  // Mouse Drag handlers (Desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only primary button
    e.preventDefault();
    setIsDragging(true);
    setShowHint(false);
    dragStartRef.current = {
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y
    };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const rawX = e.clientX - dragStartRef.current.x;
    const rawY = e.clientY - dragStartRef.current.y;
    const clamped = clampPosition(rawX, rawY, scaleRef.current);
    setPosition(clamped);
  }, [isDragging, clampPosition]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  // Touch handlers (Mobile / Thumb Drag & Pinch-to-Zoom)
  const handleTouchStart = (e: React.TouchEvent) => {
    setShowHint(false);
    if (e.touches.length === 1) {
      // Single finger drag
      const touch = e.touches[0];
      setIsDragging(true);
      dragStartRef.current = {
        x: touch.clientX - positionRef.current.x,
        y: touch.clientY - positionRef.current.y
      };

      // Double tap check to toggle zoom
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        if (scaleRef.current > 1.2) {
          setScale(1);
          setPosition({ x: 0, y: 0 });
        } else {
          setScale(2.2);
        }
      }
      lastTapRef.current = now;
    } else if (e.touches.length === 2) {
      // Two finger pinch to zoom
      setIsDragging(false);
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      pinchStartDistRef.current = dist;
      pinchStartScaleRef.current = scaleRef.current;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      // Thumb / Finger drag
      const touch = e.touches[0];
      const rawX = touch.clientX - dragStartRef.current.x;
      const rawY = touch.clientY - dragStartRef.current.y;
      const clamped = clampPosition(rawX, rawY, scaleRef.current);
      setPosition(clamped);
    } else if (e.touches.length === 2 && pinchStartDistRef.current !== null) {
      // Pinching
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const ratio = currentDist / pinchStartDistRef.current;
      const newScale = Math.min(4, Math.max(1, Number((pinchStartScaleRef.current * ratio).toFixed(2))));
      setScale(newScale);
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    pinchStartDistRef.current = null;
  };

  // Double click on desktop
  const handleDoubleClick = () => {
    if (scale > 1.2) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(2.4);
    }
  };

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onIndexChange((currentIndex - 1 + images.length) % images.length);
      } else if (e.key === 'ArrowRight') {
        onIndexChange((currentIndex + 1) % images.length);
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0') {
        resetZoom(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onIndexChange, resetZoom]);

  // Global mousemove / mouseup listeners for smooth dragging outside the container
  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!isOpen) return null;

  const currentImg = images[currentIndex] || images[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Product Image Inspection Zoom"
      className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col select-none touch-none animate-in fade-in duration-200"
    >
      {/* TOP BAR */}
      <header className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-black/60 border-b border-white/10 text-white z-20">
        {/* Product & Angle Info */}
        <div className="min-w-0 pr-3">
          <div className="flex items-center gap-2">
            <span className="font-heading font-semibold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md">
              {productName}
            </span>
            {selectedColor && (
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-white/15 text-[11px] font-medium text-stone-200">
                {selectedColor}
              </span>
            )}
          </div>
          <p className="text-xs text-[#C5A880] font-medium flex items-center gap-1.5 mt-0.5">
            <span>{getAngleLabel(currentImg, currentIndex)}</span>
            <span className="text-stone-500">•</span>
            <span className="text-stone-400">
              {currentIndex + 1} of {images.length}
            </span>
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            disabled={scale <= 1}
            title="Zoom Out (-)"
            aria-label="Zoom Out"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Scale Badge / Quick Zoom */}
          <button
            onClick={() => {
              if (scale < 2) setScale(2.5);
              else if (scale < 3) setScale(3.5);
              else setScale(1);
            }}
            title="Toggle Zoom"
            className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white transition-colors cursor-pointer"
          >
            {Math.round(scale * 100)}%
          </button>

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            disabled={scale >= 4}
            title="Zoom In (+)"
            aria-label="Zoom In"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Reset View */}
          <button
            onClick={() => resetZoom(1)}
            title="Reset Zoom to 100%"
            aria-label="Reset Zoom"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Close Modal */}
          <button
            onClick={onClose}
            title="Close (Esc)"
            aria-label="Close Inspection Modal"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors ml-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT STAGE */}
      <main
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
        className={`relative flex-1 w-full h-full overflow-hidden flex items-center justify-center p-4 sm:p-10 select-none ${
          isDragging ? 'cursor-grabbing' : scale > 1 ? 'cursor-grab' : 'cursor-zoom-in'
        }`}
      >
        {/* Floating Prev Button */}
        {images.length > 1 && (
          <button
            onClick={e => {
              e.stopPropagation();
              onIndexChange((currentIndex - 1 + images.length) % images.length);
            }}
            title="Previous Angle"
            aria-label="Previous Angle"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Floating Next Button */}
        {images.length > 1 && (
          <button
            onClick={e => {
              e.stopPropagation();
              onIndexChange((currentIndex + 1) % images.length);
            }}
            title="Next Angle"
            aria-label="Next Angle"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Draggable & Scalable High-Res Image Canvas */}
        <div
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 200ms ease-out',
            willChange: 'transform'
          }}
          className="relative max-w-full max-h-full flex items-center justify-center"
        >
          <img
            src={currentImg}
            alt={`${productName} — ${getAngleLabel(currentImg, currentIndex)}`}
            draggable={false}
            className="max-w-[85vw] max-h-[68vh] sm:max-h-[72vh] object-contain drop-shadow-2xl pointer-events-none"
          />
        </div>

        {/* Interaction Hint Badge */}
        {showHint && (
          <div className="pointer-events-none absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-black/85 text-white/95 text-xs font-medium shadow-2xl border border-white/20 backdrop-blur-md animate-fade-in">
            <Move className="w-3.5 h-3.5 text-[#C5A880] animate-pulse" />
            <span>Drag with mouse or thumb to explore fine details</span>
          </div>
        )}
      </main>

      {/* BOTTOM ANGLE THUMBNAIL BAR */}
      {images.length > 1 && (
        <footer className="shrink-0 px-4 py-3 bg-black/60 border-t border-white/10 z-20">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar">
            {images.map((img, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => onIndexChange(idx)}
                  className={`relative shrink-0 w-14 h-11 sm:w-16 sm:h-12 rounded-xl bg-white p-1 border transition-all cursor-pointer flex items-center justify-center overflow-hidden ${
                    isActive
                      ? 'border-[#C5A880] ring-2 ring-[#C5A880] scale-105 shadow-md'
                      : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/40'
                  }`}
                  title={getAngleLabel(img, idx)}
                >
                  <img
                    src={img}
                    alt={getAngleLabel(img, idx)}
                    className="w-full h-full object-contain pointer-events-none"
                  />
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-1 bg-[#C5A880]" />
                  )}
                </button>
              );
            })}
          </div>
        </footer>
      )}
    </div>
  );
};
