const { Router } = require('express');
const controller = require(`./controller`);
const router = Router();

router.get("/",controller.getVendor_Score);
router.get("/:id",controller.getVendor_ScoreById);
router.post("/",controller.addVendor_Score);
router.delete("/:id",controller.removeVendor_Score);
router.put("/:id",controller.updateVendor_Score); 

module.exports =router;