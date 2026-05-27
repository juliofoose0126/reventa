import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Detectar si las variables están configuradas con valores reales de producción
export const isSupabaseConfigured = 
  supabaseUrl !== '' && 
  supabaseUrl !== 'https://tu-proyecto.supabase.co' &&
  supabaseAnonKey !== '' && 
  supabaseAnonKey !== 'tu-clave-anonima-de-supabase';

// Inicializar el cliente (usando fallback si no está configurado para evitar excepciones)
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co', 
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder'
);
