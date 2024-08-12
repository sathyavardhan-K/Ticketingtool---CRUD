const express = require('express');
const router = express.Router();

const teamsController = require('../../controllers/teamsController');


// all http methods in one router

router.route('/')
    .get(teamsController.getAllTeams)

    .post(teamsController.createNewTeam)
  

router.route('/:id')
    .get(teamsController.getTeam)

    .put(teamsController.updateTeam)

    .delete(teamsController.deleteTeam)

module.exports = router;

