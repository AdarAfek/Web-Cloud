const { Router } = require("express");
const { addPreference,updatePreference } = require("../controllers/preferenceController"); // Corrected import
const preferenceRouter = Router(); // Use Router() directly

preferenceRouter.post("/",addPreference);
preferenceRouter.put("/:preferenceId",updatePreference);
module.exports = {preferenceRouter};
