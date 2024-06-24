const getTemplate_Vs = `select * from template_vs`;
const getTemplate_VsById = `select * from template_vs where template_vs_id = $1`;
const getTemplate_VsByName = `select k.*, t.deskripsi_template, t.template_vs_id
from template_vs t 
LEFT JOIN detail_template_vs d ON d.template_vs_id = t.template_vs_id
LEFT JOIN kriteria k ON k.vs_kriteria_id = d.vs_kriteria_id 
where LOWER(nama_template) = LOWER($1)`;
const addTemplate_Vs = `
INSERT INTO template_vs (nama_template, deskripsi_template)
VALUES ($1, $2)
RETURNING template_vs_id
`

module.exports = {
    getTemplate_Vs,
    getTemplate_VsById,
    getTemplate_VsByName,
    addTemplate_Vs
};

