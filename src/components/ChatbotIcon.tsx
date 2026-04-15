import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";

export default function ChatbotIcon() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const angleX = (e.clientX - centerX) / 20;
      const angleY = (e.clientY - centerY) / 20;

      mouseX.set(angleX);
      mouseY.set(angleY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={ref}
      className="fixed bottom-8 right-8 z-50"
    >
      <motion.button
        className="relative w-16 h-16 rounded-full shadow-lg cursor-pointer overflow-hidden flex items-center justify-center group"
        style={{
          background: 'var(--accent-blue)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Eye container */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Pupil that follows cursor */}
          <motion.div
            className="absolute w-6 h-6 rounded-full"
            style={{
              background: 'white',
              x,
              y,
            }}
          >
            <div
              className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
              style={{
                background: 'var(--bg-primary)',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </motion.div>

          {/* Message icon overlay on hover */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'var(--accent-blue)' }}
          >
            <MessageCircle size={28} color="white" />
          </div>
        </div>

        {/* Pulse effect */}
        <span
          className="absolute inset-0 rounded-full opacity-75"
          style={{
            background: 'var(--accent-blue)',
            animation: 'gentlePulse 2s ease-in-out infinite',
          }}
        />
      </motion.button>
    </div>
  );
}
