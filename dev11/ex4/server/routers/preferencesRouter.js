const { Router } = require("express");
const { addPreferences } = require("../controllers/preferenceController"); // Corrected import
const preferenceRouter = Router(); // Use Router() directly

preferenceRouter.post("/",addPreferences);
module.exports = {preferenceRouter};
