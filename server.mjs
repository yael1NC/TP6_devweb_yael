import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { promises as fs } from 'fs';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { config, logLevel } from './config.mjs';
import { initDatabase, closeDatabase } from './database/database.mjs';
import apiV1Router from './router/api-v1.mjs';
import apiV2Router from './router/api-v2.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configuration de base
app.disable('x-powered-by');
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// Middlewares
app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'X-API-Key'],
  credentials: false
}));
app.use(morgan(logLevel));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour ajouter X-API-version
app.use((req, res, next) => {
  res.set('X-API-Version', '1.0.0');
  next();
});

// Servir les fichiers statiques
app.use(express.static(join(__dirname, 'static')));

// Documentation Swagger
try {
  const swaggerDoc = yaml.load(await fs.readFile(join(__dirname, 'static/open-api.yaml'), 'utf8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
} catch (error) {
  console.error('Erreur chargement Swagger:', error);
}

// Routes API
app.use('/api-v1', apiV1Router);
app.use('/api-v2', apiV2Router);

// Client AJAX
app.get('/client', (req, res) => {
  res.sendFile(join(__dirname, 'static', 'client.html'));
});

// Route par défaut - redirige vers le client
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'static', 'client.html'));
});

// Route d'erreur pour les tests
app.get('/error', (req, res) => {
  throw new Error('Test error 500');
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrage du serveur
async function startServer() {
  try {
    await initDatabase();
    
    // IMPORTANT: Utiliser process.env.PORT pour Render
    const PORT = process.env.PORT || config.port;
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
      console.log(`Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`Mode: ${config.nodeEnv}`);
      console.log(`Client: http://localhost:${PORT}/`);
    });

    // Gestion de l'arrêt propre
    const shutdown = async (signal) => {
      console.log(`\n${signal} reçu, arrêt du serveur...`);
      server.close(async () => {
        await closeDatabase();
        console.log('Serveur arrêté proprement');
        process.exit(0);
      });
      
      // Force l'arrêt après 10 secondes
      setTimeout(() => {
        console.error('Arrêt forcé après timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('Erreur démarrage serveur:', error);
    process.exit(1);
  }
}

startServer();