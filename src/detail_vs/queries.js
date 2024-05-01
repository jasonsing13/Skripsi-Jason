const getDetail_Vs = `select * from public.detail_vs `;
const getDetail_VsById = `select * from public.detail_vs where detail_vs_id = $1`;
const addDetail_Vs = `INSERT INTO public.detail_vs (detail_vs_id, vs_id, template_vs_id, score, deskripsi_sub_kriteria, bobot)
VALUES ($1, $2, $3, $4, $5, $6);`
const removeDetail_Vs = ` delete from public.detail_vs where detail_vs_id = $1 `;
const updateDetail_Vs = `update public.detail_vs set username =$1 where detail_vs_id = $2 `;


module.exports = {
    getDetail_Vs,
    getDetail_VsById,
    addDetail_Vs,
    removeDetail_Vs,
    updateDetail_Vs,
};

