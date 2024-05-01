const { Router } = require('express');
const controller = require(`./controller`);
const router = Router();

router.get("/",controller.getItem);
router.get("/:id",controller.getItemById);
router.post("/",controller.addItem);
router.delete("/:id",controller.removeItem);
router.put("/:id",controller.updateItem); 

module.exports =router;