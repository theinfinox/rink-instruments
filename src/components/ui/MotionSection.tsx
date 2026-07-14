'use client';

import { useReducedMotion, motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

interface MotionSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** 'fadeUp' | 'fadeIn' | 'stagger' — controls entrance variant */
  variant?: 'fadeUp' | 'fadeIn' | 'stagger';
  /** For stagger parent, sets stagger delay between children */
  staggerDelay?: number;
  /** Pass true to make this a stagger container parent */
  asStaggerParent?: boolean;
}

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const staggerContainerVariants = (staggerDelay: number): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.05,
    },
  },
});

const staggerChildVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

/** Lightweight Framer Motion whileInView entrance wrapper.
 *  Fully respects prefers-reduced-motion — animations are skipped on
 *  systems that prefer reduced motion.
 */
export default function MotionSection({
  children,
  className,
  delay = 0,
  variant = 'fadeUp',
  staggerDelay = 0.08,
  asStaggerParent = false,
}: MotionSectionProps) {
  const prefersReduced = useReducedMotion();

  // If user prefers reduced motion, skip animations entirely
  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  if (asStaggerParent) {
    return (
      <motion.div
        className={className}
        variants={staggerContainerVariants(staggerDelay)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        {children}
      </motion.div>
    );
  }

  const variants = variant === 'fadeIn' ? fadeInVariants : fadeUpVariants;

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger child — use inside a MotionSection with asStaggerParent=true */
export function MotionItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={staggerChildVariants}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
