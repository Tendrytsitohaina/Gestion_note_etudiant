const express = require('express');
const cors = require('cors');
const db = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { authenticateToken, requireAdmin } = require('./middleware/auth');

const app = express();
const SECRET = process.env.JWT_SECRET || 'gestnote_secret_2025';

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ─── AUTH ────────────────────────────────────────────────

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

    const token = jwt.sign(
      { id: user.id, nom: user.nom, email: user.email, role: user.role },
      SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, nom: user.nom, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Register — admin seulement
app.post('/api/register', authenticateToken, requireAdmin, async (req, res) => {
  const { nom, email, password, role } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.execute(
      'INSERT INTO users (nom, email, password, role) VALUES (?, ?, ?, ?)',
      [nom, email, hashed, role || 'user']
    );
    res.json({ success: true, message: 'Utilisateur créé' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(400).json({ message: 'Email déjà utilisé' });
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Créer le premier admin (à utiliser UNE SEULE FOIS puis supprimer)
app.post('/api/init-admin', async (req, res) => {
  try {
    const [existing] = await db.query("SELECT * FROM users WHERE role = 'admin'");
    if (existing.length > 0)
      return res.status(400).json({ message: 'Admin existe déjà' });

    const hashed = await bcrypt.hash('admin1234', 10);
    await db.execute(
      'INSERT INTO users (nom, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin', 'admin@gestnote.mg', hashed, 'admin']
    );
    res.json({ success: true, message: 'Admin créé : admin@gestnote.mg / admin1234' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ─── ETUDIANTS (protégées) ───────────────────────────────

app.post('/api/etudiant', authenticateToken, async (req, res) => {
  try {
    const { numRt, nom, note_math, note_phys } = req.body;
    await db.execute(
      'INSERT INTO etudiants (numRt, nom, note_math, note_phys) VALUES (?, ?, ?, ?)',
      [numRt, nom, note_math, note_phys]
    );
    res.json({ success: true, message: 'Insertion réussie' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Insertion échouée' });
  }
});

app.get('/api/etudiants', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT *, (note_math + note_phys) / 2 AS moyenne FROM etudiants'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
});

app.get('/api/etudiant/:numRt', authenticateToken, async (req, res) => {
  const { numRt } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM etudiants WHERE numRt = ?', [numRt]);
    if (rows.length === 0)
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.put('/api/etudiant/:numRt', authenticateToken, async (req, res) => {
  const { numRt } = req.params;
  const { nom, note_math, note_phys } = req.body;
  try {
    const [result] = await db.execute(
      'UPDATE etudiants SET nom = ?, note_math = ?, note_phys = ? WHERE numRt = ?',
      [nom, parseFloat(note_math), parseFloat(note_phys), numRt]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Aucun étudiant mis à jour' });
    res.json({ success: true, message: 'Mis à jour avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur SQL' });
  }
});

app.delete('/api/etudiant/:id', authenticateToken, async (req, res) => {
  try {
    await db.execute('DELETE FROM etudiants WHERE numRt = ?', [req.params.id]);
    res.json({ success: true, message: 'Suppression réussie' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Suppression échouée' });
  }
});

app.get('/api/bilan', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        AVG((note_math + note_phys) / 2) AS moy_classe,
        MAX((note_math + note_phys) / 2) AS max_moy,
        MIN((note_math + note_phys) / 2) AS min_moy,
        SUM(CASE WHEN (note_math + note_phys) / 2 >= 10 THEN 1 ELSE 0 END) AS admis,
        SUM(CASE WHEN (note_math + note_phys) / 2 < 10 THEN 1 ELSE 0 END) AS redoublants
      FROM etudiants
    `);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur bilan' });
  }
});

app.listen(5000, () => console.log('Serveur démarré sur http://localhost:5000'));