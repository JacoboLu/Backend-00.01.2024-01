const { Router } = require("express");
const userServices = require("../services/index");

const routes = Router();

routes.get("/", userServices.findAll);
routes.post("/", userServices.createUser);

routes.delete("/:id", userServices.deleteUser);

routes.put("/", userServices.updateUser);

module.exports = routes;