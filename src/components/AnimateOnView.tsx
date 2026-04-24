"use client";
import { motion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  /** "up" (default) | "fade" — controls entrance direction */
  variant?: "up" | "fade";
}

export default function AnimateOnView({
  children,
  delay = 0,
  className,
  style,
  variant = "up",
}: Props) {
  return (
    <motion.div
      initial={variant === "fade" ? { opacity: 0 } : { opacity: 0, y: 26 }}
      whileInView={variant === "fade" ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-56px" }}
      transition={{ duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
