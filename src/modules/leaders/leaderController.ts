import { Request, Response } from 'express';
import { LeaderModel } from '@/db/models/Leader';
import { sendSuccess, sendError } from '@/utils/response';
import { sortLeadersWithVoterCount } from '@/utils/sorting';
import { CreateLeaderInput, UpdateLeaderInput } from '@/types';

export class LeaderController {
  static async create(req: Request, res: Response) {
    try {
      const input: CreateLeaderInput = req.body;
      const leader = await LeaderModel.create(input);
      return sendSuccess(res, leader, 'Líder creado correctamente', 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Error al crear el líder', 500);
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const { sortBy, sortOrder = 'asc' } = req.query;
      let leaders = await LeaderModel.findAll(
        sortBy as string,
        sortOrder as 'asc' | 'desc'
      );

      // Si ordena por votantes, necesitamos calcular los conteos
      if (sortBy === 'voters') {
        leaders = await sortLeadersWithVoterCount(leaders, 'voters', sortOrder as 'asc' | 'desc');
      }

      return sendSuccess(res, leaders, 'Líderes obtenidos correctamente');
    } catch (error: any) {
      return sendError(res, error.message || 'Error al obtener los líderes', 500);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const leader = await LeaderModel.findById(id);

      if (!leader) {
        return sendError(res, 'Líder no encontrado', 404);
      }

      return sendSuccess(res, leader, 'Líder obtenido correctamente');
    } catch (error: any) {
      return sendError(res, error.message || 'Error al obtener el líder', 500);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const input: UpdateLeaderInput = req.body;

      const leader = await LeaderModel.update(id, input);

      if (!leader) {
        return sendError(res, 'Líder no encontrado', 404);
      }

      return sendSuccess(res, leader, 'Líder actualizado correctamente');
    } catch (error: any) {
      return sendError(res, error.message || 'Error al actualizar el líder', 500);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verificar que el líder existe
      const leader = await LeaderModel.findById(id);
      if (!leader) {
        return sendError(res, 'Líder no encontrado', 404);
      }

      // Verificar si tiene votantes activos
      const hasVoters = await LeaderModel.hasActiveVoters(id);
      if (hasVoters) {
        return sendError(res, 'No se puede eliminar el líder porque tiene votantes asignados', 400);
      }

      const deleted = await LeaderModel.delete(id);

      if (!deleted) {
        return sendError(res, 'Error al eliminar el líder', 500);
      }

      return sendSuccess(res, null, 'Líder eliminado correctamente');
    } catch (error: any) {
      return sendError(res, error.message || 'Error al eliminar el líder', 500);
    }
  }

  static async getDeepLink(req: Request, res: Response) {
    try {
      const { leaderId } = req.params;
      const leader = await LeaderModel.findById(leaderId);

      if (!leader) {
        return sendError(res, 'Líder no encontrado', 404);
      }

      const appScheme = process.env.APP_DEEP_LINK_SCHEME || 'exp';
      const webFallback = process.env.WEB_FALLBACK_URL || 'http://localhost:8081';
      const serverHost = process.env.SERVER_HOST || '192.168.1.39:8081';

      const deepLink = `${appScheme}://${serverHost}/leaders/${leaderId}/voters/new`;
      const webLink = `${webFallback}/leaders/${leaderId}/voters/new`;

      return sendSuccess(res, {
        leaderId,
        deepLink,
        webFallback: webLink,
      }, 'Deep link generado correctamente');
    } catch (error: any) {
      return sendError(res, error.message || 'Error al generar el deep link', 500);
    }
  }
}

