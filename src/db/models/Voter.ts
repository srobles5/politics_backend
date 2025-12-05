import { query } from '@/config/database';
import { Voter, CreateVoterInput, UpdateVoterInput } from '@/types';

export class VoterModel {
  static async create(input: CreateVoterInput): Promise<Voter> {
    const result = await query(
      `INSERT INTO voters (
        leader_id, municipio, barrio, nombres, apellidos, cedula, email, 
        celular, fecha_nacimiento, funcion_cargo, profesion, direccion, latitud, longitud, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
      RETURNING 
        id, leader_id as "leaderId", municipio, barrio, nombres, apellidos, 
        cedula, email, celular, fecha_nacimiento::text as "fechaNacimiento", 
        funcion_cargo as "funcionCargo", profesion, direccion, latitud, longitud, created_at::text as "createdAt", updated_at::text as "updatedAt"`,
      [
        input.leaderId,
        input.municipio,
        input.barrio,
        input.nombres,
        input.apellidos,
        input.cedula,
        input.email,
        input.celular,
        input.fechaNacimiento,
        input.funcionCargo,
        input.profesion,
        input.direccion || null,
        input.latitud || null,
        input.longitud || null,
      ]
    );
    return result.rows[0];
  }

  static async findByLeaderId(leaderId: string): Promise<Voter[]> {
    const result = await query(
      `SELECT 
        id, leader_id as "leaderId", municipio, barrio, nombres, apellidos, 
        cedula, email, celular, fecha_nacimiento::text as "fechaNacimiento", 
        funcion_cargo as "funcionCargo", profesion, direccion, latitud, longitud, created_at::text as "createdAt", updated_at::text as "updatedAt"
      FROM voters 
      WHERE leader_id = $1 AND deleted_at IS NULL
      ORDER BY nombres ASC, apellidos ASC`,
      [leaderId]
    );
    return result.rows;
  }

  static async findById(id: string): Promise<Voter | null> {
    const result = await query(
      `SELECT 
        id, leader_id as "leaderId", municipio, barrio, nombres, apellidos, 
        cedula, email, celular, fecha_nacimiento::text as "fechaNacimiento", 
        funcion_cargo as "funcionCargo", profesion, direccion, latitud, longitud, created_at::text as "createdAt", updated_at::text as "updatedAt"
      FROM voters 
      WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async update(id: string, input: UpdateVoterInput): Promise<Voter | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    const fields = {
      municipio: 'municipio',
      barrio: 'barrio',
      nombres: 'nombres',
      apellidos: 'apellidos',
      cedula: 'cedula',
      email: 'email',
      celular: 'celular',
      fechaNacimiento: 'fecha_nacimiento',
      funcionCargo: 'funcion_cargo',
      profesion: 'profesion',
      direccion: 'direccion',
      latitud: 'latitud',
      longitud: 'longitud',
    };

    Object.entries(fields).forEach(([key, dbField]) => {
      const value = input[key as keyof UpdateVoterInput];
      if (value !== undefined) {
        updates.push(`${dbField} = $${paramCount++}`);
        values.push(value);
      }
    });

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);
    const result = await query(
      `UPDATE voters SET ${updates.join(', ')} WHERE id = $${paramCount} AND deleted_at IS NULL
       RETURNING 
         id, leader_id as "leaderId", municipio, barrio, nombres, apellidos, 
         cedula, email, celular, fecha_nacimiento::text as "fechaNacimiento", 
         funcion_cargo as "funcionCargo", profesion, direccion, latitud, longitud, created_at::text as "createdAt", updated_at::text as "updatedAt"`,
      values
    );
    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    // Soft delete: marcar como eliminado en lugar de borrar físicamente
    const result = await query(
      'UPDATE voters SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }
}

