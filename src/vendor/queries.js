const getVendor = `select * from vendor `;
const getVendorById = `select * from vendor where vendor_id = $1`;
// const addVendor = `INSERT INTO vendor (vendor_id, nama_vendor, no_telp, nama_direktur, status_kantor, jenis_pengadaan, no_rek, username, password, email_perusahaan, alamat_perusahaan, url_ktp_direktur, url_ktp_penerima_kuasa, url_nibrba, url_akta_pendirian, url_akta_perubahan, url_dokumen_ijin_lain, url_dokumen_npwp, url_buku_akun_bank, create_date, create_by, modif_date, modif_by, negara, provinsi, kabupaten_kota, nama_bank, nama_pemilik_rekening, no_npwp, no_kpt_penerima_kuasa, url_profil_perusahaan)
// VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`
const addVendor = `INSERT INTO vendor (vendor_id, nama_vendor, no_telp, nama_direktur, status_kantor, jenis_pengadaan, no_rek, username, password, email_perusahaan, alamat_perusahaan, url_ktp_direktur, url_ktp_penerima_kuasa, url_nibrba, url_akta_pendirian, url_akta_perubahan, url_dokumen_ijin_lain, url_dokumen_npwp, url_buku_akun_bank, create_date, create_by, modif_date, modif_by, negara, provinsi, kabupaten_kota, nama_bank, nama_pemilik_rekening, no_npwp, no_kpt_penerima_kuasa, url_profil_perusahaan) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31);`;
const removeVendor = ` delete from vendor where vendor_id = $1 `;
// const updateVendor = `update user set username =$1 where vendor_id = $2 `;
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
    getVendorById,
    addVendor,
    removeVendor,
    updateVendor,
};