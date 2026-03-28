'use client';

import { motion } from 'framer-motion';

/**
 * Blob latar seperti di hero home — radial gradient + blur + animasi halus.
 */
export function AuthBlobs() {
  return (
    <>
      <motion.div
        aria-hidden
        className="absolute top-[-60px] right-[-40px] w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, var(--auth-blob-1) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute top-[60px] right-[4%] w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, var(--auth-blob-2) 0%, transparent 60%)',
          filter: 'blur(38px)',
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
      <motion.div
        aria-hidden
        className="absolute top-[80px] right-[22%] w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, oklch(0.65 0.14 300 / 0.22) 0%, transparent 65%)',
          filter: 'blur(55px)',
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-[8%] left-[4%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, var(--auth-blob-4) 0%, transparent 62%)',
          filter: 'blur(45px)',
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-0 right-[10%] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, var(--auth-blob-5) 0%, transparent 68%)',
          filter: 'blur(50px)',
        }}
        animate={{ scale: [1, 1.07, 1] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
      />
    </>
  );
}
