import { motion } from 'framer-motion';

// Reusable animation variants
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

export const slideUp = {
  initial: { y: 50, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  exit: { y: -20, opacity: 0, transition: { duration: 0.2 } }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
  exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } }
};

// Main animated page wrapper
export default function AnimatedWrapper({ children, animation = "fade" }) {
  const variants = animation === "slide" ? slideUp : 
                   animation === "scale" ? scaleIn : fadeIn;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

// Animated item for staggered lists
export function AnimatedItem({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      variants={{
        initial: { y: 20, opacity: 0 },
        animate: { 
          y: 0, 
          opacity: 1, 
          transition: { 
            duration: 0.4,
            delay: delay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Element that animates when it enters the viewport
export function AnimateOnScroll({ children, className = "", animation = "fadeUp" }) {
  // Different animation variants
  const animations = {
    fadeUp: {
      initial: { y: 50, opacity: 0 },
      whileInView: { y: 0, opacity: 1 },
      transition: { duration: 0.6 }
    },
    fadeIn: {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      transition: { duration: 0.8 }
    },
    slideRight: {
      initial: { x: -100, opacity: 0 },
      whileInView: { x: 0, opacity: 1 },
      transition: { duration: 0.6, type: "spring", stiffness: 100 }
    },
    slideLeft: {
      initial: { x: 100, opacity: 0 },
      whileInView: { x: 0, opacity: 1 },
      transition: { duration: 0.6, type: "spring", stiffness: 100 }
    },
    zoomIn: {
      initial: { scale: 0.9, opacity: 0 },
      whileInView: { scale: 1, opacity: 1 },
      transition: { duration: 0.5 }
    }
  };

  const selectedAnimation = animations[animation] || animations.fadeUp;
  
  return (
    <motion.div
      initial={selectedAnimation.initial}
      whileInView={selectedAnimation.whileInView}
      viewport={{ once: true, margin: "-100px" }}
      transition={selectedAnimation.transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
