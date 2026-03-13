import { motion } from 'framer-motion'

interface BeginButtonProps {
  onClick: () => void
  label?: string
  disabled?: boolean
}

export default function BeginButton({ onClick, label = 'BEGIN', disabled }: BeginButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={disabled ? {} : {
        scale: 1.1,
        boxShadow: '0 0 20px #ff2d95, 0 0 40px #ff2d95, 0 0 60px #b026ff',
      }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      style={{
        fontFamily: 'var(--font-retro)',
        fontSize: '14px',
        padding: '16px 48px',
        background: disabled
          ? 'rgba(176, 38, 255, 0.3)'
          : 'linear-gradient(135deg, #b026ff 0%, #ff2d95 100%)',
        color: '#fff',
        border: '2px solid #ff2d95',
        borderRadius: '4px',
        cursor: disabled ? 'wait' : 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '4px',
        boxShadow: '0 0 10px #ff2d95, 0 0 20px #b026ff',
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {label}
    </motion.button>
  )
}
