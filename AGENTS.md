# EduRegister — contexte pour agents IA
> Lis ce fichier puis STATUS.md avant d'explorer. Profil/conventions : ~/ai-hub/PROFIL.md, ~/ai-hub/CONVENTIONS.md

## Projet
- But : SaaS marque blanche d'inscriptions scolaires (collèges/lycées au Sénégal) avec preuve de paiement Wave/Orange Money. Rôles : public, gérant d'école, superadmin.
- Pour qui : produit perso à vendre — repo thesombrecoder18/CollegeRegister — contexte « client » (qualité pro)
- Prod : pas encore déployé

## Stack
Front Angular 19 (signals, Tailwind, Lucide) · Back NestJS + JWT + RBAC multi-tenant · Prisma + PostgreSQL 16 (docker-compose)

## Commandes
```bash
docker compose up -d
cd backend && cp .env.example .env && npm install && npx prisma migrate dev && npm run prisma:seed && npm run start:dev
cd frontend && npm install && npm start
```

## Structure
```
backend/src/{auth,ecole,inscription,superadmin,audit,utilisateur}
backend/prisma/
frontend/src/app/features/{public,admin,superadmin}
Figma/      maquettes de référence
```

## Règles du projet
- Multi-tenant : toute requête gérant est filtrée par école (ne jamais l'oublier).
- Mot de passe Postgres en clair dans docker-compose.yml et comptes démo dans le README : OK en dev, à changer avant prod.
