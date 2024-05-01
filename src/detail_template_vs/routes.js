const { Router } = require('express');
const controller = require(`./controller`);
const router = Router();

router.get("/",controller.getDetail_Template_Vs);
router.get("/:id",controller.getDetail_Template_VsById);
router.post("/",controller.addDetail_Template_Vs);
router.delete("/:id",controller.removeDetail_Template_Vs);
router.put("/:id",controller.updateDetail_Template_Vs); 

module.exports =router;