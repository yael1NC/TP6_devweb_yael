# Réducteur d'URL - Node.js/Express

Service complet de réduction d'URL avec authentification, négociation de contenu et interface moderne.

> Projet réalisé dans le cadre du TP6 Développement Web - 2025

## Application en ligne

**Application déployée :** https://tp6-devweb-yael.onrender.com

- **Client Web :** https://tp6-devweb-yael.onrender.com
- **Documentation API :** https://tp6-devweb-yael.onrender.com/api-docs
- **API v1 :** https://tp6-devweb-yael.onrender.com/api-v1/
- **API v2 :** https://tp6-devweb-yael.onrender.com/api-v2/

**Note :** Le service peut prendre 30 secondes à démarrer après 15 minutes d'inactivité (plan gratuit Render).

---

## Fonctionnalités

### Fonctionnalités principales

- **Réduction d'URLs** - Transforme les URLs longues en codes courts de 6 caractères alphanumériques
- **Redirection automatique** - Redirige instantanément vers l'URL d'origine
- **Compteur de visites** - Chaque lien compte le nombre de fois où il a été visité
- **Négociation de contenu** - Répond en JSON ou HTML selon l'en-tête `Accept`
- **Client AJAX moderne** - Interface web responsive avec animations fluides
- **Suppression sécurisée** - Authentification par clé secrète via `X-API-Key`
- **Documentation interactive** - Swagger UI pour tester l'API en temps réel
- **Multi-formats** - Support JSON et HTML pour chaque endpoint

### Fonctionnalités UX/UI

- Interface moderne avec gradients et animations CSS
- Design 100% responsive (mobile, tablette, desktop)
- Copie dans le presse-papier (Clipboard API)
- Validation en temps réel des URLs
- États de chargement avec spinners
- Feedback utilisateur immédiat
- Messages d'erreur clairs et contextuels

---

## Installation locale

### Prérequis

- Node.js >= 18.0.0
- npm ou yarn
- Git

### Étapes d'installation

```bash
# 1. Cloner le repository
git clone https://github.com/VOTRE-USERNAME/TP6_devweb_yael.git
cd TP6_devweb_yael

# 2. Installer les dépendances
npm install

# 3. Créer le fichier de configuration .env
cat > .env << EOF
PORT=8080
LINK_LEN=6
DB_FILE=database/database.sqlite
DB_SCHEMA=database/database.sql
NODE_ENV=development
EOF

# 4. Démarrer en mode développement
npm run dev
```

L'application sera accessible sur `http://localhost:8080`

### Scripts disponibles

```bash
npm run dev      # Mode développement avec nodemon (auto-reload)
npm run prod     # Mode production
npm start        # Alias pour mode production
npm run format   # Formater le code avec prettier
```

---

## Documentation API

### API v1 (JSON uniquement)

| Méthode | Route | Description | Réponse |
|---------|-------|-------------|---------|
| `GET` | `/api-v1/` | Nombre total de liens | `{"count": 42}` |
| `POST` | `/api-v1/` | Créer un lien raccourci | `{"url": "...", "short_url": "...", "created_at": "...", "secret": "..."}` |
| `GET` | `/api-v1/:url` | Redirection vers l'URL originale | Redirection 302 |
| `GET` | `/api-v1/status/:url` | Informations du lien | `{"url": "...", "short_url": "...", "visits": 0, "created_at": "..."}` |

### API v2 (JSON et HTML avec négociation de contenu)

| Méthode | Route | Description | Accept | Comportement |
|---------|-------|-------------|--------|--------------|
| `GET` | `/api-v2/` | Accueil ou compteur | `application/json` | Retourne `{"count": 42}` |
| | | | `text/html` | Affiche page d'accueil avec formulaire |
| `POST` | `/api-v2/` | Créer un lien | `application/json` | Retourne les infos du lien en JSON |
| | | | `text/html` | Affiche page de confirmation |
| `GET` | `/api-v2/:url` | Redirection ou infos | `application/json` | Retourne infos sans redirection |
| | | | `text/html` | Incrémente visites et redirige |
| `DELETE` | `/api-v2/:url` | Supprimer un lien | `application/json` | Supprime si authentifié |

---

## Authentification

Pour supprimer un lien, utilisez l'en-tête `X-API-Key` avec le code secret obtenu lors de la création.

### Exemple avec curl

```bash
# 1. Créer un lien
curl -X POST https://tp6-devweb-yael.onrender.com/api-v2/ \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'

# Réponse contient le secret
# { 
#   "url": "https://example.com", 
#   "short_url": "ABC123", 
#   "secret": "XyZ789",
#   "created_at": "2025-09-29T12:00:00.000Z"
# }

# 2. Supprimer le lien avec le secret
curl -X DELETE https://tp6-devweb-yael.onrender.com/api-v2/ABC123 \
  -H "X-API-Key: XyZ789"
```

### Codes de réponse HTTP

- **200** - Suppression réussie
- **401** - En-tête `X-API-Key` manquante
- **403** - Code secret incorrect
- **404** - Lien non trouvé
- **500** - Erreur interne du serveur

---

## Technologies utilisées

### Backend

- **Runtime :** Node.js 18+
- **Framework :** Express.js
- **Base de données :** SQLite3
- **Templates :** EJS
- **Documentation :** OpenAPI 3.0 / Swagger UI
- **Sécurité :** Helmet, CORS
- **Logging :** Morgan

### Frontend

- **JavaScript :** Vanilla JS (Fetch API, Clipboard API)
- **CSS :** Animations et gradients modernes
- **Design :** Responsive mobile-first
- **Validation :** Temps réel côté client

### DevOps

- **Hébergement :** Render.com (Plan gratuit)
- **CI/CD :** Auto-deploy depuis GitHub
- **Monitoring :** Logs Render en temps réel
- **Gestion de version :** Git avec tags

---


## Progression du projet (Tags Git)

Le projet a été développé en 5 parties avec des tags Git correspondants :

| Tag | Description | Fonctionnalités |
|-----|-------------|-----------------|
| `reponses` | Partie 1 - Prise en main | Configuration initiale, réponses aux questions |
| `api-v1` | Partie 2 - API REST basique | Routes CRUD, base de données SQLite |
| `api-v2` | Partie 3 - Négociation de contenu | Support JSON/HTML, templates EJS |
| `client-ajax` | Partie 4 - Client SPA | Interface moderne, Fetch API, Clipboard |
| `api-v2-delete` | Partie 5 - Suppression sécurisée | Authentification X-API-Key, codes HTTP |
| `deployed` | Déploiement production | Application live sur Render |

---

## Tests

### Tests manuels avec curl

```bash
# Obtenir le nombre de liens
curl https://tp6-devweb-yael.onrender.com/api-v2/

# Créer un lien
curl -X POST https://tp6-devweb-yael.onrender.com/api-v2/ \
  -H "Content-Type: application/json" \
  -d '{"url":"https://nodejs.org"}'

# Obtenir les infos d'un lien (JSON)
curl -H "Accept: application/json" \
  https://tp6-devweb-yael.onrender.com/api-v2/ABC123

# Supprimer un lien (avec secret)
curl -X DELETE https://tp6-devweb-yael.onrender.com/api-v2/ABC123 \
  -H "X-API-Key: VOTRE_SECRET"
```

### Tests avec httpie

```bash
# Créer un lien
http POST https://tp6-devweb-yael.onrender.com/api-v2/ url="https://example.com"

# Obtenir les infos
http https://tp6-devweb-yael.onrender.com/api-v2/ABC123 Accept:application/json

# Supprimer
http DELETE https://tp6-devweb-yael.onrender.com/api-v2/ABC123 X-API-Key:SECRET
```

### Tests avec l'interface Swagger

Visitez https://tp6-devweb-yael.onrender.com/api-docs et testez toutes les routes directement dans le navigateur avec l'interface interactive.

---

## Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Port du serveur (utilisé en local, Render gère automatiquement en prod)
PORT=8080

# Longueur des codes courts générés
LINK_LEN=6

# Chemin de la base de données SQLite
DB_FILE=database/database.sqlite

# Chemin du schéma SQL
DB_SCHEMA=database/database.sql

# Environnement (development ou production)
NODE_ENV=development
```

---

## Déploiement sur Render

### Configuration

Le projet est configuré pour être déployé automatiquement sur Render via le fichier `render.yaml`.

**Variables d'environnement sur Render :**

| Variable | Valeur |
|----------|--------|
| `NODE_ENV` | `production` |
| `LINK_LEN` | `6` |
| `DB_FILE` | `database/database.sqlite` |
| `DB_SCHEMA` | `database/database.sql` |

**Ne pas définir `PORT`** - Render l'injecte automatiquement.

### Commandes de build et démarrage

```bash
Build Command:  npm install
Start Command:  npm run prod
```

### Limitations du plan gratuit

- **750 heures par mois** - Suffisant pour un projet étudiant
- **Sleep automatique** - Après 15 minutes d'inactivité
- **Cold start** - 30 secondes pour réveiller le service
- **Filesystem éphémère** - La base SQLite est réinitialisée au redémarrage

Pour une persistance des données en production, il est recommandé de migrer vers PostgreSQL (offert gratuitement par Render).

---



### Fonctionnalités bonus implémentées

- Interface moderne avec animations CSS3
- Design responsive mobile-first
- Copie dans le presse-papier (Clipboard API)
- Suppression sécurisée avec authentification
- Documentation API complète et interactive (Swagger)
- Déploiement en production sur Render
- Validation en temps réel des URLs
- Loading states et feedback utilisateur
- Gestion d'erreurs complète avec codes HTTP appropriés
- Support de la négociation de contenu (Accept header)

---

## Sécurité

### Mesures implémentées

- **Helmet.js** - Protection contre les vulnérabilités web courantes
- **CORS** - Configuration cross-origin appropriée
- **Authentification** - Codes secrets pour la suppression
- **Validation** - Vérification des URLs avant traitement
- **Sanitization** - Pas d'injection SQL grâce aux requêtes préparées
- **Headers sécurisés** - X-Content-Type-Options, X-Frame-Options, etc.

### En-têtes de sécurité

Le serveur ajoute automatiquement :
- `X-API-Version` - Version de l'API
- `Content-Security-Policy` - Politique de sécurité du contenu
- `Strict-Transport-Security` - Force HTTPS
- `X-Content-Type-Options: nosniff` - Prévient le MIME sniffing

---

## Limitations connues

### Base de données SQLite

En production sur Render (plan gratuit), la base de données SQLite est stockée sur un filesystem éphémère. Les données sont perdues lors :
- Du redémarrage du service
- Du redéploiement de l'application
- De la mise à jour du code

**Solutions pour la production :**
1. Migrer vers PostgreSQL (recommandé, offert par Render)
2. Utiliser un service de base de données externe (Supabase, PlanetScale)
3. Utiliser un stockage persistant (Render Disks, plan payant)

### Performance

- **Cold start** - Le premier accès après 15 minutes d'inactivité prend 30 secondes
- **Plan gratuit** - CPU et RAM limités, pas adapté pour une forte charge

---

## Développement futur

### Améliorations possibles

- Migration vers PostgreSQL pour la persistance
- Système d'authentification utilisateur complet
- Dashboard d'administration
- Statistiques avancées (graphiques, analytics)
- QR codes pour les liens
- Liens avec expiration automatique
- API rate limiting pour éviter les abus
- Tests automatisés (Jest, Mocha)
- Custom domains pour les liens courts
- Export des données (CSV, JSON)

---

## Auteur

**Yaël**  
TP Développement Web - 2025  
Université [Nom de votre université]

---

## Licence

Ce projet est réalisé dans le cadre d'un travail pratique universitaire.  
Le code est fourni à des fins éducatives.

---

## Support et contact

- **Issues GitHub :** https://github.com/VOTRE-USERNAME/TP6_devweb_yael/issues
- **Documentation API :** https://tp6-devweb-yael.onrender.com/api-docs
- **Application live :** https://tp6-devweb-yael.onrender.com

---

**Date de dernière mise à jour :** 29 septembre 2025

# https://tp6-devweb-yael.onrender.com

