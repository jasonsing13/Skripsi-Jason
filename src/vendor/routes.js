const { Router } = require('express');
const controller = require(`./controller`);
const router = Router();

router.get("/",controller.getVendor);
router.get("/:id",controller.getVendorById);
router.post("/",controller.addVendor);
router.delete("/:id",controller.removeVendor);
router.put("/:id",controller.updateVendor); 

module.exports =router;