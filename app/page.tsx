"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
 
export default function Home() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
 
  useEffect(() => {
    testSupabaseConnection()
  }, [])
 
  const testSupabaseConnection = async () => {
    try {
      // Test simple de connexion
      const { data, error } = await supabase.from('users').select('count')
      
      if (error) {
        setError(error.message)
      } else {
        setData('Connexion Supabase réussie!')
      }
    } catch (err) {
      setError('Erreur de connexion: ' + err)
    }
  }
 
  return (
    <div>
      <h1>Test Supabase</h1>
      {data && <p style={{color: 'green'}}>{data}</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  )
}

