
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lldwszqmdspacdphuqeh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsZHdzenFtZHNwYWNkcGh1cWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMjYxNTcsImV4cCI6MjA2NjcwMjE1N30.M-j9QZc--VdFzUub3pO3r5oex85vYHUQHAg7swfZKno'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
