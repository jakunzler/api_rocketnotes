const uploadConfig = require('../configs/upload');
const multer = require('multer');
const upload = multer(uploadConfig.MULTER);

const { Router } = require('express');
const UsersController = require("../controllers/UsersController");
const UserAvatarController = require("../controllers/UserAvatarController");

const usersRoutes = new Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

const ensureAuthenticated = require("../middleware/ensureAuthenticated");

usersRoutes.post("/", usersController.create);     
usersRoutes.put("/", ensureAuthenticated, usersController.update);
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update);

module.exports = usersRoutes;