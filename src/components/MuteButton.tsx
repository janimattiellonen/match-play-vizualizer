import { motion } from 'framer-motion'

interface MuteButtonProps {
  muted: boolean
  onToggle: () => void
}

export default function MuteButton({ muted, onToggle }: MuteButtonProps) {
  return (
    <motion.button
      onClick={onToggle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      whileHover={{ opacity: 1, scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={muted ? 'Unmute' : 'Mute'}
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 100,
        background: 'rgba(10, 10, 26, 0.7)',
        border: '1px solid rgba(176, 38, 255, 0.4)',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-purple)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        {muted ? (
          <>
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </>
        ) : (
          <>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </>
        )}
      </svg>
    </motion.button>
  )
}
