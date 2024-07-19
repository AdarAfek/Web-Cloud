const { Router } = require("express");
const { addPreference,updatePreference,getPreferences } = require("../controllers/preferenceController"); // Corrected import
const preferenceRouter = Router(); // Use Router() directly

preferenceRouter.get("/",getPreferences);
preferenceRouter.post("/",addPreference);
preferenceRouter.put("/:preferenceId",updatePreference);
module.exports = {preferenceRouter};
