const getVendor_Score = `select vs.*, v.nama_vendor, jv.nama_jenis_vendor from vendor_score vs
LEFT JOIN vendor v ON v.id = vs.vendor_id
LEFT JOIN jenis_vendor jv ON jv.jenis_vendor_id = v.jenis_vendor_id
WHERE pengadaan_id = $1`;
const getVendor_ScoreById = `select * from vendor_score where pengadaan_id = $1 AND vendor_id = $2`;
const addVendor_Score = `INSERT INTO vendor_score (pengadaan_id, vendor_id)
VALUES ($1, $2);`
const removeUser = ` delete from public.user where user_id = $1 `;
const updateUser = `update public.user set username =$1 where user_id = $2 `;


module.exports = {
    getVendor_Score,
    getVendor_ScoreById,
    addVendor_Score,
    removeUser,
    updateUser,
};

