const { Router } = require('express');
const controller = require(`./controller`);
const router = Router();

router.get("/",controller.getItem_Gr);
router.get("/:id",controller.getItem_GrById);
router.post("/",controller.addItem_Gr);
router.delete("/:id",controller.removeItem_Gr);
router.put("/:id",controller.updateItem_Gr); 

module.exports =router;