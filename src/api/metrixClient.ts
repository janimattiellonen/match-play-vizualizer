import type { MatchData } from '../types/match'

interface MetrixPlayerResult {
  Result: string
  Diff: number
}

interface MetrixResult {
  UserID: string
  Name: string
  PlayerResults: MetrixPlayerResult[]
  Place: number
}

interface MetrixCompetition {
  Competition: {
    ID: number
    Name: string
    CourseName: string
    Results: MetrixResult[]
    Tracks: { Number: string; Par: string }[]
  }
}

export async function fetchMatchFromMetrix(competitionId: number): Promise<MatchData> {
  const url = `https://discgolfmetrix.com/api.php?content=result&id=${competitionId}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Metrix API error: ${response.status}`)
  }

  const data: MetrixCompetition = await response.json()
  const { Results, Tracks } = data.Competition

  if (Results.length < 2) {
    throw new Error('Match play requires exactly 2 players')
  }

  const [p1, p2] = Results

  const holeCount = Tracks.length
  const holes = Array.from({ length: holeCount }, (_, i) => ({
    hole: i + 1,
    par: parseInt(Tracks[i].Par, 10),
    scores: [
      parseInt(p1.PlayerResults[i].Result, 10),
      parseInt(p2.PlayerResults[i].Result, 10),
    ] as [number, number],
  }))

  return {
    players: [
      { id: 1, name: p1.Name, image: '/players/player-1.png' },
      { id: 2, name: p2.Name, image: '/players/player-2.png' },
    ],
    holes,
  }
}
