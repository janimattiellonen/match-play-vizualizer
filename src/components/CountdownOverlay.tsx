import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CountdownOverlayProps {
  onComplete: () => void
}

export default function CountdownOverlay({ onComplete }: CountdownOverlayProps) {
  const [count, setCount] = useState(3)

  useEffect(() => {
    if (count === 0) {
      const timer = setTimeout(onComplete, 400)
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => {
      setCount(c => c - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [count, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10, 10, 26, 0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <AnimatePresence mode="wait">
        {count > 0 && (
          <motion.div
            key={count}
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              fontFamily: 'var(--font-retro)',
              fontSize: '120px',
              color: count === 3 ? 'var(--color-cyan)' : count === 2 ? 'var(--color-yellow)' : 'var(--color-pink)',
              textShadow: count === 3
                ? 'var(--text-glow-cyan)'
                : count === 2
                  ? 'var(--text-glow-yellow)'
                  : 'var(--text-glow-pink)',
            }}
          >
            {count}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
