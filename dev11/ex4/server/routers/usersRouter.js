const { Router } = require("express");
const { registerNewUser,loginUser } = require("../controllers/userController"); // Corrected import
const userRouter = Router(); // Use Router() directly

userRouter.post("/register", registerNewUser);
userRouter.post("/login",loginUser);
module.exports = {userRouter};
