const express = require("express");
const router = express.Router();
const {
  getAllMachines,
  createMachine,
  updateMachine,
  deleteMachine,
} = require("../controllers/machineController");

router.get("/", getAllMachines);
router.post("/", createMachine);
router.put("/:id", updateMachine);
router.delete("/:id", deleteMachine);

module.exports = router;
