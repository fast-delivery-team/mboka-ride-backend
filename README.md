# Mboka Ride Backend

Backend API pour la plateforme Mboka Ride - Application de gestion de véhicules et intégration de concessionnaires.

## 📋 Description

API REST construite avec NestJS permettant la gestion des utilisateurs, l'authentification JWT avec refresh tokens, et le processus d'intégration de véhicules avec upload de documents vers Cloudinary.

## 🚀 Technologies

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL (TypeORM)
- **Authentication**: JWT (Access + Refresh Tokens)
- **File Storage**: Cloudinary
- **Email**: Nodemailer (SMTP)
- **Security**: Helmet, Compression, Rate Limiting (Throttler)
- **Package Manager**: pnpm

## 📦 Prérequis

- Node.js 20+
- pnpm
- PostgreSQL 16+
- Docker & Docker Compose (optionnel, pour le développement local)

## 🔧 Installation

### 1. Cloner le repository

```bash
git clone <repository-url>
cd mboka-ride-backend
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Configuration des variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
# Database
DB_HOSTNAME=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=mboka_ride_db

# Application
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5174

# JWT
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_REFRESH_EXPIRES_IN=7d

# SMTP (Email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# Frontend URL
FRONTEND_URL=http://localhost:5174

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**⚠️ Important**: Ne commitez jamais le fichier `.env` (déjà dans `.gitignore`)

## 🗄️ Configuration de la Base de Données

### Créer la base de données

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE mboka_ride_db;
```

### Exécuter les migrations

```bash
# Générer une nouvelle migration
pnpm run migration:generate src/migrations/MigrationName

# Exécuter les migrations
pnpm run migration:run

# Revenir en arrière (revert dernière migration)
pnpm run migration:revert

# Voir le statut des migrations
pnpm run migration:show
```

## 🏃 Développement Local

### Sans Docker

```bash
# Mode développement (watch mode)
pnpm run dev

# Mode production
pnpm run build
pnpm run start:prod
```

L'API sera accessible sur `http://localhost:3000`

### Avec Docker (Recommandé)

#### 1. Vérifier que le fichier `.env` est créé

Assurez-vous d'avoir un fichier `.env` avec toutes les variables nécessaires (voir section Configuration).

#### 2. Lancer les containers

```bash
# Construire et lancer les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker-compose down -v
```

#### 3. Vérifier que tout fonctionne

```bash
# Voir les containers actifs
docker ps

# Voir les logs de l'application
docker-compose logs -f app

# Voir les logs de PostgreSQL
docker-compose logs -f postgres
```

#### 4. Tester l'API

```bash
# Test simple
curl http://localhost:3000/api/v1

# Ou utiliser Postman/Insomnia
```

## 📡 API Endpoints

Base URL: `http://localhost:3000/api/v1`

### Authentification (`/auth`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/auth/register` | Inscription utilisateur | ❌ |
| POST | `/auth/login` | Connexion (retourne access + refresh tokens) | ❌ |
| POST | `/auth/refresh` | Rafraîchir le access token | ✅ Refresh Token |
| POST | `/auth/activate` | Activer le compte (avec token d'activation) | ❌ |

**Body pour `/auth/register`**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phoneNumber": "0123456789",
  "password": "password123"
}
```

**Body pour `/auth/login`**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Réponse `/auth/login`**:
```json
{
  "user": { ... },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Intégration de Véhicules (`/integration-request`)

**Tous les endpoints nécessitent un Access Token (Bearer Token)**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/integration-request/vehicle/identity-step` | Étape 1: Envoyer les documents d'identité (multipart/form-data) |
| PUT | `/integration-request/vehicle/vehicle-step` | Étape 2: Informations du véhicule |
| PUT | `/integration-request/vehicle/documents-step` | Étape 3: Documents du véhicule (multipart/form-data) |
| GET | `/integration-request/my-request` | Récupérer ma demande d'intégration |
| GET | `/integration-request/:id` | Récupérer une demande par ID |

**Headers requis pour les endpoints protégés**:
```
Authorization: Bearer <access_token>
```

**Exemple POST `/integration-request/vehicle/identity-step`** (multipart/form-data):
- `documentType`: "CNI" | "PASSPORT" | "PERMIS_DE_CONDUIRE"
- `documentTypeNumber`: string
- `identityFilesExpirationDate`: "2025-12-31"
- `identityFiles`: File[] (max 5 fichiers)

**Exemple PUT `/integration-request/vehicle/documents-step`** (multipart/form-data):
- `insuranceExpirationDate`: "2025-12-31"
- `technicalInspectionExpirationDate`: "2025-12-31"
- `registrationCardFiles`: File[] (max 5)
- `insuranceFiles`: File[] (max 5)
- `technicalInspectionFiles`: File[] (max 5)
- `photos`: File[] (max 5)

### Utilisateurs (`/user`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/user` | Liste des utilisateurs |
| GET | `/user/:id` | Détails d'un utilisateur |
| POST | `/user` | Créer un utilisateur |
| PATCH | `/user/:id` | Modifier un utilisateur |
| DELETE | `/user/:id` | Supprimer un utilisateur |

## 🔐 Sécurité

- **Rate Limiting**: 10 requêtes par minute (configurable)
- **Helmet**: Protection des headers HTTP
- **CORS**: Configuré via `CORS_ORIGIN`
- **JWT**: Access tokens (15min) + Refresh tokens (7 jours)
- **Password Hashing**: bcrypt (10 rounds)
- **Email Verification**: Activation de compte par email

## 📁 Structure du Projet

```
src/
├── modules/
│   ├── auth/              # Authentification (login, register, refresh)
│   ├── user/              # Gestion des utilisateurs
│   └── integration-request/  # Intégration de véhicules
├── cloudinary/            # Service Cloudinary (upload fichiers)
├── email/                 # Service d'envoi d'emails
├── config/
│   ├── env.ts            # Validation des variables d'environnement
│   └── database/         # Configuration TypeORM
├── main.ts               # Point d'entrée
└── app.module.ts         # Module racine
```

## 🐳 Déploiement avec Docker

### Build de l'image

```bash
docker build -t mboka-ride-backend .
```

### Utilisation de docker-compose

Le fichier `docker-compose.yml` configure :
- **PostgreSQL**: Base de données
- **App**: Application NestJS

Les migrations s'exécutent automatiquement au démarrage du container.

### Variables d'environnement en production

Pour le déploiement sur Render ou autres plateformes, configurez les variables d'environnement dans l'interface de la plateforme (pas besoin de fichier `.env`).

## 🧪 Tests

```bash
# Tests unitaires
pnpm run test

# Tests e2e
pnpm run test:e2e

# Coverage
pnpm run test:cov
```

## 📝 Scripts Disponibles

```bash
# Développement
pnpm run dev              # Mode watch
pnpm run start:prod       # Production

# Base de données
pnpm run migration:generate  # Générer migration
pnpm run migration:run       # Exécuter migrations
pnpm run migration:revert    # Revert migration
pnpm run migration:show      # Statut migrations

# Docker
pnpm run docker:build        # Build image
pnpm run docker:compose:up   # Lancer avec docker-compose
pnpm run docker:compose:down # Arrêter
pnpm run docker:compose:logs # Voir les logs
```

## 🔍 Dépannage

### Erreur: "Nest can't resolve dependencies"
- Vérifier que tous les modules sont correctement importés dans `app.module.ts`
- Vérifier que les services sont exportés depuis leurs modules respectifs

### Erreur: "Could not find TypeScript configuration"
- Vérifier que `tsconfig.json` n'est pas dans `.dockerignore`

### Erreur: PostgreSQL unhealthy
- Vérifier que les variables `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` sont définies dans `.env`
- Vérifier les logs: `docker-compose logs postgres`

### Erreur: Cloudinary "unknown api_key"
- Vérifier que `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` sont correctement définis
- Retirer les guillemets autour des valeurs dans `.env`

## 📚 Ressources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

## 📄 License
mbokaride has all right resrved
```

