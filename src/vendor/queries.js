const getListVendor = `SELECT i.*, r.rekening_id,
r.nama_pemilik_rekening,
r.no_rekening,
r.bank_id,
s.nama_status, 
s.status_id, 
jp.nama_kategori_vendor, 
jv.nama_jenis_vendor,
p.nama_provinsi,
kk.nama_kk,
b.*
FROM 
public.vendor i
LEFT JOIN 
public.status s ON i.status_verifikasi_id = s.status_id
LEFT JOIN 
public.kategori_vendor jp ON i.kategori_vendor_id = jp.kategori_vendor_id
LEFT JOIN 
public.jenis_vendor jv ON i.jenis_vendor_id = jv.jenis_vendor_id
LEFT JOIN
public.rekening r ON i.rekening_id = r.rekening_id
LEFT JOIN
public.bank b ON b.bank_id = r.bank_id
LEFT JOIN
  public.kabupaten_kota kk ON i.kk_id = kk.kk_id
LEFT JOIN
  public.provinsi p ON kk.provinsi_id = p.provinsi_id
GROUP BY i.id,r.rekening_id,
r.nama_pemilik_rekening,
r.no_rekening,
r.bank_id,
s.nama_status, 
s.status_id, 
jp.nama_kategori_vendor, 
jv.nama_jenis_vendor,
p.nama_provinsi,
kk.nama_kk, b.bank_id`;

const getVendor = `SELECT 
i.*,
r.rekening_id,
r.nama_pemilik_rekening,
r.no_rekening,
r.bank_id,
s.nama_status, 
s.status_id, 
jp.nama_jenis_pengadaan, 
jv.nama_jenis_vendor
FROM 
public.vendor i
LEFT JOIN 
public.status s ON i.status_id = s.status_id
LEFT JOIN 
public.jenis_pengadaan jp ON i.jenis_pengadaan_id = jp.jenis_pengadaan_id
LEFT JOIN 
public.jenis_vendor jv ON i.jenis_vendor_id = jv.jenis_vendor_id
LEFT JOIN
public.rekening r ON i.rekening_id = r.rekening_id
WHERE LOWER(nama_vendor) LIKE '%' || LOWER($1) || '%' AND i.jenis_vendor_id = $2
`;

const getEmail = `
SELECT i.*, r.*, b.*, kk.*, p.*
FROM vendor i
LEFT JOIN
public.rekening r ON i.rekening_id = r.rekening_id
LEFT JOIN
public.bank b ON b.bank_id = r.bank_id
LEFT JOIN
public.provinsi p ON p.provinsi_id = i.provinsi_id
LEFT JOIN
public.kabupaten_kota kk ON kk.provinsi_id = p.provinsi_id
WHERE email_perusahaan = $1 LIMIT 1;
`

const getProfilInformasi = `
  SELECT  
    vendor.id, 
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
    vendor.id = $1
`;

const getProfilAkunBank = `SELECT
v.nama_vendor,
v.id,
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
v.id = $1;
`

const getProfilPerpajakan = `SELECT
nama_vendor,
no_npwp,
status_pkp,
nppkp
FROM public.vendor
WHERE id = $1;
`

const getProfilLegalitas = `SELECT
nama_vendor,
no_nibrba,
no_ktp_direktur
FROM public.vendor
WHERE id = $1;
`

const getApprovedVendorProfile =`
SELECT  
vendor.nama_vendor, 
vendor.id,
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
vendor.id = $1
`

const getApprovedAkunBank =`
SELECT
v.nama_vendor,
v.id,
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
v.id = $1;
`
const getApprovedAkunPerpajakan = `
SELECT
nama_vendor,
no_npwp,
status_pkp,
nppkp
FROM public.vendor
WHERE id = $1;
`

const getApprovedLegalitas = `
SELECT
nama_vendor,
no_nibrba,
no_ktp_direktur
FROM public.vendor
WHERE id = $1;
`

const getVendorById = `select * from vendor where id = $1`;

const option_Jenis_Vendor = `SELECT jenis_vendor_id, nama_jenis_vendor
FROM public.jenis_vendor;
`;

const option_bank = `SELECT bank_id, nama_bank
FROM public.bank;
`;

const option_kategori_vendor = `SELECT kategori_vendor_id, nama_kategori_vendor
FROM public.kategori_vendor;
`;

const option_Provinsi = `SELECT provinsi_id, nama_provinsi
FROM public.provinsi; 
`;

const option_Kabupaten_Kota = `SELECT kk_id, nama_kk
FROM kabupaten_kota WHERE provinsi_id = $1`;

const option_Bank = `SELECT bank_id, nama_bank
FROM public.bank;
`;


const addVendor = `
INSERT INTO public.vendor( 
  nama_vendor,
  email_perusahaan,
  username,
  password,
  jenis_vendor_id,
  kategori_vendor_id,
  status_kantor,
  alamat_perusahaan,
  nama_direktur,
  no_telp,
  negara,
  provinsi_id,
  kk_id,
  no_npwp,
  status_pkp,
  nppkp,
  no_nibrba,
  no_ktp_direktur,
  rekening_id
) VALUES (
  $1,  -- nama_vendor
  $2,  -- email_perusahaan
  $3,  -- jenis_id
  $4,  -- status_kantor
  $5,  -- alamat_perusahaan
  $6,  -- nama_direktur
  $7,  -- no_telp
  $8,  -- negara
  $9, -- provinsi_id
  $10, -- kk_id
  $11,
  $12,
  $13,
  $14,
  $15,
  $16,
  $17,
  $18,
  $19
) RETURNING id;`


const addAccount = `
INSERT INTO public.vendor
(
  username, 
  password) 
  VALUES ($1, $2)
`;


const removeVendor = ` delete from vendor where id = $1 `;

const getRekening_Vendor = 
` SELECT r.rekening_id, b.bank_id 
FROM rekening r
LEFT JOIN bank b ON b.bank_id = r.bank_id
WHERE LOWER(r.nama_pemilik_rekening) = LOWER($1) AND LOWER(r.no_rekening) = LOWER($2) AND LOWER(b.nama_bank) = LOWER($3)`;

const addBank_Vendor = 
` INSERT INTO bank
  (nama_bank)
  VALUES ($1) 
  RETURNING bank_id
  `;

const addRekening_Vendor = 
` INSERT INTO rekening
  (nama_pemilik_rekening, no_rekening, bank_id)
  VALUES ($1, $2, $3) 
  RETURNING rekening_id
  `;

const updateRekening_Vendor = `
  UPDATE public.vendor
  SET 
    rekening_id =$1
  WHERE id = $2;
`;

const updateTax_Vendor = `
  UPDATE public.vendor
  SET 
    no_npwp = $1,
    status_pkp = $2
  WHERE id = $3;
`;

const updateLegal_Vendor = `
  UPDATE public.vendor
  SET
    no_nibrba = $1,
    no_ktp_direktur = $2
  WHERE id = $3;
`;

const update_url_ktp_direktur = ` 
  UPDATE public.vendor
  SET 
    url_ktp_direktur = $2
  WHERE id = $1;
`;
const update_url_ktp_penerima_kuasa = ` 
  UPDATE public.vendor
  SET 
    url_ktp_penerima_kuasa = $2
  WHERE id = $1;
`;
const update_url_nibrba = ` 
  UPDATE public.vendor
  SET 
    url_nibrba = $2
  WHERE id = $1;
`;
const update_url_akta_pendirian = ` 
  UPDATE public.vendor
  SET 
    url_akta_pendirian = $2
  WHERE id = $1;
`;
const update_url_akta_perubahan = ` 
  UPDATE public.vendor
  SET 
    url_akta_perubahan = $2
  WHERE id = $1;
`;
const update_url_dokumen_ijin_lain = ` 
  UPDATE public.vendor
  SET 
    url_dokumen_ijin_lain = $2
  WHERE id = $1;
`;
const update_url_dokumen_npwp = ` 
  UPDATE public.vendor
  SET 
    url_dokumen_npwp = $2
  WHERE id = $1;
`;
const update_url_buku_akun_bank = ` 
  UPDATE public.vendor
  SET 
    url_buku_akun_bank = $2
  WHERE id = $1;
`;
const update_url_profil_perusahaan = ` 
  UPDATE public.vendor
  SET 
    url_profil_perusahaan = $2
  WHERE id = $1;
`;
const update_url_dokumen_ppkp = ` 
  UPDATE public.vendor
  SET 
    url_dokumen_ppkp = $2
  WHERE id = $1;
`;

const updateStatus_Vendor = `
  UPDATE public.vendor
  SET
    status_verifikasi_id = $1
  WHERE id = $2;
`;

module.exports = {
    getVendor,
    getEmail,
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
    getRekening_Vendor,
    addBank_Vendor,
    addRekening_Vendor,
    updateRekening_Vendor,
    updateTax_Vendor,
    updateLegal_Vendor,
    update_url_ktp_direktur,
    update_url_ktp_penerima_kuasa,
    update_url_nibrba,
    update_url_akta_pendirian,
    update_url_akta_perubahan,
    update_url_dokumen_ijin_lain,
    update_url_dokumen_npwp,
    update_url_buku_akun_bank,
    update_url_profil_perusahaan,
    update_url_dokumen_ppkp,
    updateStatus_Vendor,
    getListVendor,
    option_bank
};

