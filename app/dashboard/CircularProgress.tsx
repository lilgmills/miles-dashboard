'use client'

import React, { useRef, useEffect } from 'react'

type Props = {
  progress: number // 0 to 100
  size?: number // diameter in px
  strokeWidth?: number
  color?: string
  backgroundColor?: string
}

export default function CircularProgress({
  progress,
  size = 120,
  strokeWidth = 12,
  color = 'orange',
  backgroundColor = '#eee',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const center = size / 2
    const radius = (size - strokeWidth) / 2
    const startAngle = -Math.PI / 2 // 12:00 position
    const endAngle = startAngle + (progress / 100) * 2 * Math.PI

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Draw background circle
    ctx.beginPath()
    ctx.arc(center, center, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = backgroundColor
    ctx.lineWidth = strokeWidth
    ctx.lineCap = 'round'
    ctx.stroke()

    // Draw progress arc
    ctx.beginPath()
    ctx.arc(center, center, radius, startAngle, endAngle)
    ctx.strokeStyle = color
    ctx.lineWidth = strokeWidth
    ctx.lineCap = 'round'
    ctx.stroke()
  }, [progress, size, strokeWidth, color, backgroundColor])

  return <canvas ref={canvasRef} width={size} height={size} />
}
