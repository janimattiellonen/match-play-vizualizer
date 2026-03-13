import { motion } from 'framer-motion'

interface ScoreCellProps {
  value: number | null
  isRevealing: boolean
  isLoser: boolean
  isWinner: boolean
  isCurrentHole: boolean
}

export default function ScoreCell({ value, isRevealing, isLoser, isWinner, isCurrentHole }: ScoreCellProps) {
  if (value === null) {
    return (
      <td
        style={{
          padding: '6px 10px',
          textAlign: 'center',
          fontFamily: 'var(--font-tech)',
          fontSize: '14px',
          fontWeight: 700,
          border: '1px solid rgba(176, 38, 255, 0.15)',
          background: isCurrentHole ? 'rgba(176, 38, 255, 0.1)' : 'transparent',
          minWidth: '36px',
        }}
      >
        -
      </td>
    )
  }

  const bgColor = isLoser
    ? 'rgba(255, 7, 58, 0.3)'
    : isWinner
      ? 'rgba(0, 240, 255, 0.15)'
      : 'transparent'

  const textColor = isLoser
    ? 'var(--color-red)'
    : isWinner
      ? 'var(--color-cyan)'
      : 'var(--color-white)'

  return (
    <motion.td
      initial={isRevealing ? { scale: 1.5, opacity: 0, background: 'rgba(255, 255, 255, 0.8)' } : {}}
      animate={{
        scale: 1,
        opacity: 1,
        background: bgColor,
      }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        padding: '6px 10px',
        textAlign: 'center',
        fontFamily: 'var(--font-tech)',
        fontSize: '14px',
        fontWeight: 700,
        color: textColor,
        border: '1px solid rgba(176, 38, 255, 0.15)',
        minWidth: '36px',
      }}
    >
      {value}
    </motion.td>
  )
}
