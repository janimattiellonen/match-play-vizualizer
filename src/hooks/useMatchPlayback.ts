import { useState, useEffect, useRef, useCallback } from 'react'
import type { MatchData } from '../types/match'

export type RevealStage = 'idle' | 'highlight' | 'p1-score' | 'p2-score' | 'result' | 'done'

interface PlaybackState {
  revealedHole: number
  revealStage: RevealStage
  matchScores: [number, number]
  isComplete: boolean
  reset: () => void
}

export function useMatchPlayback(match: MatchData | null, active: boolean): PlaybackState {
  const [revealedHole, setRevealedHole] = useState(0)
  const [revealStage, setRevealStage] = useState<RevealStage>('idle')
  const [matchScores, setMatchScores] = useState<[number, number]>([0, 0])
  const [isComplete, setIsComplete] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!active || !match) return
    clearTimer()

    const currentMatch = match
    const totalHoles = currentMatch.holes.length
    let currentHole = 0
    let scores: [number, number] = [0, 0]

    function revealNext() {
      if (currentHole >= totalHoles) {
        setIsComplete(true)
        return
      }

      const hole = currentMatch.holes[currentHole]
      const holeNum = currentHole + 1

      // Stage 1: Highlight hole
      setRevealedHole(holeNum)
      setRevealStage('highlight')

      // TODO: restore original timings after testing (500, 600, 600, 1200, 300)
      timeoutRef.current = setTimeout(() => {
        setRevealStage('p1-score')

        timeoutRef.current = setTimeout(() => {
          setRevealStage('p2-score')

          timeoutRef.current = setTimeout(() => {
            setRevealStage('result')

            const [s1, s2] = hole.scores
            if (s1 < s2) {
              scores = [scores[0] + 1, scores[1]]
            } else if (s2 < s1) {
              scores = [scores[0], scores[1] + 1]
            }
            setMatchScores([...scores] as [number, number])

            timeoutRef.current = setTimeout(() => {
              setRevealStage('done')
              currentHole++

              timeoutRef.current = setTimeout(() => {
                revealNext()
              }, 50)
            }, 150)
          }, 100)
        }, 100)
      }, 80)
    }

    timeoutRef.current = setTimeout(() => {
      revealNext()
    }, 200)

    return clearTimer
  }, [active, match, clearTimer])

  const reset = useCallback(() => {
    clearTimer()
    setRevealedHole(0)
    setRevealStage('idle')
    setMatchScores([0, 0])
    setIsComplete(false)
  }, [clearTimer])

  return { revealedHole, revealStage, matchScores, isComplete, reset }
}
