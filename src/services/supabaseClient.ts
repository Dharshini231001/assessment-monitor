import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fhczmfrmtkdcawojzeeb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoY3ptZnJtdGtkY2F3b2p6ZWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3ODM5NjksImV4cCI6MjA4NjM1OTk2OX0.LX448ADWmqAgSIBnJhlBWUPQtnyFrhAsO_ckSYnW1p8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
