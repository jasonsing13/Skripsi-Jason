const { Router } = require('express');
const controller = require(`./controller`);
const router = Router();

router.get("/",controller.getKriteria);
router.get("/:id",controller.getKriteriaById);

module.exports =router;