import { Leader } from '@/types';
import { LeaderModel } from '@/db/models/Leader';

/**
 * Ordena líderes con conteo de votantes
 */
export const sortLeadersWithVoterCount = async (
  leaders: Leader[],
  sortBy: string,
  sortOrder: 'asc' | 'desc'
): Promise<Leader[]> => {
  if (sortBy === 'voters') {
    const leadersWithCounts = await Promise.all(
      leaders.map(async (leader) => {
        const count = await LeaderModel.countVoters(leader.id);
        return { leader, count };
      })
    );

    leadersWithCounts.sort((a, b) => {
      return sortOrder === 'asc' ? a.count - b.count : b.count - a.count;
    });

    return leadersWithCounts.map((item) => item.leader);
  }

  return leaders;
};

