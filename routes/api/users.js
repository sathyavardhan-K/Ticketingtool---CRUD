const express = require('express');
const router = express.Router();

const usersController = require('../../controllers/usersController');


// all http methods in one router

router.route('/')
    .get(usersController.getAllUsers)

    .post(usersController.createNewUser)
  

router.route('/:id')
    .get(usersController.getUser)

    .put(usersController.updateUser)

    .delete(usersController.deleteUser)

module.exports = router;
