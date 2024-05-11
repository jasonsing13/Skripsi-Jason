const { Router } = require('express');
const controller = require(`./controller`);
const router = Router();

router.get("/",controller.getJenis_Vendor);
router.get("/:id",controller.getJenis_VendorById);

module.exports =router;