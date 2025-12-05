import { readFileSync } from 'fs';
import { join } from 'path';
import { query } from '@/config/database';

async function migrate() {
  try {
    console.log('🔄 Starting database migration...');

    // Read all migration files in order
    const migrations = [
      '001_initial_schema.sql',
      '002_add_soft_delete.sql',
      '003_add_location_fields.sql',
    ];

    for (const migrationFile of migrations) {
      console.log(`📄 Running migration: ${migrationFile}`);
      const migrationSQL = readFileSync(
        join(__dirname, 'migrations', migrationFile),
        'utf-8'
      );

      // Execute migration
      await query(migrationSQL);
      console.log(`✅ Migration ${migrationFile} completed`);
    }

    console.log('✅ All database migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
