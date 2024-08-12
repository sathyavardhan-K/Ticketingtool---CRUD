const express = require('express');
const router = express.Router();

const ticketsController = require('../../controllers/ticketsController');


// all http methods in one router

router.route('/')
    .get(ticketsController.getAllTickets)

    .post(ticketsController.createNewTicket)
  

router.route('/:id')
    .get(ticketsController.getTicket)

    .put(ticketsController.updateTicket)

    .delete(ticketsController.deleteTicket)

module.exports = router;

