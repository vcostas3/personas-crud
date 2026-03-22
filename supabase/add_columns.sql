-- Añadir nuevos campos a la tabla personas
ALTER TABLE personas
  ADD COLUMN IF NOT EXISTS telefono  VARCHAR(20),
  ADD COLUMN IF NOT EXISTS email     VARCHAR(150),
  ADD COLUMN IF NOT EXISTS direccion VARCHAR(200);
