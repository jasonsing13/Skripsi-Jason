const getDetail_Template_Vs = `select * from public.detail_template_vs`;
const getDetail_Template_VsById = `select * from public.detail_template_vs where d_template_vs_id = $1`;
const addDetail_Template_Vs = `INSERT INTO public.detail_template_vs (dtemplate_vs_id, template_vs_id, vs_kriteria_id, bobot)
VALUES ($1, $2, $3, $4);`
const removeDetail_Template_Vs = ` delete from public.detail_template_vs whered_template_vs_id = $1 `;
const updateDetail_Template_Vs = `update public.detail_template_vs set username =$1 where d_template_vs_id = $2 `;


module.exports = {
    getDetail_Template_Vs,
    getDetail_Template_VsById,
    addDetail_Template_Vs,
    removeDetail_Template_Vs,
    updateDetail_Template_Vs,
};

