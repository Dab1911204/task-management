const express = require('express');
const routes = express.Router();
const controller = require('../controllers/task.controller');

routes.get('/', controller.index);
routes.get('/detail/:id', controller.detail);
routes.patch('/change-status/:id', controller.changeStatus);
routes.patch('/change-multi', controller.changeMulti);
routes.post('/create', controller.create);
routes.patch('/edit/:id', controller.edit);
routes.delete('/delete/:id', controller.delete);

module.exports = routes;