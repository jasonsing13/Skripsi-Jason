const { Router } = require('express');
const controller = require(`./controller`);
const router = Router();

router.get("/",controller.getUser);
router.get("/:id",controller.getUserById);
router.post("/",controller.addUser);
router.delete("/:id",controller.removeUser);
router.put("/:id",controller.updateUser); 

// router.get("/",controller.getRole);
// router.get("/:id",controller.getRoleById);

// router.get("/",controller.getVendor);
// router.get("/:id",controller.getVendorById);
// router.post("/",controller.addVendor);
// router.delete("/:id",controller.removeVendor);
// router.put("/:id",controller.updateVendor); 

// router.get("/",controller.getPengadaan);
// router.get("/:id",controller.getPengadaanById);
// router.post("/",controller.addPengadaan);
// router.delete("/:id",controller.removePengadaan);
// router.put("/:id",controller.updatePengadaan); 

module.exports =router;