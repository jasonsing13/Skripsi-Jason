const { Router } = require('express');
const controller = require(`./controller`);
const router = Router();

router.get("/",controller.getTemplate_Vs);
router.get("/:id",controller.getTemplate_VsById);

module.exports =router;