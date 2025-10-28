'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
  const [miles, setMiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [newMiles, setNewMiles] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [newDate, setNewDate] = useState('')

  useEffect(() => {
    fetchMiles()
  }, [])

  async function fetchMiles() {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('miles')
      .select('*')
      .order('date', { ascending: false })

    if (error) setError(error.message)
    else setMiles(data || [])
    setLoading(false)
  }

  async function addMiles() {
    if (!newMiles) return setError('Enter miles first!')
    setLoading(true)
    setError('')

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) return setError(userError.message)

    const { error: insertError } = await supabase.from('miles').insert([
      {
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        miles: parseFloat(newMiles),
        created_at: new Date().toISOString(),
      },
    ])

    if (insertError) setError(insertError.message)
    else {
      setNewMiles('')
      await fetchMiles()
    }

    setLoading(false)
  }

  async function saveDate(runId) {
    setLoading(true)
    setError('')

    const { error } = await supabase
      .from('miles')
      .update({ date: newDate })
      .eq('id', runId)

    if (error) setError(error.message)
    else {
      setEditingId(null)
      setNewDate('')
      await fetchMiles()
    }

    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto' }}>
      <h1>Running Log</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="number"
          step="0.01"
          placeholder="Miles ran today"
          value={newMiles}
          onChange={(e) => setNewMiles(e.target.value)}
          style={{ padding: '0.5rem', width: '70%' }}
        />
        <button
          onClick={addMiles}
          disabled={loading}
          style={{ padding: '0.5rem', marginLeft: '0.5rem' }}
        >
          {loading ? 'Saving...' : 'Log Run'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>History</h2>
      {loading && <p>Loading...</p>}
      {miles.length === 0 && !loading && <p>No runs yet.</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {miles.map((run) => (
          <li
            key={run.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #ccc',
              padding: '0.5rem 0',
            }}
          >
            {editingId === run.id ? (
              <>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
                <button onClick={() => saveDate(run.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{new Date(run.date).toLocaleDateString()}</span>
                <strong>{run.miles} mi</strong>
                <button
                  onClick={() => {
                    setEditingId(run.id)
                    setNewDate(run.date)
                  }}
                >
                  Edit
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
