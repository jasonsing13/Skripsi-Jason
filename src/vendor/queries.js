const getVendor = `SELECT 
i.vendor_id,
r.rekening_id,
r.nama_pemilik_rekening,
r.no_rekening,
r.bank_id,
s.nama_status, 
jp.nama_jenis_pengadaan, 
jv.nama_jenis_vendor, 
kv.nama_kategori_vendor,
v.nama_vendor,
v.nama_direktur,
v.status_kantor,
v.username,
v.password,
v.email_perusahaan,
v.alamat_perusahaan,
v.url_ktp_direktur,
v.url_ktp_penerima_kuasa,
v.url_nibrba,
v.url_akta_pendirian,
v.url_akta_perubahan,
v.url_dokumen_ijin_lain,
v.url_dokumen_npwp,
v.url_buku_akun_bank,
v.create_date,
v.create_by,
v.modif_date,
v.modif_by,
v.negara,
v.no_npwp,
v.url_profil_perusahaan,
v.jenis_vendor_id,
v.no_nibrba,
v.kk_id,
v.rekening_id,
v.provinsi_id,
v.url_dokumen_ppkp,
v.status_pkp,
v.no_ktp_direktur,
v.status_id,
v.no_telp,
v.kategori_vendor_id
FROM 
public.vendor i
JOIN 
public.status s ON i.status_id = s.status_id
JOIN 
public.jenis_pengadaan jp ON i.jenis_pengadaan_id = jp.jenis_pengadaan_id
JOIN 
public.jenis_vendor jv ON i.jenis_vendor_id = jv.jenis_vendor_id
JOIN 
public.kategori_vendor kv ON i.kategori_vendor_id = kv.kategori_vendor_id
JOIN 
public.vendor v ON i.vendor_id = v.vendor_id
JOIN
public.rekening r ON i.rekening_id = r.rekening_id
`;

const getProfilInformasi = `
  SELECT  
    vendor.vendor_id, 
    vendor.nama_vendor, 
    vendor.status_kantor,
    vendor.nama_direktur,
    vendor.no_telp,
    vendor.email_perusahaan,
    vendor.alamat_perusahaan,
    vendor.negara,
    p.nama_provinsi,
    kk.nama_kk
  FROM 
    public.vendor 
  JOIN
    public.kabupaten_kota kk ON vendor.kk_id = kk.kk_id
  JOIN
    public.provinsi p ON kk.provinsi_id = p.provinsi_id
  WHERE 
    vendor.vendor_id = $1
`;

const getProfilAkunBank = `SELECT
v.nama_vendor,
v.vendor_id,
r.no_rekening,
r.nama_pemilik_rekening,
b.nama_bank
FROM 
public.vendor v
JOIN
public.rekening r ON v.rekening_id = r.rekening_id
JOIN
public.bank b ON r.bank_id = b.bank_id
WHERE 
v.vendor_id = $1;
`

const getProfilPerpajakan = `SELECT
nama_vendor,
no_npwp,
status_pkp,
nppkp
FROM public.vendor
WHERE vendor_id = $1;
`

const getProfilLegalitas = `SELECT
nama_vendor,
no_nibrba,
no_ktp_direktur
FROM public.vendor
WHERE vendor_id = $1;
`

const getApprovedVendorProfile =`
SELECT  
vendor.nama_vendor, 
vendor.vendor_id,
vendor.status_kantor,
vendor.nama_direktur,
vendor.no_telp,
vendor.email_perusahaan,
vendor.alamat_perusahaan,
vendor.negara,
p.nama_provinsi,
kk.nama_kk
FROM 
public.vendor 
JOIN
public.kabupaten_kota kk ON vendor.kk_id = kk.kk_id
JOIN
public.provinsi p ON kk.provinsi_id = p.provinsi_id
WHERE 
vendor.vendor_id = $1
`

const getApprovedAkunBank =`
SELECT
v.nama_vendor,
v.vendor_id,
r.rekening_id,
r.nama_pemilik_rekening,
r.no_rekening,
b.nama_bank
FROM 
public.vendor v
JOIN
public.rekening r ON v.rekening_id = r.rekening_id
JOIN
public.bank b ON r.bank_id = b.bank_id
WHERE 
v.vendor_id = $1;
`
const getApprovedAkunPerpajakan = `
SELECT
nama_vendor,
no_npwp,
status_pkp,
nppkp
FROM public.vendor
WHERE vendor_id = $1;
`

const getApprovedLegalitas = `
SELECT
nama_vendor,
no_nibrba,
no_ktp_direktur
FROM public.vendor
WHERE vendor_id = $1;
`

const getVendorById = `select * from vendor where vendor_id = $1`;

const option_Jenis_Vendor = `SELECT jenis_vendor_id, nama_jenis_vendor
FROM public.jenis_vendor;
`;

const option_kategori_vendor = `SELECT kategori_vendor_id, nama_kategori_vendor
FROM public.kategori_vendor;
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
  $11, -- create_by
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

const updateVendorURL = ` 
  UPDATE public.vendor
  SET 
    url_buku_akun_bank = $1,
    url_dokumen_npwp = $2, 
    url_dokumen_ppkp = $3, 
    url_ktp_direktur = $4,
    url_akta_perubahan = $5,
    url_akta_pendirian = $6,
    url_nibrba = $7,
    url_dokumen_ijin_lain = $8,
    url_profil_perusahaan = $9 
  WHERE vendor_id = $10;
`;

const updateStatus_Vendor = `
  UPDATE public.vendor
  SET
    status_id = $1
  WHERE vendor_id = $2;
`;

module.exports = {
    getVendor,
    getProfilInformasi,
    getProfilAkunBank,
    getProfilPerpajakan,
    getProfilLegalitas,
    getApprovedVendorProfile,
    getApprovedAkunBank,
    getApprovedAkunPerpajakan,
    getApprovedLegalitas,
    option_Jenis_Vendor,
    option_Provinsi,
    option_Kabupaten_Kota,
    option_Bank,
    getVendorById,
    addVendor,
    option_kategori_vendor,
    removeVendor,
    addRekening_Vendor,
    updateRekening_Vendor,
    updateTax_Vendor,
    updateLegal_Vendor,
    updateVendorURL,
    updateStatus_Vendor
};

