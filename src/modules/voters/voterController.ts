import { Request, Response } from 'express';
import { VoterModel } from '@/db/models/Voter';
import { LeaderModel } from '@/db/models/Leader';
import { sendSuccess, sendError } from '@/utils/response';
import { CreateVoterInput, UpdateVoterInput } from '@/types';

export class VoterController {
  static async create(req: Request, res: Response) {
    try {
      const input: CreateVoterInput = req.body;

      // Verificar que el líder existe
      const leader = await LeaderModel.findById(input.leaderId);
      if (!leader) {
        return sendError(res, 'Líder no encontrado', 404);
      }

      const voter = await VoterModel.create(input);
      return sendSuccess(res, voter, 'Votante creado correctamente', 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Error al crear el votante', 500);
    }
  }

  static async listByLeader(req: Request, res: Response) {
    try {
      const { leaderId } = req.params;

      // Verificar que el líder existe
      const leader = await LeaderModel.findById(leaderId);
      if (!leader) {
        return sendError(res, 'Líder no encontrado', 404);
      }

      const voters = await VoterModel.findByLeaderId(leaderId);
      return sendSuccess(res, voters, 'Votantes obtenidos correctamente');
    } catch (error: any) {
      return sendError(res, error.message || 'Error al obtener los votantes', 500);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const voter = await VoterModel.findById(id);

      if (!voter) {
        return sendError(res, 'Votante no encontrado', 404);
      }

      return sendSuccess(res, voter, 'Votante obtenido correctamente');
    } catch (error: any) {
      return sendError(res, error.message || 'Error al obtener el votante', 500);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const input: UpdateVoterInput = req.body;

      const voter = await VoterModel.update(id, input);

      if (!voter) {
        return sendError(res, 'Votante no encontrado', 404);
      }

      return sendSuccess(res, voter, 'Votante actualizado correctamente');
    } catch (error: any) {
      return sendError(res, error.message || 'Error al actualizar el votante', 500);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await VoterModel.delete(id);

      if (!deleted) {
        return sendError(res, 'Votante no encontrado', 404);
      }

      return sendSuccess(res, null, 'Votante eliminado correctamente');
    } catch (error: any) {
      return sendError(res, error.message || 'Error al eliminar el votante', 500);
    }
  }
}

