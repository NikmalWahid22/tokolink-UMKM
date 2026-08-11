import { createClient } from '@supabase/supabase-js'

// Tarik data dari file .env (Vite menggunakan import.meta.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Inisialisasi koneksi ke Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)