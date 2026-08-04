import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-8 bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 text-white relative overflow-hidden">
      {/* Background glowing halo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Spacer */}
      <div className="pt-8" />

      {/* Main Logo & Animated Shield */}
      <div className="flex flex-col items-center text-center z-10 my-auto">
        <motion.div
          initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          className="relative mb-8"
        >
          {/* Outer Pulsing Glow Ring */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-amber-400 via-yellow-300 to-blue-400 rounded-3xl blur-md opacity-30 animate-pulse" />

          {/* Logo Badge Container */}
          <div className="relative w-32 h-32 bg-gradient-to-br from-blue-800 via-blue-900 to-slate-900 border-2 border-amber-400/80 rounded-3xl p-4 shadow-2xl flex items-center justify-center">
            {/* Gold Cross Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-15">
              <div className="w-16 h-20 border-t-4 border-l-4 border-r-4 border-amber-300 rounded-t-lg" />
            </div>

            {/* Icon Graphic */}
            <div className="relative flex flex-col items-center justify-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-400/40 shadow-inner mb-1">
                <BookOpen className="w-10 h-10 text-amber-300 stroke-[2.2]" />
              </div>
              <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1 animate-bounce" />
            </div>
          </div>
        </motion.div>

        {/* App Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-3xl font-extrabold tracking-tight font-serif text-white mb-2">
            Bible Quiz <span className="text-amber-400">World</span>
          </h1>
          <p className="text-sm text-blue-200/80 font-medium max-w-xs mx-auto leading-relaxed">
            Test your Scripture knowledge with scripture reference challenges
          </p>
        </motion.div>
      </div>

      {/* Loading Bar & Version Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-xs flex flex-col items-center gap-4 z-10 pb-6"
      >
        <div className="w-full bg-blue-900/60 h-2 rounded-full overflow-hidden border border-blue-700/40 p-0.5">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.2, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 rounded-full shadow-sm"
          />
        </div>

        <span className="text-xs text-blue-300/60 font-mono tracking-widest uppercase">
          Initializing App...
        </span>
      </motion.div>
    </div>
  );
};
