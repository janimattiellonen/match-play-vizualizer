import { useEffect, useRef } from 'react'

interface AudioVisualizerProps {
  audioElement: HTMLAudioElement | null
  muted: boolean
}

export default function AudioVisualizer({ audioElement, muted }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const contextRef = useRef<AudioContext | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!audioElement) return

    if (!contextRef.current) {
      const ctx = new AudioContext()
      const source = ctx.createMediaElementSource(audioElement)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 64
      source.connect(analyser)
      analyser.connect(ctx.destination)
      contextRef.current = ctx
      sourceRef.current = source
      analyserRef.current = analyser
    }

    const analyser = analyserRef.current!
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const barCount = analyser.frequencyBinCount
    const dataArray = new Uint8Array(barCount)

    function draw() {
      rafRef.current = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArray)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const barWidth = Math.floor(canvas.width / 16)
      const gap = 2

      for (let i = 0; i < 16; i++) {
        const value = dataArray[i] / 255
        const barHeight = value * canvas.height * 0.9
        const x = i * (barWidth + gap)
        const y = canvas.height - barHeight

        ctx.fillStyle = `rgba(176, 38, 255, ${0.3 + value * 0.5})`
        ctx.fillRect(x, y, barWidth, barHeight)
      }
    }

    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [audioElement])

  return (
    <canvas
      ref={canvasRef}
      width={100}
      height={32}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '64px',
        zIndex: 100,
        opacity: muted ? 0.2 : 0.5,
        pointerEvents: 'none',
        transition: 'opacity 0.3s',
      }}
    />
  )
}
