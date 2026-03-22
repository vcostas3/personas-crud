-- Ejecutar en Supabase > SQL Editor
-- 1. Crear la tabla
CREATE TABLE IF NOT EXISTS personas (
  id        SERIAL PRIMARY KEY,
  nombre    VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;

-- 3. Politica: permitir todo para el anon key (ajusta si necesitas auth)
CREATE POLICY "allow_all" ON personas
  FOR ALL USING (true) WITH CHECK (true);
