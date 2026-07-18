import type { CSSProperties } from "react";
import type { Variants } from "framer-motion";

const smoothEase = [0.22, 1, 0.36, 1] as const;

export const glowPalette = [
  { color: "#A7F3D0", shadow: "rgba(167, 243, 208, 0.38)" },
  { color: "#BAE6FD", shadow: "rgba(186, 230, 253, 0.38)" },
  { color: "#DDD6FE", shadow: "rgba(221, 214, 254, 0.38)" },
  { color: "#FDE68A", shadow: "rgba(253, 230, 138, 0.34)" },
  { color: "#FBCFE8", shadow: "rgba(251, 207, 232, 0.34)" },
  { color: "#C7D2FE", shadow: "rgba(199, 210, 254, 0.36)" },
  { color: "#BBF7D0", shadow: "rgba(187, 247, 208, 0.34)" },
  { color: "#FED7AA", shadow: "rgba(254, 215, 170, 0.34)" },
] as const;

export function glowStyle(index: number): CSSProperties {
  const tone = glowPalette[index % glowPalette.length];

  return {
    "--landing-card-glow": tone.shadow,
    "--landing-card-tone": tone.color,
  } as CSSProperties;
}

export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 42, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: smoothEase },
  },
};

export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 34, scale: 0.97 },
  visible: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.62,
      delay: Math.min(index * 0.045, 0.28),
      ease: smoothEase,
    },
  }),
};
