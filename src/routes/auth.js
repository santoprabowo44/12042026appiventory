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

    console.log('Login attempt:', username);
    console.log('User found:', user ? 'yes' : 'no');

    if (!user) {
      req.flash('error', 'Username tidak ditemukan!');
      return res.redirect('/auth/login');
    }

    const match = bcrypt.compareSync(password, user.password);
    console.log('Password match:', match);

    if (!match) {
      req.flash('error', 'Password salah!');
      return res.redirect('/auth/login');
    }

    req.session.user = { id: user.id, username: user.username, role: user.role };
    res.redirect('/');
  } catch (err) {
    console.error('Login error:', err);
    req.flash('error', 'Terjadi kesalahan server: ' + err.message);
    res.redirect('/auth/login');
  }
});

// Route sementara untuk reset password - HAPUS SETELAH BISA LOGIN
router.get('/reset-password', async (req, res) => {
  try {
    const hash = bcrypt.hashSync('Departemen44!@#', 10);
    await pool.query(
      'UPDATE users SET password=$1 WHERE username=$2',
      [hash, 'Departemen']
    );
    res.send('✅ Password berhasil direset! Sekarang login dengan: Departemen / Departemen44!@#');
  } catch (err) {
    res.send('❌ Error: ' + err.message);
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
});

module.exports = router;
