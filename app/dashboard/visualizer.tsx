'use client'

import CircularProgress from './CircularProgress'

type Run = {
  id: string
  date: string // ISO date
  miles: number
}

type Props = {
  runs: Run[]
}

export default function Visualizer({ runs }: Props) {
  if (!runs || runs.length === 0) return <p>No runs to visualize yet.</p>

  // --- Step 1: Sort runs by date ascending
  const sortedRuns = [...runs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const today = new Date()
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 6)

  const fourteenDaysAgo = new Date(today)
  fourteenDaysAgo.setDate(today.getDate() - 13)

  // --- Step 2: compute current 7-day total
  const currentWeekMiles = sortedRuns
    .filter(
      (r) => new Date(r.date) >= sevenDaysAgo && new Date(r.date) <= today
    )
    .reduce((sum, r) => sum + r.miles, 0)

  // --- Step 3: compute last 7-day total
  const lastWeekMiles = sortedRuns
    .filter(
      (r) =>
        new Date(r.date) >= fourteenDaysAgo && new Date(r.date) < sevenDaysAgo
    )
    .reduce((sum, r) => sum + r.miles, 0)

  // --- Step 4: compute target
  const targetMiles = lastWeekMiles * 1.1 || 1.6 // fallback minimum goal

  // --- Step 5: progress %
  const progressPercent = Math.min((currentWeekMiles / targetMiles) * 100, 100)

  return (
    

    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <CircularProgress progress={progressPercent} size={150} color="purple" />

      <p>{currentWeekMiles.toFixed(1)} mi / {targetMiles.toFixed(1)} mi</p>
      {progressPercent >= 100 && <p>Goal reached!</p>}

      
    </div>
  )
}
