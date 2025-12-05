import dotenv from 'dotenv';
import { seedData, clearData } from './seed';

dotenv.config();

async function main() {
  const command = process.argv[2];
  
  try {
    if (command === 'seed') {
      // Los argumentos vienen después del comando
      // tsx src/db/seed-cli.ts seed 10 15 -> process.argv[2] = 'seed', [3] = '10', [4] = '15'
      // npm run seed:generate 10 15 -> process.argv[2] = 'seed', [3] = '10', [4] = '15'
      const leaderCount = process.argv[3] ? parseInt(process.argv[3], 10) : 5;
      const votersPerLeader = process.argv[4] ? parseInt(process.argv[4], 10) : 8;
      
      if (isNaN(leaderCount) || leaderCount < 1) {
        console.error('❌ leaderCount debe ser un número mayor a 0');
        process.exit(1);
      }
      
      if (isNaN(votersPerLeader) || votersPerLeader < 0) {
        console.error('❌ votersPerLeader debe ser un número mayor o igual a 0');
        process.exit(1);
      }
      
      await seedData(leaderCount, votersPerLeader);
      process.exit(0);
    } else if (command === 'clear') {
      await clearData();
      process.exit(0);
    } else {
      console.log('📋 Uso:');
      console.log('  npm run seed:generate [leaderCount] [votersPerLeader]');
      console.log('  npm run seed:clear');
      console.log('');
      console.log('📝 Ejemplos:');
      console.log('  npm run seed:generate        # 5 líderes, 8 votantes cada uno');
      console.log('  npm run seed:generate 10     # 10 líderes, 8 votantes cada uno');
      console.log('  npm run seed:generate 10 15  # 10 líderes, 15 votantes cada uno');
      console.log('  npm run seed:clear           # Limpia toda la base de datos');
      process.exit(1);
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message || error);
    process.exit(1);
  }
}

main();

