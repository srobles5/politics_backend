-- Add location fields to leaders table
ALTER TABLE leaders ADD COLUMN IF NOT EXISTS direccion TEXT NULL;
ALTER TABLE leaders ADD COLUMN IF NOT EXISTS latitud DECIMAL(10, 8) NULL;
ALTER TABLE leaders ADD COLUMN IF NOT EXISTS longitud DECIMAL(11, 8) NULL;

-- Add location fields to voters table
ALTER TABLE voters ADD COLUMN IF NOT EXISTS direccion TEXT NULL;
ALTER TABLE voters ADD COLUMN IF NOT EXISTS latitud DECIMAL(10, 8) NULL;
ALTER TABLE voters ADD COLUMN IF NOT EXISTS longitud DECIMAL(11, 8) NULL;

-- Create indexes for location queries
CREATE INDEX IF NOT EXISTS idx_leaders_location ON leaders(latitud, longitud) WHERE latitud IS NOT NULL AND longitud IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_voters_location ON voters(latitud, longitud) WHERE latitud IS NOT NULL AND longitud IS NOT NULL;

