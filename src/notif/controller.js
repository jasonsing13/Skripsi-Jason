const db = require('../../database/db');
const queries = require('../notif/queries');

async function getNotif(account_id) {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getNotif, [account_id]);
        return result.rows; // Asumsi Anda hanya mengambil satu baris data
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    getNotif,
    
};

