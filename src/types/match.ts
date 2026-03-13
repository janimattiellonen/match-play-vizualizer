export interface Player {
  id: number
  name: string
  image: string
}

export interface HoleResult {
  hole: number
  par: number
  scores: [number, number] // [player1Score, player2Score]
}

export interface MatchData {
  players: [Player, Player]
  holes: HoleResult[]
}

export type Phase = 'vs-screen' | 'countdown' | 'score-reveal' | 'celebration'
