import { query } from '@/config/database';
import { Leader, CreateLeaderInput, UpdateLeaderInput } from '@/types';

export class LeaderModel {
  static async create(input: CreateLeaderInput): Promise<Leader> {
    const result = await query(
      `INSERT INTO leaders (name, municipio, empresa_asociacion, celular, cedula, direccion, latitud, longitud, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING id, name, municipio, empresa_asociacion as "empresaAsociacion", celular, cedula, direccion, latitud, longitud, created_at::text as "createdAt", updated_at::text as "updatedAt"`,
      [input.name, input.municipio, input.empresaAsociacion, input.celular, input.cedula, input.direccion || null, input.latitud || null, input.longitud || null]
    );
    return result.rows[0];
  }

  static async findAll(sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc'): Promise<Leader[]> {
    let sql = 'SELECT id, name, municipio, empresa_asociacion as "empresaAsociacion", celular, cedula, direccion, latitud, longitud, created_at::text as "createdAt", updated_at::text as "updatedAt" FROM leaders WHERE deleted_at IS NULL';
    
    if (sortBy === 'name') {
      sql += ` ORDER BY name ${sortOrder.toUpperCase()}`;
    } else if (sortBy === 'voters') {
      sql += `
        ORDER BY (
          SELECT COUNT(*) FROM voters WHERE voters.leader_id = leaders.id AND voters.deleted_at IS NULL
        ) ${sortOrder.toUpperCase()}
      `;
    } else {
      sql += ' ORDER BY created_at DESC';
    }

    const result = await query(sql);
    return result.rows;
  }

  static async findById(id: string): Promise<Leader | null> {
    const result = await query(
      'SELECT id, name, municipio, empresa_asociacion as "empresaAsociacion", celular, cedula, direccion, latitud, longitud, created_at::text as "createdAt", updated_at::text as "updatedAt" FROM leaders WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    return result.rows[0] || null;
  }

  static async update(id: string, input: UpdateLeaderInput): Promise<Leader | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (input.name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(input.name);
    }
    if (input.municipio !== undefined) {
      updates.push(`municipio = $${paramCount++}`);
      values.push(input.municipio);
    }
    if (input.empresaAsociacion !== undefined) {
      updates.push(`empresa_asociacion = $${paramCount++}`);
      values.push(input.empresaAsociacion);
    }
    if (input.celular !== undefined) {
      updates.push(`celular = $${paramCount++}`);
      values.push(input.celular);
    }
    if (input.cedula !== undefined) {
      updates.push(`cedula = $${paramCount++}`);
      values.push(input.cedula);
    }
    if (input.direccion !== undefined) {
      updates.push(`direccion = $${paramCount++}`);
      values.push(input.direccion);
    }
    if (input.latitud !== undefined) {
      updates.push(`latitud = $${paramCount++}`);
      values.push(input.latitud);
    }
    if (input.longitud !== undefined) {
      updates.push(`longitud = $${paramCount++}`);
      values.push(input.longitud);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    updates.push(`updated_at = NOW()`);
    const result = await query(
      `UPDATE leaders SET ${updates.join(', ')} WHERE id = $${paramCount} AND deleted_at IS NULL
       RETURNING id, name, municipio, empresa_asociacion as "empresaAsociacion", celular, cedula, direccion, latitud, longitud, created_at::text as "createdAt", updated_at::text as "updatedAt"`,
      values
    );
    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    // Soft delete: marcar como eliminado en lugar de borrar físicamente
    const result = await query(
      'UPDATE leaders SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }

  static async countVoters(leaderId: string): Promise<number> {
    const result = await query(
      'SELECT COUNT(*) as count FROM voters WHERE leader_id = $1 AND deleted_at IS NULL',
      [leaderId]
    );
    return parseInt(result.rows[0].count, 10);
  }

  static async hasActiveVoters(leaderId: string): Promise<boolean> {
    const count = await this.countVoters(leaderId);
    return count > 0;
  }
}

