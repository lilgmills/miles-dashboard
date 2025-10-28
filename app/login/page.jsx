'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options : {
                emailRedirectTo:
                    process.env.NEXT_PUBLIC_SITE_URL
                        ? `${process.env.NEXT_PUBLIC_SITE_URL}/callback`
                        : `${window.location.origin}/callback`,
                                },

        })

        if (error) {
            setMessage(error.message)
        }
        else {
            setMessage('Check your email for a login link!')
        }

        setLoading(false)
    }

    return (
        <div style = {{ maxWidth: 400, margin: '2rem auto', textAlign: 'center' }}>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="youremail@example.xyz"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.5rem' }}
                />
                <button type="submit" disabled={loading} style ={{ marginTop: '1rem'}}>
                    {loading ? 'Sending link ...' : 'Send Magic Link'}
                </button>
            </form>
            <p>{message}</p>
        </div>
    )
}