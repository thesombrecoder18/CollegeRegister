# EduRegister

Plateforme SaaS de gestion des inscriptions scolaires (marque blanche) pour collèges et lycées au Sénégal.

## Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | Angular 19 (Standalone, Signals), Tailwind CSS, Lucide Angular |
| Backend | NestJS, JWT, RBAC multi-tenant |
| Base de données | PostgreSQL + Prisma ORM |

## Architecture

```
EduRegister/
├── backend/          # API NestJS (port 3000)
├── frontend/         # Application Angular (port 4200)
└── docker-compose.yml
```

### Rôles (RBAC)

- **Public** — Inscription et suivi de dossier (sans compte)
- **Gérant** — Validation des paiements, effectifs, paramètres de son établissement
- **Superadmin** — Provisionnement des établissements, supervision globale

## Démarrage rapide

### Prérequis

- Node.js 20+
- Docker (pour PostgreSQL)

### 1. Base de données

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run prisma:seed
npm run start:dev
```

L'API est disponible sur `http://localhost:3000/api`.

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

L'application est disponible sur `http://localhost:4200`.

## Comptes de démonstration

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Superadmin | admin@eduregister.sn | SuperAdmin2026! |
| Gérant (CEM Mermoz) | gerant@cem-mermoz.sn | Gerant2026! |

## URLs

| Espace | URL |
|--------|-----|
| Portail public (CEM Mermoz) | http://localhost:4200/cem-mermoz |
| Suivi de dossier | http://localhost:4200/cem-mermoz/suivi |
| Administration gérant | http://localhost:4200/admin |
| Super-administration | http://localhost:4200/superadmin |
| Connexion | http://localhost:4200/connexion |

## Fonctionnalités implémentées

### Espace public
- Wizard d'inscription en 3 étapes (infos, paiement Wave/Orange Money, preuve)
- Compression d'image côté client (< 300 Ko via Canvas API)
- Thémage dynamique (couleurs, logo) par établissement
- Suivi de dossier par téléphone ou référence

### Espace gérant
- Tableau de bord avec statistiques en temps réel
- Validation/rejet des paiements avec modale et preuve visuelle
- Répartition round-robin des élèves par classe
- Configuration des montants par niveau

### Espace superadmin
- Création d'établissements avec compte gérant automatique
- Suspension/réactivation d'établissements
- Supervision globale anonymisée

### Sécurité multi-tenant
- JWT + Guards de rôles (RBAC)
- TenantGuard global : isolation stricte par `ecoleId` pour les gérants
- Routes publiques marquées via décorateur `@Public()`

## API principale

```
POST   /api/auth/login
GET    /api/ecoles/public/:slug
GET    /api/ecoles/stats/dashboard          (GERANT)
GET    /api/ecoles                           (SUPERADMIN)
POST   /api/ecoles                           (SUPERADMIN)
POST   /api/inscriptions/public/:slug        (PUBLIC)
GET    /api/inscriptions/public/:slug/suivi  (PUBLIC)
GET    /api/inscriptions                     (GERANT)
PATCH  /api/inscriptions/:id/valider         (GERANT)
PATCH  /api/inscriptions/:id/rejeter         (GERANT)
POST   /api/inscriptions/repartir/:niveau    (GERANT)
GET    /api/configuration                    (GERANT)
GET    /api/superadmin/stats                 (SUPERADMIN)
```

## Licence

Projet privé — Tous droits réservés.
