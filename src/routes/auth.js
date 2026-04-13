const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../../config/db');

router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('pages/login', { title: 'Login — Departemen Inventaris' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user || !bcrypt.compareSync(password, user.password)) {
      req.flash('error', 'Username atau password salah!');
      return res.redirect('/auth/login');
    }
    req.session.user = { id: user.id, username: user.username, role: user.role };
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Terjadi kesalahan server');
    res.redirect('/auth/login');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
});

module.exports = router;
