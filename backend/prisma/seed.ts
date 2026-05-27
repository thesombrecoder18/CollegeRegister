import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const superadminPassword = await bcrypt.hash('SuperAdmin2026!', 10);
  const gerantPassword = await bcrypt.hash('Gerant2026!', 10);

  await prisma.utilisateur.upsert({
    where: { email: 'admin@eduregister.sn' },
    update: {},
    create: {
      email: 'admin@eduregister.sn',
      motDePasse: superadminPassword,
      role: 'SUPERADMIN',
    },
  });

  const ecole = await prisma.ecole.upsert({
    where: { slug: 'cem-mermoz' },
    update: {},
    create: {
      nom: 'CEM Mermoz',
      slug: 'cem-mermoz',
      couleurPrimaire: '#1e3a5f',
      couleurSecondaire: '#059669',
      logoUrl: null,
    },
  });

  await prisma.configuration.upsert({
    where: { ecoleId: ecole.id },
    update: {},
    create: { ecoleId: ecole.id },
  });

  const gerant = await prisma.utilisateur.upsert({
    where: { email: 'gerant@cem-mermoz.sn' },
    update: {},
    create: {
      email: 'gerant@cem-mermoz.sn',
      motDePasse: gerantPassword,
      role: 'GERANT',
      ecoleId: ecole.id,
    },
  });

  // Ajout de quelques inscriptions de test
  const inscriptionsData = [
    { prenom: 'Moussa', nom: 'Diop', niveau: '6ème', telephone: '771234567', reference: 'WAVE-TEST-001', montantAttendu: 25000, montantRecu: 25000, statut: 'VALIDE' as const, operateur: 'WAVE' as const },
    { prenom: 'Fatou', nom: 'Sarr', niveau: '5ème', telephone: '781234567', reference: 'OM-TEST-002', montantAttendu: 25000, montantRecu: 0, statut: 'EN_ATTENTE' as const, operateur: 'ORANGEMONEY' as const },
    { prenom: 'Oumar', nom: 'Sow', niveau: '3ème', telephone: '761234567', reference: 'WAVE-TEST-003', montantAttendu: 30000, montantRecu: 30000, statut: 'VALIDE' as const, operateur: 'WAVE' as const },
  ];

  for (const ins of inscriptionsData) {
    await prisma.inscription.upsert({
      where: { reference: ins.reference },
      update: {},
      create: { ...ins, ecoleId: ecole.id },
    });
  }

  // Ajout de logs d'audit
  const superadmin = await prisma.utilisateur.findUnique({ where: { email: 'admin@eduregister.sn' } });
  if (superadmin) {
    await prisma.auditLog.createMany({
      data: [
        { userId: superadmin.id, action: 'LOGIN_SUCCESS', details: 'Connexion Superadmin' },
        { userId: gerant.id, ecoleId: ecole.id, action: 'VALIDATE_PAYMENT', details: 'Validation Moussa Diop' },
        { userId: superadmin.id, action: 'CREATE_ECOLE', details: 'Création CEM Mermoz' },
      ],
    });
  }

  console.log('Seed terminé :');
  console.log('  Superadmin : admin@eduregister.sn / SuperAdmin2026!');
  console.log('  Gérant CEM Mermoz : gerant@cem-mermoz.sn / Gerant2026!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
