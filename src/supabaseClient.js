import { createClient } from '@supabase/supabase-js'

// This browser key is intentionally public. Access to customer data is controlled
// by Supabase Auth and Row Level Security, never by a secret embedded in this site.
const supabaseUrl = 'https://zmxtnoxbityyzhwzbxtw.supabase.co'
const supabasePublishableKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpteHRub3hiaXR5eXpod3pieHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2Mzc3MDAsImV4cCI6MjEwMjIxMzcwMH0._YiTlWsF0gFGYAT2S89HMKXcPH5qEk0L-H_id89a9Ws'

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
})

export function authRedirectUrl() {
  return `${window.location.origin}${window.location.pathname}`
}

