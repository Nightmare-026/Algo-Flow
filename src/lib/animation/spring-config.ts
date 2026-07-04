/* ================================================================
   ALGO FLOW — Animation Spring Configurations
   ================================================================ */

import type { Transition } from "framer-motion";

// ----------------------------------------------------------------
// Spring Presets
// ----------------------------------------------------------------

/** Default UI spring — snappy, responsive */
export const springDefault: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 25,
  mass: 0.8,
};

/** Swap animation — physical feeling for element exchanges */
export const springSwap: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 20,
  mass: 1,
};

/** Bounce on insert — slight overshoot for new elements */
export const springBounce: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 15,
  mass: 0.6,
};

/** Gentle slide — for shift operations */
export const springSlide: Transition = {
  type: "spring",
  stiffness: 250,
  damping: 28,
  mass: 0.8,
};

/** Stack push/pop — vertical movement */
export const springStack: Transition = {
  type: "spring",
  stiffness: 350,
  damping: 22,
  mass: 0.7,
};

/** Queue flow — horizontal sliding */
export const springQueue: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 25,
  mass: 0.8,
};

/** Node glow — soft pulsing expansion */
export const springGlow: Transition = {
  type: "spring",
  stiffness: 150,
  damping: 12,
  mass: 1,
};

/** Error shake — fast, aggressive */
export const springShake: Transition = {
  type: "spring",
  stiffness: 600,
  damping: 10,
  mass: 0.5,
};

// ----------------------------------------------------------------
// Tween Presets
// ----------------------------------------------------------------

/** Fast UI transition (hover, button press) */
export const tweenFast: Transition = {
  type: "tween",
  duration: 0.15,
  ease: "easeOut",
};

/** Normal UI transition (panel open, card appear) */
export const tweenNormal: Transition = {
  type: "tween",
  duration: 0.3,
  ease: "easeOut",
};

/** Slow cinematic transition (landing page sections) */
export const tweenSlow: Transition = {
  type: "tween",
  duration: 0.6,
  ease: [0.22, 1, 0.36, 1],
};

/** Step animation durations based on speed setting */
export const SPEED_DURATIONS = {
  slow: 1000,
  normal: 600,
  fast: 300,
  custom: 600, // default for custom, overridden by slider
} as const;

// ----------------------------------------------------------------
// Animation Variants
// ----------------------------------------------------------------

/** Fade in from below — for section reveals */
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
} as const;

/** Fade in from above */
export const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
} as const;

/** Scale in — for cards and elements */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
} as const;

/** Slide in from left */
export const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
} as const;

/** Slide in from right */
export const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
} as const;

/** Stagger children container */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/** Stagger child item */
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
} as const;

/** Error shake animation */
export const shakeAnimation = {
  x: [0, -8, 8, -6, 6, -3, 3, 0],
  transition: { duration: 0.5 },
};

/** Pulse glow for found/current elements */
export const pulseGlow = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 0.8,
    repeat: Infinity,
    repeatType: "loop" as const,
  },
};
