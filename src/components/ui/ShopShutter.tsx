"use client";
/**
 * FancyShutter — scroll-to-pull rope mechanic
 *
 * Dependencies to install:
 *   pnpm dlx shadcn add @fancy/basic-number-ticker
 *
 * Place at: src/components/ui/FancyShutter.tsx
 */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FancyShutter({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen]           = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const [isAnimating, setIsAnimating]   = useState(false);
  const [audio, setAudio]               = useState<HTMLAudioElement | null>(null);
  const [hasPlayedSound, setHasPlayedSound] = useState(false); // Track if sound has been played

  const totalScrollNeeded = 320;
  const accumulatedScroll = useRef(0);
  const containerRef      = useRef<HTMLDivElement>(null);
  const ropePulled        = useRef(false);

  const [audioEnabled, setAudioEnabled] = useState(false);

  // For development: auto-open after 3 seconds if no interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && !ropePulled.current) {
        console.log('Auto-opening shutter for development');
        setIsAnimating(true);
        setTimeout(() => {
          setIsOpen(true);
          sessionStorage.setItem("shutter_opened", "true");
        }, 100);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    const audioElement = new Audio();
    audioElement.src = "/sounds/videoplayback.mp3";
    audioElement.volume = 0.7;
    audioElement.preload = "auto";

    // Add event listeners for better audio handling
    audioElement.addEventListener('canplaythrough', () => {
      console.log('Audio loaded and ready to play');
    });

    audioElement.addEventListener('error', (e) => {
      console.error('Audio loading error:', e);
    });

    audioElement.addEventListener('loadstart', () => {
      console.log('Audio loading started');
    });

    // Try to load the audio
    audioElement.load();

    setAudio(audioElement);

    // Cleanup
    return () => {
      audioElement.pause();
      audioElement.src = '';
      audioElement.removeEventListener('canplaythrough', () => {});
      audioElement.removeEventListener('error', () => {});
      audioElement.removeEventListener('loadstart', () => {});
    };
  }, []);

  // Enable audio on first user interaction
  const enableAudio = useCallback(() => {
    if (!audioEnabled && audio) {
      setAudioEnabled(true);
      console.log('Audio enabled on user interaction');
    }
  }, [audioEnabled, audio]);

  // ── Wheel / touch handlers ────────────────────────────────
  const handleWheel = useCallback((e: WheelEvent) => {
    if (isOpen || isAnimating || ropePulled.current) return;
    e.preventDefault();
    enableAudio(); // Enable audio on first interaction
    accumulatedScroll.current = Math.min(
      totalScrollNeeded,
      Math.max(0, accumulatedScroll.current + e.deltaY)
    );
    const p = accumulatedScroll.current / totalScrollNeeded;
    setPullProgress(p);
    if (p >= 1) { ropePulled.current = true; triggerOpen(); }
  }, [isOpen, isAnimating, enableAudio]);

  const lastTouchY = useRef<number | null>(null);
  const handleTouchStart = useCallback((e: TouchEvent) => {
    lastTouchY.current = e.touches[0].clientY;
    enableAudio(); // Enable audio on first interaction
  }, [enableAudio]);
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
    const p = accumulatedScroll.current / totalScrollNeeded;
    setPullProgress(p);
    if (p >= 1) { ropePulled.current = true; triggerOpen(); }
  }, [isOpen, isAnimating]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel",      handleWheel,      { passive: false });
    el.addEventListener("touchstart", handleTouchStart, { passive: true  });
    el.addEventListener("touchmove",  handleTouchMove,  { passive: false });
    return () => {
      el.removeEventListener("wheel",      handleWheel);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove",  handleTouchMove);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove]);

  // ── Open sequence ─────────────────────────────────────────
  const triggerOpen = () => {
    setIsAnimating(true);

    // Start shutter animation immediately
    setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem("shutter_opened", "true");
    }, 100);

    // Start audio ONLY on the first scroll (no repetition)
    if (!hasPlayedSound) {
      setTimeout(() => {
        if (audio) {
          try {
            audio.currentTime = 0;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
              playPromise.then(() => {
                console.log('Shutter audio started');
                setHasPlayedSound(true); // Mark sound as played
              }).catch(error => {
                console.warn('Shutter audio failed:', error);
              });
            }
          } catch (error) {
            console.error('Audio error:', error);
          }
        }
      }, 200);
    }
  };

  // Stop audio after shutter animation completes (2.2 seconds)
  useEffect(() => {
    if (isOpen && audio) {
      // Let audio play for the full animation duration
      const audioTimeout = setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
        console.log('Audio stopped - shutter animation complete');
      }, 2200); // 2.2 seconds matches the slat animation duration
      
      return () => clearTimeout(audioTimeout);
    }
  }, [isOpen, audio]);

  // ── Rope geometry ─────────────────────────────────────────
  const ROPE_TOP    = 80;
  const ROPE_BOTTOM = 340;
  const ringY       = ROPE_TOP + (1 - pullProgress) * (ROPE_BOTTOM - ROPE_TOP);
  const ropeSlack   = (1 - pullProgress) * 18;

  const totalSlats = 14;

  const containerVariants = {
    exit: { transition: { staggerChildren: 0.07, staggerDirection: -1 } },
  };
  const slatVariants = {
    initial: { y: 0 },
    exit: { y: "-110vh", transition: { duration: 2.2, ease: [0.42, 0, 0.55, 1] as any } },
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(135deg, #fdfbf7 0%, #f5e6d3 100%)" }}
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
          >
            {/* ── Slats ──────────────────────────────────── */}
            {Array.from({ length: totalSlats }).map((_, i) => (
              <motion.div
                key={i}
                variants={slatVariants}
                className="w-full flex-1 border-b border-black/10 relative"
                style={{
                  background: i % 2 === 0
                    ? "linear-gradient(180deg, #D4885A 0%, #E8A868 40%, #8F5820 60%, #D4885A 100%)"
                    : "linear-gradient(180deg, #8F5820 0%, #D4885A 40%, #7A4A1F 60%, #8F5820 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.15)",
                }}
              >
                {[15, 50, 85].map(pct => (
                  <div key={pct} className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                    style={{ left: `${pct}%`, background: "rgba(255,255,255,0.14)", boxShadow: "0 1px 2px rgba(0,0,0,0.3)" }} />
                ))}
              </motion.div>
            ))}

            {/* ── Bottom bar ─────────────────────────────── */}
            <motion.div
              variants={slatVariants}
              className="h-12 w-full flex items-center justify-between px-8"
              style={{
                background: "linear-gradient(180deg, #8F5820 0%, #7A4A1F 100%)",
                borderTop: "2px solid rgba(0,0,0,0.25)",
                boxShadow: "0 -8px 32px rgba(0,0,0,0.30)",
              }}
            >
              <div className="h-1 w-20 rounded-full bg-white/20" />
              <span className="text-white/60 text-[9px] font-mono tracking-[0.25em] uppercase">
                {pullProgress < 0.05  ? "↑ scroll to open"
                : pullProgress < 0.5  ? "keep pulling..."
                : pullProgress < 0.9  ? "almost there..."
                : "release!"}
              </span>
              <div className="h-1 w-20 rounded-full bg-white/20" />
            </motion.div>

            {/* ══════════════════════════════════════════════
                ROPE + PULLEY — right side
            ════════════════════════════════════════════════ */}
            <div
              className="fixed top-0 right-12 z-[110]"
              style={{ pointerEvents: "none", width: 48, height: "100vh" }}
            >
              {/* Pulley wheel */}
              <div className="absolute" style={{ top: ROPE_TOP - 20, left: "50%", transform: "translateX(-50%)", width: 32, height: 32 }}>
                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 4, height: 16, background: "#6B3A15", borderRadius: 2 }} />
                <div style={{ position: "absolute", top: 10, left: 0, width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(145deg, #D4885A, #8F5820)", boxShadow: "0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#6B3A15" }} />
                  <div style={{ position: "absolute", inset: 3, borderRadius: "50%", border: "2px solid rgba(0,0,0,0.20)" }} />
                </div>
              </div>

              {/* Rope SVG */}
              <svg style={{ position: "absolute", top: ROPE_TOP, left: 0, width: 48, overflow: "visible" }} height={Math.max(ringY - ROPE_TOP + 60, 60)}>
                <defs>
                  <pattern id="ropePattern" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
                    <rect width="6" height="6" fill="#8F5820" />
                    <line x1="0" y1="0" x2="6" y2="6" stroke="#D4885A" strokeWidth="1.5" />
                    <line x1="6" y1="0" x2="0" y2="6" stroke="#6B3A15" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <path
                  d={`M 24 0 C ${24 + ropeSlack} ${(ringY - ROPE_TOP) * 0.25}, ${24 - ropeSlack} ${(ringY - ROPE_TOP) * 0.5}, ${24 + ropeSlack * 0.4} ${(ringY - ROPE_TOP) * 0.75}, 24 ${ringY - ROPE_TOP}`}
                  stroke="url(#ropePattern)" strokeWidth={pullProgress > 0.3 ? 7 : 8} fill="none" strokeLinecap="round"
                />
                <path
                  d={`M 24 0 C ${24 + ropeSlack * 0.6} ${(ringY - ROPE_TOP) * 0.25}, ${24 - ropeSlack * 0.6} ${(ringY - ROPE_TOP) * 0.5}, ${24 + ropeSlack * 0.2} ${(ringY - ROPE_TOP) * 0.75}, 24 ${ringY - ROPE_TOP}`}
                  stroke="rgba(217,119,6,0.35)" strokeWidth={2} fill="none" strokeLinecap="round"
                />
              </svg>

              {/* Ring handle */}
              <div style={{ position: "absolute", top: ringY, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: "linear-gradient(145deg, #D4885A, #8F5820)", boxShadow: "0 2px 4px rgba(0,0,0,0.4)" }} />
                <div style={{ width: 36, height: 36, borderRadius: "50%", border: `4px solid ${pullProgress > 0.8 ? "#E8A868" : pullProgress > 0.4 ? "#D4885A" : "#8F5820"}`, background: "rgba(255,255,255,0.05)", boxShadow: pullProgress > 0.5 ? "0 0 16px rgba(212,136,90,0.55), 0 3px 8px rgba(0,0,0,0.35)" : "0 3px 8px rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s, box-shadow 0.2s" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0,1,2].map(j => <div key={j} style={{ width: 2, height: 12 + j * 3, borderRadius: 1, background: "#8F5820", opacity: 0.8 }} />)}
                </div>
              </div>

              {/* Progress arc */}
              <svg style={{ position: "absolute", top: ROPE_TOP - 8, left: "50%", transform: "translateX(-50%)", overflow: "visible" }} width={52} height={52}>
                <circle cx={26} cy={26} r={22} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={3} />
                <circle cx={26} cy={26} r={22} fill="none" stroke={pullProgress > 0.8 ? "#E8A868" : "#D4885A"} strokeWidth={3}
                  strokeDasharray={`${pullProgress * 138} 138`} strokeLinecap="round"
                  transform="rotate(-90 26 26)"
                  style={{ transition: "stroke-dasharray 0.05s linear, stroke 0.2s" }} />
              </svg>
            </div>

            {/* Idle instruction */}
            {pullProgress < 0.05 && !isAnimating && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="fixed inset-0 z-[105] flex flex-col items-center justify-center"
                style={{ pointerEvents: "none" }}
              >
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="flex flex-col items-center gap-4">
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.20)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                      <path d="M12 20V4M12 4L6 10M12 4L18 10" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 10, fontFamily: "monospace", letterSpacing: "0.28em", textTransform: "uppercase", textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
OPEN THE MARKET             </div>
                  {/* Skip button for development */}
                  <button
                    onClick={() => {
                      setIsAnimating(true);
                      setTimeout(() => {
                        setIsOpen(true);
                        sessionStorage.setItem("shutter_opened", "true");
                      }, 100);
                    }}
                    style={{
                      pointerEvents: "auto",
                      padding: "8px 16px",
                      background: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: "4px",
                      color: "white",
                      fontSize: "12px",
                      cursor: "pointer",
                      marginTop: "10px"
                    }}
                  >
                    Skip Animation
                  </button>
                </motion.div>
              </motion.div>
            )}
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