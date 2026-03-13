import { motion } from 'framer-motion'

interface BeginButtonProps {
  onClick: () => void
}

export default function BeginButton({ onClick }: BeginButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      whileHover={{
        scale: 1.1,
        boxShadow: '0 0 20px #ff2d95, 0 0 40px #ff2d95, 0 0 60px #b026ff',
      }}
      whileTap={{ scale: 0.95 }}
      style={{
        fontFamily: 'var(--font-retro)',
        fontSize: '16px',
        padding: '16px 48px',
        background: 'linear-gradient(135deg, #b026ff 0%, #ff2d95 100%)',
        color: '#fff',
        border: '2px solid #ff2d95',
        borderRadius: '4px',
        cursor: 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '4px',
        boxShadow: '0 0 10px #ff2d95, 0 0 20px #b026ff',
      }}
    >
      BEGIN
    </motion.button>
  )
}
