import { motion, AnimatePresence } from 'framer-motion'

interface ScoreDisplayProps {
  score: number
  color: string
}

export default function ScoreDisplay({ score, color }: ScoreDisplayProps) {
  return (
    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={score}
          initial={{ scale: 1.8, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            fontFamily: 'var(--font-tech)',
            fontSize: '56px',
            fontWeight: 900,
            color,
            textShadow: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}`,
            textAlign: 'center',
            lineHeight: '80px',
          }}
        >
          {score}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
