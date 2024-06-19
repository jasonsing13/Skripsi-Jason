const getDetail_Template_Vs = `select k.* from detail_template_vs d
LEFT JOIN kriteria k ON k.vs_kriteria_id = d.vs_kriteria_id
WHERE d.template_vs_id = $1`;
const getDetail_Template_VsById = `select * from public.detail_template_vs where d_template_vs_id = $1`;
const getDetail_Template_VsByName = `select d.* from public.detail_template_vs d 
LEFT JOIN template_vs t ON t.template_vs_id = d.template_vs_id 
where LOWER(t.nama_template) = LOWER($1)`;
const addDetail_Template_Vs = `INSERT INTO public.detail_template_vs (dtemplate_vs_id, template_vs_id, vs_kriteria_id, bobot)
VALUES ($1, $2, $3, $4);`
const removeDetail_Template_Vs = ` delete from public.detail_template_vs where d_template_vs_id = $1 `;
const updateDetail_Template_Vs = `update public.detail_template_vs set username =$1 where d_template_vs_id = $2 `;


module.exports = {
    getDetail_Template_Vs,
    getDetail_Template_VsById,
    getDetail_Template_VsByName,
    addDetail_Template_Vs,
    removeDetail_Template_Vs,
    updateDetail_Template_Vs,
};

