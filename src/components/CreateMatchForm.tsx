import { useState } from 'react'
import { motion } from 'framer-motion'

interface CreateMatchFormProps {
  onSubmit: (competitionId: number) => void
  onCancel: () => void
  isLoading: boolean
  error: string | null
}

function parseMetrixId(input: string): number | null {
  const trimmed = input.trim()

  // Pure numeric ID
  if (/^\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10)
  }

  // URL format: extract ID from discgolfmetrix.com URLs
  try {
    let url = trimmed
    if (!url.startsWith('http')) {
      url = 'https://' + url
    }
    const parsed = new URL(url)
    if (parsed.hostname !== 'discgolfmetrix.com' && parsed.hostname !== 'www.discgolfmetrix.com') {
      return null
    }
    // ID is the first path segment, e.g. /3541752
    const pathMatch = parsed.pathname.match(/^\/(\d+)/)
    if (pathMatch) {
      return parseInt(pathMatch[1], 10)
    }
  } catch {
    // Not a valid URL
  }

  return null
}

const inputStyle: React.CSSProperties = {
  fontFamily: 'var(--font-tech)',
  fontSize: '14px',
  padding: '12px 16px',
  background: 'rgba(10, 10, 26, 0.9)',
  color: 'var(--color-white)',
  border: '2px solid var(--color-purple)',
  borderRadius: '4px',
  outline: 'none',
  width: '100%',
  boxShadow: '0 0 5px rgba(176, 38, 255, 0.3)',
  transition: 'border-color 0.3s, box-shadow 0.3s',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-retro)',
  fontSize: '9px',
  color: 'var(--color-purple)',
  textShadow: '0 0 5px var(--color-purple)',
  letterSpacing: '2px',
  marginBottom: '8px',
  display: 'block',
}

export default function CreateMatchForm({ onSubmit, onCancel, isLoading, error }: CreateMatchFormProps) {
  const [metrixInput, setMetrixInput] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setValidationError(null)

    if (!metrixInput.trim()) {
      setValidationError('Enter a Metrix competition URL or ID')
      return
    }

    const competitionId = parseMetrixId(metrixInput)
    if (competitionId === null) {
      setValidationError('Invalid input. Use a numeric ID or a discgolfmetrix.com URL')
      return
    }

    onSubmit(competitionId)
  }

  const displayError = validationError || error

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '500px',
        padding: '40px 24px',
        position: 'relative',
      }}
    >
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        style={{
          fontFamily: 'var(--font-retro)',
          fontSize: '16px',
          color: 'var(--color-cyan)',
          textShadow: 'var(--text-glow-cyan)',
          marginBottom: '32px',
          letterSpacing: '3px',
        }}
      >
        CREATE MATCH
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          width: '100%',
          padding: '32px',
          background: 'rgba(10, 10, 26, 0.7)',
          border: '1px solid rgba(176, 38, 255, 0.3)',
          borderRadius: '8px',
          boxShadow: '0 0 20px rgba(176, 38, 255, 0.1)',
        }}
      >
        {/* Metrix URL/ID */}
        <div>
          <label style={labelStyle}>METRIX URL OR ID</label>
          <input
            type="text"
            value={metrixInput}
            onChange={(e) => {
              setMetrixInput(e.target.value)
              setValidationError(null)
            }}
            placeholder="e.g. 3541752 or discgolfmetrix.com/3541752"
            disabled={isLoading}
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-cyan)'
              e.target.style.boxShadow = '0 0 10px rgba(0, 240, 255, 0.4)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--color-purple)'
              e.target.style.boxShadow = '0 0 5px rgba(176, 38, 255, 0.3)'
            }}
          />
        </div>

        {/* Error message */}
        {displayError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              fontFamily: 'var(--font-retro)',
              fontSize: '8px',
              color: 'var(--color-red)',
              textShadow: '0 0 5px var(--color-red)',
              lineHeight: '1.6',
            }}
          >
            {displayError}
          </motion.p>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '8px' }}>
          <motion.button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 12px var(--color-purple), 0 0 24px var(--color-purple)',
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              fontFamily: 'var(--font-retro)',
              fontSize: '10px',
              padding: '12px 24px',
              background: 'rgba(176, 38, 255, 0.15)',
              color: 'var(--color-purple)',
              border: '2px solid var(--color-purple)',
              borderRadius: '4px',
              cursor: 'pointer',
              letterSpacing: '2px',
              boxShadow: '0 0 6px var(--color-purple)',
            }}
          >
            BACK
          </motion.button>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 20px #ff2d95, 0 0 40px #ff2d95, 0 0 60px #b026ff',
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              fontFamily: 'var(--font-retro)',
              fontSize: '10px',
              padding: '12px 24px',
              background: isLoading
                ? 'rgba(176, 38, 255, 0.3)'
                : 'linear-gradient(135deg, #b026ff 0%, #ff2d95 100%)',
              color: '#fff',
              border: '2px solid #ff2d95',
              borderRadius: '4px',
              cursor: isLoading ? 'wait' : 'pointer',
              letterSpacing: '2px',
              boxShadow: '0 0 10px #ff2d95, 0 0 20px #b026ff',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'LOADING...' : 'SUBMIT'}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  )
}
