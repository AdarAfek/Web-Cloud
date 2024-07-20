const { Router } = require("express");
const {
  addPreference,
  updatePreference,
  getPreferences,
  chosenVacation,
} = require("../controllers/preferenceController"); // Corrected import
const preferenceRouter = Router();

preferenceRouter.get("/", getPreferences);
preferenceRouter.get("/choose", chosenVacation);
preferenceRouter.post("/", addPreference);
preferenceRouter.put("/:preferenceId", updatePreference);
module.exports = { preferenceRouter };
