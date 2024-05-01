const { Router } = require('express');
const controller = require(`./controller`);
const router = Router();

router.get("/",controller.getDetail_Vs);
router.get("/:id",controller.getDetail_VsById);
router.post("/",controller.addDetail_Vs);
router.delete("/:id",controller.removeDetail_Vs);
router.put("/:id",controller.updateDetail_Vs); 

module.exports =router;