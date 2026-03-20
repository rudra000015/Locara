"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
 
export default function FancyShutter({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen]             = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const [isAnimating, setIsAnimating]   = useState(false);
  const [audio, setAudio]               = useState<HTMLAudioElement | null>(null);
  const totalScrollNeeded               = 320;
  const accumulatedScroll               = useRef(0);
  const containerRef                    = useRef<HTMLDivElement>(null);
  const ropePulled                      = useRef(false);
 
  useEffect(() => {
    const a = new Audio("/sounds/videoplayback.mp3");
    a.volume = 0.7;
    setAudio(a);
  }, []);
 
  const handleWheel = useCallback((e: WheelEvent) => {
    if (isOpen || isAnimating || ropePulled.current) return;
    e.preventDefault();
    accumulatedScroll.current = Math.min(
      totalScrollNeeded,
      Math.max(0, accumulatedScroll.current + e.deltaY)
    );
    const progress = accumulatedScroll.current / totalScrollNeeded;
    setPullProgress(progress);
    if (progress >= 1) { ropePulled.current = true; triggerOpen(); }
  }, [isOpen, isAnimating]);
 
  const lastTouchY = useRef<number | null>(null);
  const handleTouchStart = useCallback((e: TouchEvent) => {
    lastTouchY.current = e.touches[0].clientY;
  }, []);
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isOpen || isAnimating || ropePulled.current) return;
    if (lastTouchY.current === null) return;
    e.preventDefault();
    const delta = lastTouchY.current - e.touches[0].clientY;
    lastTouchY.current = e.touches[0].clientY;
    accumulatedScroll.current = Math.min(
      totalScrollNeeded,
      Math.max(0, accumulatedScroll.current + delta)
    );
    const progress = accumulatedScroll.current / totalScrollNeeded;
    setPullProgress(progress);
    if (progress >= 1) { ropePulled.current = true; triggerOpen(); }
  }, [isOpen, isAnimating]);
 
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove]);
 
  const triggerOpen = () => {
    setIsAnimating(true);
    if (audio) { audio.currentTime = 0; audio.play().catch(() => {}); }
    setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem("shutter_opened", "true");
    }, 2800);
  };
 
  const shutterY = isAnimating ? "-110vh" : `${-pullProgress * 18}px`;
  const totalSlats = 14;
  const slats = Array.from({ length: totalSlats });
 
  const containerVariants = {
    exit: { transition: { staggerChildren: 0.07, staggerDirection: -1 } },
  };
  const slatVariants = {
    initial: { y: 0 },
    exit: { y: "-110vh", transition: { duration: 2.2, ease: [0.42, 0, 0.55, 1] } },
  };
 
  const statusLabel =
    pullProgress < 0.05 ? "scroll to open market"  :
    pullProgress < 0.5  ? "keep going..."           :
    pullProgress < 0.9  ? "almost there..."         : "let go!";
 
  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden"
      style={{ background: "#b86d08" }}
    >
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="shutter-overlay"
            variants={containerVariants}
            initial="initial"
            animate="initial"
            exit="exit"
            className="fixed inset-0 z-[100] flex flex-col"
            style={{ y: isAnimating ? undefined : shutterY }}
          >
            {/* ── Slats — amber/orange palette ── */}
            {slats.map((_, i) => (
              <motion.div
                key={i}
                variants={slatVariants}
                className="w-full flex-1 relative"
                style={{
                  background:
                    i % 2 === 0
                      ? "linear-gradient(180deg, #d4820a 0%, #e8940a 35%, #c97a08 65%, #b86d08 100%)"
                      : "linear-gradient(180deg, #b86d08 0%, #c97a08 35%, #d4820a 65%, #c07208 100%)",
                  borderBottom: "1px solid rgba(0,0,0,0.18)",
                  boxShadow:
                    "inset 0 2px 0 rgba(255,255,255,0.07), inset 0 -2px 0 rgba(0,0,0,0.12)",
                }}
              >
                {/* Horizontal sheen line across each slat */}
                <div
                  style={{
                    position: "absolute",
                    top: "30%",
                    left: 0,
                    right: 0,
                    height: 1,
                    background: "rgba(255,255,255,0.06)",
                  }}
                />
                {/* Rivet dots */}
                {[12, 50, 88].map(pct => (
                  <div
                    key={pct}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: `${pct}%`,
                      transform: "translate(-50%, -50%)",
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.20)",
                      boxShadow: "inset 0 1px 1px rgba(255,255,255,0.10)",
                    }}
                  />
                ))}
              </motion.div>
            ))}
 
            {/* ── Bottom bar ── */}
            <motion.div
              variants={slatVariants}
              className="w-full flex items-center justify-between px-8"
              style={{
                height: 72,
                background: "linear-gradient(180deg, #8a5206 0%, #5c3604 100%)",
                borderTop: "2px solid rgba(0,0,0,0.30)",
                boxShadow: "0 -6px 28px rgba(0,0,0,0.35)",
              }}
            >
              {/* Left decorative bar */}
              <div style={{ height: 2, width: 80, borderRadius: 1, background: "rgba(232,148,10,0.35)" }} />
 
              {/* ── Mouse icon + label (centred) ── */}
              <div className="flex flex-col items-center" style={{ gap: 6 }}>
 
                {/* Mouse body */}
                <div style={{ position: "relative", width: 28, height: 44 }}>
                  <svg width="28" height="44" viewBox="0 0 28 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect
                      x="1" y="1" width="26" height="42" rx="13"
                      fill="rgba(232,148,10,0.10)"
                      stroke={pullProgress > 0.8 ? "#f5c842" : "rgba(232,148,10,0.75)"}
                      strokeWidth="1.5"
                      style={{ transition: "stroke 0.3s" }}
                    />
                    {/* Centre divider */}
                    <line x1="14" y1="1" x2="14" y2="19" stroke="rgba(232,148,10,0.35)" strokeWidth="1" />
                  </svg>
 
                  {/* Scroll wheel — bobs upward when idle */}
                  <motion.div
                    animate={
                      pullProgress > 0.05
                        ? { scaleY: [1, 0.55, 1], opacity: 1 }
                        : { y: [0, -5, 0], opacity: [1, 0.35, 1] }
                    }
                    transition={
                      pullProgress > 0.05
                        ? { duration: 0.35, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
                    }
                    style={{
                      position: "absolute",
                      top: 9,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 4,
                      height: 10,
                      borderRadius: 2,
                      background: pullProgress > 0.8 ? "#f5c842" : "rgba(232,148,10,0.95)",
                      boxShadow: pullProgress > 0.5 ? "0 0 8px rgba(232,148,10,0.6)" : "none",
                      transition: "background 0.3s, box-shadow 0.3s",
                    }}
                  />
 
                  {/* Amber fill rising as progress grows */}
                  {pullProgress > 0.02 && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 2,
                        left: 2,
                        right: 2,
                        height: `${pullProgress * 72}%`,
                        borderRadius: "0 0 11px 11px",
                        background:
                          pullProgress > 0.8
                            ? "rgba(245,200,66,0.22)"
                            : "rgba(232,148,10,0.20)",
                        transition: "height 0.05s linear, background 0.3s",
                      }}
                    />
                  )}
                </div>
 
                {/* Staggered up-chevrons */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  {[0, 1].map(idx => (
                    <motion.svg
                      key={idx}
                      width="12" height="7" viewBox="0 0 12 7"
                      animate={{ opacity: [0.25, 1, 0.25], y: [3, 0, 3] }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: idx * 0.22 }}
                    >
                      <polyline
                        points="1,6 6,1 11,6"
                        fill="none"
                        stroke={pullProgress > 0.8 ? "#f5c842" : "rgba(232,148,10,0.85)"}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ transition: "stroke 0.3s" }}
                      />
                    </motion.svg>
                  ))}
                </div>
 
                {/* Status text */}
                <span
                  style={{
                    color: pullProgress > 0.8 ? "#f5c842" : "rgba(232,148,10,0.80)",
                    fontSize: 8,
                    fontFamily: "monospace",
                    letterSpacing: "0.26em",
                    textTransform: "uppercase",
                    transition: "color 0.3s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {statusLabel}
                </span>
              </div>
 
              {/* Right decorative bar */}
              <div style={{ height: 2, width: 80, borderRadius: 1, background: "rgba(232,148,10,0.35)" }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* Content behind shutter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="flex items-center justify-center min-h-screen p-4"
      >
        {children}
      </motion.div>
    </div>
  );
}