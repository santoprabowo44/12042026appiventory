require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const { initDB } = require('../config/db');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const barangRoutes = require('./routes/barang');
const exportRoutes = require('./routes/export');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SECRET_KEY || 'departemen-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 } // 8 hours
}));
app.use(flash());

// Global locals
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.kategoriList = ['BEKKES','ALKES','ATK','ART','ALSINTOR','ALSATRI','ALKOMLEK','BANGFAS'];
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/', dashboardRoutes);
app.use('/barang', barangRoutes);
app.use('/export', exportRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('pages/404', { title: '404 - Halaman Tidak Ditemukan' });
});

// Start
async function start() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  });
}

start();
