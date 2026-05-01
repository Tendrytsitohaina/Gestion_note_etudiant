// server/db.js
const mysql = require('mysql2');

// Création du pool de connexion
const pool = mysql.createPool({
    host: 'localhost',      // Ton serveur de BDD
    user: 'root',           // Ton utilisateur BDD (souvent 'root')
    password: '',           // Ton mot de passe BDD (laisse vide si pas de mot de passe)
    database: 'gestion_etudiants', // Le nom de ta base créée précédemment
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Exporter le pool pour l'utiliser dans tes routes
module.exports = pool.promise();