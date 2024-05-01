const getTemplate_Vs = `select * from public.template_vs`;
const getTemplate_VsById = `select * from public.user where template_vs_id = $1`

module.exports = {
    getTemplate_Vs,
    getTemplate_VsById,
};

