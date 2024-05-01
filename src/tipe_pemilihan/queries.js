const getTipe_Pemilihan = `select * from public.tipe_pemilihan `;
const getTipe_PemilihanById = `select * from public.tipe_pemilihan where user_id = $1`;


module.exports = {
    getTipe_Pemilihan,
    getTipe_PemilihanById,
};

