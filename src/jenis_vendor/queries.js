const getJenis_Vendor = `SELECT jenis_vendor_id, jenis_vendor, vendor_id
FROM public.jenis_vendor`;
const getJenis_VendorById = `select * from jenis_vendor where jenis_vendor_id = $1`;


module.exports = {
    getJenis_Vendor,
    getJenis_VendorById,
};

