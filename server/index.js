const express = require('express');
const cors = require('cors');
const db = require('./db'); // Assurez-vous que ce fichier exporte la connexion mysql2
const app = express();

app.use(cors());
app.use(express.json());

// 1. Ajouter un étudiant
app.post('/api/etudiant', async (req, res) => {
    try {
        const { numRt, nom, note_math, note_phys } = req.body;
        await db.execute(
            'INSERT INTO etudiants (numRt, nom, note_math, note_phys) VALUES (?, ?, ?, ?)',
            [numRt, nom, note_math, note_phys]
        );
        res.json({ success: true, message: "Insertion réussie" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Insertion échouée" });
    }
});

// 2. Afficher la liste avec moyenne
app.get('/api/etudiants', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT *, (note_math + note_phys) / 2 AS moyenne FROM etudiants'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération" });
    }
});

/// 1. Récupérer un étudiant (Pour l'affichage par défaut)
app.get('/api/etudiant/:numRt', async (req, res) => {
    const { numRt } = req.params;
    try {
        const [rows] = await db.query("SELECT * FROM etudiants WHERE numRt = ?", [numRt]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Étudiant non trouvé" });
        }
        // On renvoie l'objet trouvé. Vérifiez que les colonnes s'appellent bien nom, note_math, note_phys dans votre SQL
        res.json(rows[0]); 
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur lors de la récupération" });
    }
});

// 2. Mettre à jour (Pour le bouton Enregistrer)
app.put('/api/etudiant/:numRt', async (req, res) => {
    const { numRt } = req.params;
    const { nom, note_math, note_phys } = req.body;
    
    try {
        // Conversion forcée en nombres pour éviter les erreurs SQL
        const n_math = parseFloat(note_math);
        const n_phys = parseFloat(note_phys);

        const query = "UPDATE etudiants SET nom = ?, note_math = ?, note_phys = ? WHERE numRt = ?";
        const [result] = await db.execute(query, [nom, n_math, n_phys, numRt]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Aucun étudiant mis à jour" });
        }

        res.json({ success: true, message: "Mis à jour avec succès" });
    } catch (err) {
        console.error("Erreur SQL détaillée:", err);
        res.status(500).json({ message: "Erreur lors de la mise à jour SQL" });
    }
});

// 5. Supprimer
app.delete('/api/etudiant/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM etudiants WHERE numRt = ?', [req.params.id]);
        res.json({ success: true, message: "Suppression réussie" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Suppression échouée" });
    }
});

app.listen(5000, () => console.log('Serveur démarré sur http://localhost:5000'));