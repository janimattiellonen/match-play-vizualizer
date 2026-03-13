import type { MatchData } from '../types/match'

const CANVAS_WIDTH = 900
const BG_COLOR = '#0a0a1a'
const PURPLE = '#b026ff'
const CYAN = '#00f0ff'
const PINK = '#ff2d95'
const YELLOW = '#ffd700'
const RED = '#ff073a'
const WHITE = '#e0e0ff'
const CELL_W = 38
const CELL_H = 32
const HEADER_H = 28
const NAME_COL_W = 120
const SUMMARY_COL_W = 50

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function formatDiff(diff: number): string {
  if (diff > 0) return `+${diff}`
  if (diff < 0) return `${diff}`
  return '0'
}

export async function downloadResultsImage(match: MatchData, matchScores: [number, number]) {
  const holeCount = match.holes.length
  const tableWidth = NAME_COL_W + holeCount * CELL_W + SUMMARY_COL_W * 2
  const canvasWidth = Math.max(CANVAS_WIDTH, tableWidth + 60)

  // Layout measurements
  const playerSectionY = 30
  const imgSize = 120
  const playerSectionH = imgSize + 60 // image + name + spacing
  const tableY = playerSectionY + playerSectionH + 30
  const tableH = HEADER_H + 2 * CELL_H
  const urlSectionH = match.metrixUrl ? 40 : 0
  const canvasHeight = tableY + tableH + urlSectionH + 40

  const canvas = document.createElement('canvas')
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  const ctx = canvas.getContext('2d')!

  // Background
  ctx.fillStyle = BG_COLOR
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // Load player images
  const [img1, img2] = await Promise.all([
    loadImage(match.players[0].image).catch(() => null),
    loadImage(match.players[1].image).catch(() => null),
  ])

  const centerX = canvasWidth / 2

  // Draw player images and names
  const p1X = centerX - 140 - imgSize / 2
  const p2X = centerX + 140 - imgSize / 2
  const imgY = playerSectionY

  // Draw image borders
  for (const [x, color, img] of [
    [p1X, CYAN, img1],
    [p2X, PINK, img2],
  ] as [number, string, HTMLImageElement | null][]) {
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.shadowColor = color
    ctx.shadowBlur = 15
    ctx.beginPath()
    ctx.roundRect(x - 2, imgY - 2, imgSize + 4, imgSize + 4, 8)
    ctx.stroke()
    ctx.shadowBlur = 0

    if (img) {
      ctx.save()
      ctx.beginPath()
      ctx.roundRect(x, imgY, imgSize, imgSize, 6)
      ctx.clip()
      ctx.drawImage(img, x, imgY, imgSize, imgSize)
      ctx.restore()
    }
  }

  // Player names
  ctx.font = '12px "Press Start 2P", monospace'
  ctx.textAlign = 'center'

  ctx.fillStyle = CYAN
  ctx.shadowColor = CYAN
  ctx.shadowBlur = 8
  ctx.fillText(match.players[0].name, p1X + imgSize / 2, imgY + imgSize + 24)

  ctx.fillStyle = PINK
  ctx.shadowColor = PINK
  ctx.fillText(match.players[1].name, p2X + imgSize / 2, imgY + imgSize + 24)
  ctx.shadowBlur = 0

  // VS text
  ctx.font = '24px "Press Start 2P", monospace'
  ctx.fillStyle = YELLOW
  ctx.shadowColor = YELLOW
  ctx.shadowBlur = 15
  ctx.textAlign = 'center'
  ctx.fillText('VS', centerX, imgY + imgSize / 2 + 8)
  ctx.shadowBlur = 0

  // Match scores under names
  ctx.font = 'bold 28px "Orbitron", monospace'
  ctx.fillStyle = CYAN
  ctx.shadowColor = CYAN
  ctx.shadowBlur = 10
  ctx.fillText(String(matchScores[0]), p1X + imgSize / 2, imgY + imgSize + 52)

  ctx.fillStyle = PINK
  ctx.shadowColor = PINK
  ctx.fillText(String(matchScores[1]), p2X + imgSize / 2, imgY + imgSize + 52)
  ctx.shadowBlur = 0

  // Score table
  const tableX = (canvasWidth - tableWidth) / 2

  // Table background
  ctx.fillStyle = 'rgba(10, 10, 26, 0.9)'
  ctx.strokeStyle = `${PURPLE}50`
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.roundRect(tableX - 1, tableY - 1, tableWidth + 2, HEADER_H + 2 * CELL_H + 2, 4)
  ctx.fill()
  ctx.stroke()

  const gridColor = `${PURPLE}28`

  // Header row
  ctx.font = '8px "Press Start 2P", monospace'
  ctx.fillStyle = PURPLE
  ctx.textAlign = 'center'

  // "HOLE" label
  ctx.textAlign = 'left'
  ctx.fillText('HOLE', tableX + 8, tableY + HEADER_H / 2 + 4)

  // Hole numbers
  ctx.textAlign = 'center'
  ctx.font = 'bold 11px "Orbitron", monospace'
  for (let i = 0; i < holeCount; i++) {
    const x = tableX + NAME_COL_W + i * CELL_W + CELL_W / 2
    ctx.fillStyle = PURPLE
    ctx.fillText(String(i + 1), x, tableY + HEADER_H / 2 + 4)
  }

  // +/- and SUM headers
  ctx.font = '8px "Press Start 2P", monospace'
  ctx.fillStyle = YELLOW
  const diffColX = tableX + NAME_COL_W + holeCount * CELL_W
  const sumColX = diffColX + SUMMARY_COL_W
  ctx.fillText('+/-', diffColX + SUMMARY_COL_W / 2, tableY + HEADER_H / 2 + 4)
  ctx.fillText('SUM', sumColX + SUMMARY_COL_W / 2, tableY + HEADER_H / 2 + 4)

  // Header bottom border
  ctx.strokeStyle = gridColor
  ctx.beginPath()
  ctx.moveTo(tableX, tableY + HEADER_H)
  ctx.lineTo(tableX + tableWidth, tableY + HEADER_H)
  ctx.stroke()

  // Player rows
  for (let p = 0; p < 2; p++) {
    const rowY = tableY + HEADER_H + p * CELL_H
    const playerColor = p === 0 ? CYAN : PINK

    // Player name
    ctx.font = '7px "Press Start 2P", monospace'
    ctx.fillStyle = playerColor
    ctx.shadowColor = playerColor
    ctx.shadowBlur = 5
    ctx.textAlign = 'left'
    ctx.fillText(match.players[p].name, tableX + 6, rowY + CELL_H / 2 + 3)
    ctx.shadowBlur = 0

    // Scores
    ctx.font = 'bold 13px "Orbitron", monospace'
    ctx.textAlign = 'center'
    let sum = 0
    let diff = 0
    for (let h = 0; h < holeCount; h++) {
      const score = match.holes[h].scores[p]
      const otherScore = match.holes[h].scores[1 - p]
      sum += score
      diff += score - match.holes[h].par

      const x = tableX + NAME_COL_W + h * CELL_W + CELL_W / 2
      const y = rowY + CELL_H / 2 + 4

      // Cell background for winner/loser
      if (score < otherScore) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.15)'
        ctx.fillRect(tableX + NAME_COL_W + h * CELL_W, rowY, CELL_W, CELL_H)
        ctx.fillStyle = CYAN
      } else if (score > otherScore) {
        ctx.fillStyle = 'rgba(255, 7, 58, 0.25)'
        ctx.fillRect(tableX + NAME_COL_W + h * CELL_W, rowY, CELL_W, CELL_H)
        ctx.fillStyle = RED
      } else {
        ctx.fillStyle = WHITE
      }

      ctx.fillText(String(score), x, y)
    }

    // +/- column
    const diffColor = diff < 0 ? CYAN : diff > 0 ? RED : WHITE
    ctx.fillStyle = diffColor
    ctx.fillText(formatDiff(diff), diffColX + SUMMARY_COL_W / 2, rowY + CELL_H / 2 + 4)

    // SUM column
    ctx.fillStyle = playerColor
    ctx.shadowColor = playerColor
    ctx.shadowBlur = 5
    ctx.fillText(String(sum), sumColX + SUMMARY_COL_W / 2, rowY + CELL_H / 2 + 4)
    ctx.shadowBlur = 0

    // Row border
    if (p === 0) {
      ctx.strokeStyle = gridColor
      ctx.beginPath()
      ctx.moveTo(tableX, rowY + CELL_H)
      ctx.lineTo(tableX + tableWidth, rowY + CELL_H)
      ctx.stroke()
    }
  }

  // Vertical grid lines
  ctx.strokeStyle = gridColor
  for (let i = 0; i <= holeCount; i++) {
    const x = tableX + NAME_COL_W + i * CELL_W
    ctx.beginPath()
    ctx.moveTo(x, tableY)
    ctx.lineTo(x, tableY + HEADER_H + 2 * CELL_H)
    ctx.stroke()
  }

  // Thicker border before +/-
  ctx.strokeStyle = `${PURPLE}50`
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(diffColX, tableY)
  ctx.lineTo(diffColX, tableY + HEADER_H + 2 * CELL_H)
  ctx.stroke()
  ctx.lineWidth = 1

  // Border between +/- and SUM
  ctx.strokeStyle = gridColor
  ctx.beginPath()
  ctx.moveTo(sumColX, tableY)
  ctx.lineTo(sumColX, tableY + HEADER_H + 2 * CELL_H)
  ctx.stroke()

  // Metrix URL
  if (match.metrixUrl) {
    ctx.font = '16px "Orbitron", monospace'
    ctx.fillStyle = PURPLE
    ctx.shadowColor = PURPLE
    ctx.shadowBlur = 5
    ctx.textAlign = 'center'
    ctx.fillText(match.metrixUrl, centerX, tableY + tableH + 32)
    ctx.shadowBlur = 0
  }

  // Download
  const link = document.createElement('a')
  link.download = `match-${match.players[0].name}-vs-${match.players[1].name}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}
