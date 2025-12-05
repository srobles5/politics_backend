import { Request, Response } from 'express';
import { LeaderModel } from '@/db/models/Leader';
import { VoterModel } from '@/db/models/Voter';
import { query } from '@/config/database';
import { sendSuccess, sendError } from '@/utils/response';
import { generateLeaders, generateVoters } from '@/utils/factories';

export class SeedController {
  /**
   * Genera datos de prueba en la base de datos
   */
  static async seed(req: Request, res: Response) {
    try {
      const { leaderCount = 5, votersPerLeader = 8 } = req.body;

      if (leaderCount < 1 || leaderCount > 100) {
        return sendError(res, 'leaderCount debe estar entre 1 y 100', 400);
      }

      if (votersPerLeader < 0 || votersPerLeader > 50) {
        return sendError(res, 'votersPerLeader debe estar entre 0 y 50', 400);
      }

      // Generar líderes
      const leadersData = generateLeaders(leaderCount);
      const createdLeaders = [];

      for (const leaderData of leadersData) {
        const leader = await LeaderModel.create(leaderData);
        createdLeaders.push(leader);

        // Generar votantes para este líder
        if (votersPerLeader > 0) {
          const votersData = generateVoters(leader.id, votersPerLeader);
          for (const voterData of votersData) {
            await VoterModel.create(voterData);
          }
        }
      }

      const totalVoters = leaderCount * votersPerLeader;

      return sendSuccess(
        res,
        {
          leadersCreated: createdLeaders.length,
          votersCreated: totalVoters,
          message: `Se crearon ${createdLeaders.length} líderes y ${totalVoters} votantes`,
        },
        'Datos de prueba generados correctamente'
      );
    } catch (error: any) {
      console.error('Error seeding data:', error);
      return sendError(res, error.message || 'Error al generar datos de prueba', 500);
    }
  }

  /**
   * Limpia todos los datos de la base de datos
   */
  static async clear(req: Request, res: Response) {
    try {
      // Eliminar en orden para respetar las foreign keys
      await query('DELETE FROM voters');
      await query('DELETE FROM leaders');
      await query('DELETE FROM two_factor_codes');

      return sendSuccess(
        res,
        {
          message: 'Todos los datos han sido eliminados',
        },
        'Base de datos limpiada correctamente'
      );
    } catch (error: any) {
      console.error('Error clearing data:', error);
      return sendError(res, error.message || 'Error al limpiar la base de datos', 500);
    }
  }

  /**
   * Obtiene estadísticas de la base de datos
   */
  static async stats(req: Request, res: Response) {
    try {
      const leadersResult = await query('SELECT COUNT(*) as count FROM leaders');
      const votersResult = await query('SELECT COUNT(*) as count FROM voters');
      const twoFactorResult = await query('SELECT COUNT(*) as count FROM two_factor_codes');

      const leadersCount = parseInt(leadersResult.rows[0].count, 10);
      const votersCount = parseInt(votersResult.rows[0].count, 10);
      const twoFactorCount = parseInt(twoFactorResult.rows[0].count, 10);

      // Obtener promedio de votantes por líder
      const avgVotersResult = await query(`
        SELECT 
          CASE 
            WHEN COUNT(DISTINCT leader_id) > 0 
            THEN ROUND(COUNT(*)::numeric / COUNT(DISTINCT leader_id), 2)
            ELSE 0
          END as avg_voters
        FROM voters
      `);

      return sendSuccess(res, {
        leaders: leadersCount,
        voters: votersCount,
        twoFactorCodes: twoFactorCount,
        averageVotersPerLeader: parseFloat(avgVotersResult.rows[0].avg_voters) || 0,
      }, 'Estadísticas obtenidas correctamente');
    } catch (error: any) {
      console.error('Error getting stats:', error);
      return sendError(res, error.message || 'Error al obtener estadísticas', 500);
    }
  }
}

