const getVendor_Score = `select vs.*, v.nama_vendor, jv.nama_jenis_vendor from vendor_score vs
LEFT JOIN vendor v ON v.id = vs.vendor_id
LEFT JOIN jenis_vendor jv ON jv.jenis_vendor_id = v.jenis_vendor_id
WHERE pengadaan_id = $1`;
const getVendor_ScoreById = `select * from vendor_score where pengadaan_id = $1 AND vendor_id = $2`;
const addVendor_Score = `INSERT INTO vendor_score (pengadaan_id, vendor_id)
VALUES ($1, $2);`
const removeUser = ` delete from public.user where user_id = $1 `;
const updateVendor_Score = `update vendor_score 
set final_score =$3, 
bobot_teknikal = $4, 
desc_teknikal = $5
where pengadaan_id = $1 AND vendor_id = $2 
RETURNING vs_id`;
const updateVendor_ScoreKomersil = `update vendor_score 
set final_score =$3, 
bobot_komersial = $4,
desc_komersial = $5
where pengadaan_id = $1 AND vendor_id = $2 
RETURNING vs_id`;
const updateVendor_ScoreDiv = `update vendor_score 
set approve_division =$3
where pengadaan_id = $1 AND vendor_id = $2 `;
const updateVendor_ScoreDep = `update vendor_score 
set approve_department = $3
where pengadaan_id = $1 AND vendor_id = $2 `;
const updateVendor_ScoreP = `update vendor_score 
set approve_presdir = $3
where pengadaan_id = $1 AND vendor_id = $2 `;


module.exports = {
    getVendor_Score,
    getVendor_ScoreById,
    addVendor_Score,
    removeUser,
    updateVendor_Score,
    updateVendor_ScoreKomersil,
    updateVendor_ScoreDiv,
    updateVendor_ScoreDep,
    updateVendor_ScoreP
};

