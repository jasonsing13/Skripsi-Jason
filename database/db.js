const { Pool } = require('pg');

const pool = new Pool({
  user: 'admin',
  password: 'admin',
  host: 'localhost', 
  port: 5432, // default Postgres port
  database: 'DB_Portal_Vendor'
});

// pool.on('connect', () => {
//   console.log('Connected to the 2 database');
// });

// module.exports = {
//   query: (text, params) => pool.query(text, params)
// };

function saveVendorInformation(vendorData) {
  return new Promise((resolve, reject) => {
    // Simulate a delay of 500ms and then resolve
    setTimeout(() => {
      console.log("Simulated save:", vendorData);
      resolve();
    }, 500);
  });
}

function saveAllVendorInformation(allData) {
  // Implementation to save all vendor data to the database
  // This is a placeholder and should be replaced with actual database interaction code
  console.log("Saving all vendor data:", allData);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
}

async function saveFileInformation(fileUrls) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const updateQuery = `
      UPDATE public.vendor
      SET url_buku_akun_bank= $1, url_npwp = $2, url_pkp = $3,  url_ktp_direktur = $4, url_akta_perubahan = $5, url_akta_pendirian = $6, url_nibrba = $7, url_dokumen_ijin_lain = $8, url_profile_perusahaan = $9
      WHERE vendor_id = $10;  -- Ensure you have a way to specify which vendor to update
    `;
    await client.query(updateQuery, [
      fileUrls.url_buku_akun_bank,
      fileUrls.url_npwp,
      fileUrls.url_pkp,
      fileUrls.url_ktp_direktur,
      fileUrls.url_akta_perubahan,
      fileUrls.url_akta_pendirian,
      fileUrls.url_nibrba,
      fileUrls.url_dokumen_ijin_lain,
      fileUrls.url_profile_perusahaan,
      vendorId  // You need to determine how to get this vendor_id
    ]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}


module.exports = {
  pool,
  saveVendorInformation,
  saveAllVendorInformation,
  saveVendorInformation
}

