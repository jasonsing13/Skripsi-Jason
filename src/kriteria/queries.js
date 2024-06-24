const getKriteria = `select * from public.kriteria `;
const getKriteriaById = `select * from kriteria where vs_kriteria_id = $1`;
const addKriteria = `
INSERT INTO kriteria (nama_kriteria, nama_sub_kriteria)
VALUES ($1, $2)
RETURNING vs_kriteria_id
`;

module.exports = {
    getKriteria,
    getKriteriaById,
    addKriteria
};

