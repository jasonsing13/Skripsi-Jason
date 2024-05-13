const getVendor = `SELECT vendor.*, status.nama_status, jenis_pengadaan.nama_jenis_pengadaan, jenis_vendor.nama_jenis_vendor
FROM vendor
INNER JOIN status ON vendor.status_id = status.status_id
INNER JOIN jenis_pengadaan ON vendor.jenis_pengadaan_id = jenis_pengadaan.jenis_pengadaan_id
INNER JOIN jenis_vendor ON vendor.jenis_vendor_id = jenis_vendor.jenis_vendor_id`;

const getVendorById = `select * from vendor where vendor_id = $1`;

const option_Jenis_Vendor = `SELECT jenis_vendor_id, nama_jenis_vendor
FROM public.jenis_vendor;
`;
const addVendor = `INSERT INTO public.vendor( 
  nama_vendor, 
  no_telp, 
  nama_direktur, 
  status_kantor, 
  no_rek, 
  username, 
  password, 
  email_perusahaan, 
  alamat_perusahaan, 
  url_ktp_direktur, 
  url_ktp_penerima_kuasa, 
  url_nibrba, 
  url_akta_pendirian, 
  url_akta_perubahan, 
  url_dokumen_ijin_lain, 
  url_dokumen_npwp, 
  url_buku_akun_bank, 
  create_date, 
  create_by, 
  modif_date, 
  modif_by, 
  negara, 
  provinsi, 
  kabupaten_kota, 
  nama_bank, 
  nama_pemilik_rekening, 
  no_npwp, 
  no_kpt_penerima_kuasa, 
  url_profil_perusahaan, 
) VALUES (
  $1,  -- nama_vendor
  $2,  -- no_telp
  $3,  -- nama_direktur
  $4,  -- status_kantor
  $5,  -- no_rek
  $6,  -- username
  $7,  -- password
  $8,  -- email_perusahaan
  $9, -- alamat_perusahaan
  $10, -- url_ktp_direktur
  $11, -- url_ktp_penerima_kuasa
  $12, -- url_nibrba
  $13, -- url_akta_pendirian
  $14, -- url_akta_perubahan
  $15, -- url_dokumen_ijin_lain
  $16, -- url_dokumen_npwp
  $17, -- url_buku_akun_bank
  CURRENT_TIMESTAMP,  -- create_date
  $18, -- create_by
  CURRENT_TIMESTAMP,  -- modif_date
  $20, -- modif_by
  $21, -- negara
  $22, -- provinsi
  $23, -- kabupaten_kota
  $24, -- nama_bank
  $25, -- nama_pemilik_rekening
  $26, -- no_npwp
  $27, -- no_kpt_penerima_kuasa
  $28, -- url_profil_perusahaan
)`;

const removeVendor = ` delete from vendor where vendor_id = $1 `;

const updateVendor = `
  UPDATE vendor
  SET 
    nama_vendor = $2,
    no_telp = $3,
    nama_direktur = $4,
    status_kantor = $5,
    jenis_pengadaan = $6,
    no_rek = $7,
    username = $8,
    password = $9,
    email_perusahaan = $10,
    alamat_perusahaan = $11,
    url_ktp_direktur = $12,
    url_ktp_penerima_kuasa = $13,
    url_nibrba = $14,
    url_akta_pendirian = $15,
    url_akta_perubahan = $16,
    url_dokumen_ijin_lain = $17,
    url_dokumen_npwp = $18,
    url_buku_akun_bank = $19,
    create_date = $20,
    create_by = $21,
    modif_date = $22,
    modif_by = $23,
    negara = $24,
    provinsi = $25,
    kabupaten_kota = $26,
    nama_bank = $27,
    nama_pemilik_rekening = $28,
    no_npwp = $29,
    no_kpt_penerima_kuasa = $30,
    url_profil_perusahaan = $31
  WHERE vendor_id = $1;
`;



module.exports = {
    getVendor,
    option_Jenis_Vendor,
    getVendorById,
    addVendor,
    removeVendor,
    updateVendor,
};