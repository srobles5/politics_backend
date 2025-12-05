-- Add deleted_at column to leaders table
ALTER TABLE leaders ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;

-- Add deleted_at column to voters table
ALTER TABLE voters ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;

-- Create indexes for soft delete queries
CREATE INDEX IF NOT EXISTS idx_leaders_deleted_at ON leaders(deleted_at);
CREATE INDEX IF NOT EXISTS idx_voters_deleted_at ON voters(deleted_at);
CREATE INDEX IF NOT EXISTS idx_voters_leader_id_active ON voters(leader_id, deleted_at);

