import { query } from '@/config/database';
import { LeaderModel } from './models/Leader';
import { VoterModel } from './models/Voter';
import { generateLeaders, generateVoters } from '@/utils/factories';

/**
 * Genera datos de prueba en la base de datos
 * @param leaderCount - Número de líderes a generar (default: 5)
 * @param votersPerLeader - Número de votantes por líder (default: 8)
 */
export async function seedData(leaderCount: number = 5, votersPerLeader: number = 8) {
  try {
    console.log(`🔄 Generando ${leaderCount} líderes con ${votersPerLeader} votantes cada uno...`);

    // Generar líderes
    const leadersData = generateLeaders(leaderCount);
    const createdLeaders = [];

    for (const leaderData of leadersData) {
      const leader = await LeaderModel.create(leaderData);
      createdLeaders.push(leader);
      console.log(`✅ Líder creado: ${leader.name}`);

      // Generar votantes para este líder
      if (votersPerLeader > 0) {
        const votersData = generateVoters(leader.id, votersPerLeader);
        for (const voterData of votersData) {
          await VoterModel.create(voterData);
        }
        console.log(`  └─ ${votersPerLeader} votantes creados para ${leader.name}`);
      }
    }

    const totalVoters = leaderCount * votersPerLeader;
    console.log(`\n✅ Datos de prueba generados:`);
    console.log(`   - ${createdLeaders.length} líderes`);
    console.log(`   - ${totalVoters} votantes`);
    
    return { leaders: createdLeaders.length, voters: totalVoters };
  } catch (error) {
    console.error('❌ Error generando datos de prueba:', error);
    throw error;
  }
}

/**
 * Limpia todos los datos de la base de datos
 */
export async function clearData() {
  try {
    console.log('🔄 Limpiando base de datos...');

    // Eliminar en orden para respetar las foreign keys
    await query('DELETE FROM voters');
    await query('DELETE FROM leaders');
    await query('DELETE FROM two_factor_codes');

    console.log('✅ Base de datos limpiada correctamente');
    return { success: true };
  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error);
    throw error;
  }
}
