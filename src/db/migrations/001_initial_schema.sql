-- Create Leaders table
CREATE TABLE IF NOT EXISTS leaders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  municipio VARCHAR(255) NOT NULL,
  empresa_asociacion VARCHAR(255) NOT NULL,
  celular VARCHAR(20) NOT NULL,
  cedula VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create Voters table
CREATE TABLE IF NOT EXISTS voters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leader_id UUID NOT NULL REFERENCES leaders(id) ON DELETE CASCADE,
  municipio VARCHAR(255) NOT NULL,
  barrio VARCHAR(255) NOT NULL,
  nombres VARCHAR(255) NOT NULL,
  apellidos VARCHAR(255) NOT NULL,
  cedula VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  celular VARCHAR(20) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  funcion_cargo VARCHAR(255) NOT NULL,
  profesion VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_voters_leader_id ON voters(leader_id);
CREATE INDEX IF NOT EXISTS idx_leaders_name ON leaders(name);
CREATE INDEX IF NOT EXISTS idx_voters_cedula ON voters(cedula);
CREATE INDEX IF NOT EXISTS idx_voters_email ON voters(email);

-- Create TwoFactor codes table
CREATE TABLE IF NOT EXISTS two_factor_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_two_factor_expires ON two_factor_codes(expires_at);

