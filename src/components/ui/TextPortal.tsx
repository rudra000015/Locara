"use client";
import { motion, AnimatePresence } from "framer-motion";
 
export default function TextPortal({ show, onComplete }: { show: boolean, onComplete: () => void }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] bg-zinc-950 flex items-center justify-center overflow-hidden"
        >
          <div className="text-center relative">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-500 font-light tracking-[0.6em] uppercase text-sm mb-2"
            >
              Unveiling the Local Treasure
            </motion.h2>
 
            <motion.h1
              initial={{ scale: 1, opacity: 0 }}
              animate={{
                scale: [1, 1.1, 70],
                opacity: [0, 1, 1],
              }}
              transition={{
                duration: 8.0,
                times: [0, 0.2, 1],
                ease: [0.76, 0, 0.24, 1],
              }}
              onAnimationComplete={onComplete}
              style={{
                color: '#C9973A',
                fontSize: 'clamp(4rem, 10vw, 7rem)',
                fontWeight: 700,
                fontFamily: "'Georgia', 'Times New Roman', serif",
                letterSpacing: '0.12em',
                lineHeight: 1,
              }}
            >
              Locara
            </motion.h1>
          </div>
 
          {/* Flash to #F7E8D4 (auth bg) instead of white — seamless transition */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 1] }}
            transition={{ duration: 8.0, times: [0, 0.9, 1] }}
            style={{ background: '#F7E8D4' }}
            className="absolute inset-0 pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}