import { PrismaClient } from '../generated/prisma/index.js';

// Instance Prisma Client
const prisma = new PrismaClient();

// Fonction pour tester la connexion
export const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Connexion à la base de données établie');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error);
    return false;
  }
};

// Fonction pour fermer la connexion
export const disconnect = async () => {
  await prisma.$disconnect();
  console.log('🔌 Connexion à la base de données fermée');
};

export default prisma;
