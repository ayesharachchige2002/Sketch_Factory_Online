const Machine = require("../models/Machine");

// Get all machines
exports.getAllMachines = async (req, res) => {
  try {
    const machines = await Machine.find();
    res.status(200).json(machines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new machine
exports.createMachine = async (req, res) => {
  try {
    const newMachine = new Machine(req.body);
    await newMachine.save();
    res.status(201).json(newMachine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update machine status
exports.updateMachine = async (req, res) => {
  try {
    const updatedMachine = await Machine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedMachine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete machine
exports.deleteMachine = async (req, res) => {
  try {
    await Machine.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
