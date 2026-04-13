const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/departemen_inventaris',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(80) UNIQUE NOT NULL,
        password VARCHAR(200) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS barang (
        id SERIAL PRIMARY KEY,
        tanggal DATE NOT NULL,
        kode_barang VARCHAR(50),
        nama_barang VARCHAR(200) NOT NULL,
        kategori VARCHAR(50) NOT NULL,
        jenis VARCHAR(100),
        expired DATE,
        satuan VARCHAR(50),
        stok_awal INTEGER DEFAULT 0,
        masuk INTEGER DEFAULT 0,
        keluar INTEGER DEFAULT 0,
        stok_akhir INTEGER DEFAULT 0,
        harga NUMERIC DEFAULT 0,
        total_nilai NUMERIC DEFAULT 0,
        supplier VARCHAR(200),
        kondisi VARCHAR(100),
        lokasi VARCHAR(200),
        status VARCHAR(100),
        tgl_pemeliharaan DATE,
        pj VARCHAR(200),
        nama_penerima VARCHAR(200),
        nrp_nip VARCHAR(100),
        unit VARCHAR(100),
        ket TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Database tables ready');
  } finally {
    client.release();
  }
}

module.exports = { pool, initDB };
