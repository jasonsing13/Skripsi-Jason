const getVendor = `SELECT vendor.*, status.nama_status, jenis_pengadaan.nama_jenis_pengadaan, jenis_vendor.nama_jenis_vendor
FROM vendor
INNER JOIN status ON vendor.status_id = status.status_id
INNER JOIN jenis_pengadaan ON vendor.jenis_pengadaan_id = jenis_pengadaan.jenis_pengadaan_id
INNER JOIN jenis_vendor ON vendor.jenis_vendor_id = jenis_vendor.jenis_vendor_id`;

const getVendorById = `select * from vendor where vendor_id = $1`;

const option_Jenis_Vendor = `SELECT jenis_vendor_id, nama_jenis_vendor
FROM public.jenis_vendor;
`;

const option_Provinsi = `SELECT provinsi_id, nama_provinsi
FROM public.provinsi; 
`;

const option_Kabupaten_Kota = `SELECT kk_id, nama_kk
FROM public.kabupaten_kota WHERE provinsi_id = $1`;

const option_Bank = `SELECT bank_id, nama_bank
FROM public.bank;
`;


const addVendor = `INSERT INTO public.vendor( 
  nama_vendor,
  jenis_vendor_id,
  email_perusahaan,
  status_kantor,
  alamat_perusahaan,
  nama_direktur,
  no_telp,
  negara,
  create_date,
  create_by,
  kk_id
) VALUES (
  $1,  -- nama_vendor
  $2,  -- jenis_vendor_id
  $3,  -- email_perusahaan
  $4,  -- status_kantor
  $5,  -- alamat_perusahaan
  $6,  -- nama_direktur
  $7,  -- no_telp
  $8,  -- negara
  CURRENT_TIMESTAMP,  -- create_date
  $9, -- create_by
  $10, -- kk_id
);`

const removeVendor = ` delete from vendor where vendor_id = $1 `;

const updateVendor1 = 
` UPDATE vendor
  SET 
  nama_bank = $2,
  nama_pemilik_rekening = $3,
  no_rek = $4
WHERE vendor_id = $1;
`;

const updateVendor2 = 
` UPDATE vendor
  SET 
  no_npwp = $2,
WHERE vendor_id = $1;
`;

const updateVendor3 = 
`
UPDATE vendor
 SET
  no_nibrba = $2,
  no_ktp_direktur = $3
 WHERE vendor_id = $1;
`
const updateVendor4 = 
` UPDATE vendor
  SET 
  url_ktp_direktur = $2,
  url_nibrba = $3,
  url_akta_pendirian = $4,
  url_akta_perubahan = $5,
  url_dokumen_ijin_lain = $6,
  url_dokumen_npwp = $7, 
  url_buku_akun_bank = $8, 
  url_profil_perusahaan = $9, 
WHERE vendor_id = $1;
`;



module.exports = {
    getVendor,
    option_Jenis_Vendor,
    option_Provinsi,
    option_Kabupaten_Kota,
    option_Bank,
    getVendorById,
    addVendor,
    removeVendor,
    updateVendor1,
    updateVendor2,
    updateVendor3,
    updateVendor4
};