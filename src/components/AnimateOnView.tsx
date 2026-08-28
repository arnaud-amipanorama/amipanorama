"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useSyncExternalStore } from "react";
import type { ReactNode, CSSProperties } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  /** "up" (default) | "fade", controls entrance direction */
  variant?: "up" | "fade";
}

// ── Garde-fou global contre le contenu resté invisible ────────────────────────
// `whileInView` s'appuie sur requestAnimationFrame, suspendu tant que le document
// n'est pas visible : onglet ouvert en arrière-plan, webview in-app (LinkedIn,
// Instagram), moteur d'aperçu de lien. Les blocs resteraient figés à opacity 0 et
// la page paraîtrait vide sous le hero.
//
// On expose donc un petit store externe partagé : dès qu'on observe le document
// masqué, les animations d'apparition sont désactivées pour de bon. Le verrou est
// volontairement à sens unique, réactiver l'animation après coup ferait
// réapparaître un `initial: opacity 0`, donc un clignotement du contenu déjà lu.
let animationsDisabled = false;
const listeners = new Set<() => void>();

function subscribeVisibility(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);

  const check = () => {
    if (animationsDisabled || document.visibilityState === "visible") return;
    animationsDisabled = true;
    listeners.forEach((notify) => notify());
  };

  document.addEventListener("visibilitychange", check);
  check(); // état au moment de l'abonnement

  return () => {
    listeners.delete(onStoreChange);
    document.removeEventListener("visibilitychange", check);
  };
}

const canAnimate = () => !animationsDisabled;
const canAnimateOnServer = () => true;

export default function AnimateOnView({
  children,
  delay = 0,
  className,
  style,
  variant = "up",
}: Props) {
  const reduceMotion = useReducedMotion();
  const animate = useSyncExternalStore(subscribeVisibility, canAnimate, canAnimateOnServer);

  if (!animate || reduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

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
