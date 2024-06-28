const db = require('../../database/db');
const queries = require('../notif/queries');
const queriesU = require('../user/queries');
const queriesV = require('../vendor/queries');

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

async function getNotifAll(account_id) {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getNotifAll, [account_id]);
        return result.rows; // Asumsi Anda hanya mengambil satu baris data
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

// TRUE OR FALSE AMBIL SEMUA ADMIN OR VENDOR
// SELAIN ITU HANYA KIRIM SATU KE ACCOUNT ID TERTENTU
async function addNotif( accountOrAdmin, isi ) {
    const client = await db.pool.connect();
    try {
        const notif_id_r = await client.query(queries.addNotif, [isi]);
        const notif_id = notif_id_r.rows[0].notif_id;

        if (typeof accountOrAdmin === 'boolean') {
            var arr_acc = [];
            if(accountOrAdmin){
                arr_acc = await client.query(queriesU.getUser);
            }else{
                arr_acc = await client.query(queriesV.getVendor);
            }
            const acc = arr_acc.rows 
            acc.forEach(async e => {
                await client.query(queries.addNotifList, [notif_id, e.id]);
            });
        }else{
            await client.query(queries.addNotifList, [notif_id, accountOrAdmin]);
        }
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    getNotif,
    addNotif,
    getNotifAll
};

