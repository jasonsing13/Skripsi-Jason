const getUser = `select * from "user" `;
const getUserById = `select * from public.user where user_id = $1`;
const addUser = `INSERT INTO public.user (user_id, username, password, email, first_name, last_name, phone_number, create_by, create_date, modif_by, modif_date, role_id)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`
const removeUser = ` delete from public.user where user_id = $1 `;
const updateUser = `update public.user set username =$1 where user_id = $2 `;


module.exports = {
    getUser,
    getUserById,
    addUser,
    removeUser,
    updateUser,
};

const getRole = `select * from "role" `;
const getRoleById = `select * from public.role where role_id = $1`;

module.exports={
    getRole,
    getRoleById,
};

const getVendor = `select * from "vendor" `;
const getVendorById = `select * from public.vendor where vendor_id = $1`;
const addVendor = `INSERT INTO public.vendor (vendor_id, nama_vendor, no_telp, nama_direktur, status_kantor, jenis_pengadaan, no_rek, username, password, email_perusahaan, alamat_perusahaan, url_ktp_direktur, url_ktp_penerima_kuasa, url_nibrba, url_akta_pendirian, url_akta_perubahan, url_dokumen_ijin_lain, url_dokumen_npwp, url_buku_akun_bank, create_date, create_by, modif_date, modif_by, negara, provinsi, kabupaten_kota, nama_bank, nama_pemilik_rekening, no_npwp, no_kpt_penerima_kuasa, url_profil_perusahaan)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`
const removeVendor = ` delete from public.user where user_id = $1 `;
const updateVendor = `update public.user set username =$1 where user_id = $2 `;

module.exports = {
    getVendor,
    getVendorById,
    addVendor,
    removeVendor,
    updateVendor,
};





