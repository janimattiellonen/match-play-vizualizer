import type { MatchData } from '../types/match'

/**
 * Finds the hole index where the match is decided — i.e., the first hole
 * after which the trailing player cannot possibly catch up even by winning
 * all remaining holes.
 *
 * Returns the 0-based hole index, or null if the match goes the full distance.
 */
export function getClinchHoleIndex(match: MatchData): number | null {
  const totalHoles = match.holes.length
  let score1 = 0
  let score2 = 0

  for (let i = 0; i < totalHoles; i++) {
    const [s1, s2] = match.holes[i].scores
    if (s1 < s2) score1++
    else if (s2 < s1) score2++

    const remaining = totalHoles - (i + 1)
    const lead = Math.abs(score1 - score2)

    if (lead > remaining && remaining > 0) {
      return i
    }
  }

  return null
}
