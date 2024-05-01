const getKriteria = `select * from public.kriteria `;
const getKriteriaById = `select * from public.kriteria where vs_kriteria_id = $1`;

module.exports = {
    getKriteria,
    getKriteriaById,
};

