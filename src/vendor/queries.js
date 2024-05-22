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

const addVendor = `
INSERT INTO public.vendor( 
  vendor_id,
  nama_vendor,
  email_perusahaan,
  jenis_vendor_id,
  status_kantor,
  alamat_perusahaan,
  nama_direktur,
  no_telp,
  negara,
  provinsi_id,
  kk_id,
  create_by,
  create_date
) VALUES (
  gen_random_uuid(), --vendor_id
  $1,  -- nama_vendor
  $2,  -- email_perusahaan
  $3,  -- jenis_vendor_id
  $4,  -- status_kantor
  $5,  -- alamat_perusahaan
  $6,  -- nama_direktur
  $7,  -- no_telp
  $8,  -- negara
  $9, -- provinsi_id
  $10, -- kk_id
  $11 -- create_by
  now() -- create_date
) RETURNING vendor_id;`



// const addAccount = `
// INSERT INTO public.vendor
// (
//   username, 
//   password) 
//   VALUES ($1, $2)
// `;


const removeVendor = ` delete from vendor where vendor_id = $1 `;

const addRekening_Vendor = 
` INSERT INTO public.rekening
  (rekening_id, nama_pemilik_rekening, no_rekening, bank_id)
  VALUES (gen_random_uuid(), $2, $3, $4) 
  `;

const updateRekening_Vendor = `
  UPDATE public.vendor
  SET 
    rekening_id =$1
  WHERE vendor_id = $2;
`;

const updateTax_Vendor = `
  UPDATE public.vendor
  SET 
    no_npwp = $1,
    status_pkp = $2
  WHERE vendor_id = $3;
`;


const updateLegal_Vendor = `
  UPDATE public.vendor
  SET
    no_nibrba = $1,
    no_ktp_direktur = $2
  WHERE vendor_id = $3;
`;

const updateVendorURL = 
` UPDATE public.vendor
  SET 
  url_buku_akun_bank = 2,
  url_dokumen_npwp = $3, 
  url_dokumen_ppkp = $4, 
  url_ktp_direktur = $5,
  url_akta_perubahan = $6,
  url_akta_pendirian = $7,
  url_nibrba = $8,
  url_dokumen_ijin_lain = $9,
  url_profil_perusahaan = $10, 
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
    // addAccount,
    removeVendor,
    addRekening_Vendor,
    updateRekening_Vendor,
    updateTax_Vendor,
    updateLegal_Vendor,
    updateVendorURL
};

