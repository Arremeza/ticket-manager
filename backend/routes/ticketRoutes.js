const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket.js');


//Get all tickets
router.get('/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
});

//Get ticket by id
router.get('/tickets/:id', getTicket, (req, res) => {
    res.json(res.ticket);
})


//New Ticket

router.post('/tickets', async (req, res) => {
    const ticket = new Ticket({
        title: req.body.title,
        description: req.body.description,
        status: 'Open',
        priority: req.body.priority || 'Low',
        createdBy: req.body.createdBy,
    });

    try {
        const newTicket = await ticket.save();
        res.status(201).json(newTicket);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});


//Update ticket by Id
router.patch('/tickets/:id', getTicket, async(req, res) => {
    if(req.body.title != null) {
        res.ticket.title = req.ticket.title;
    }
    if(req.body.description != null) {
        res.ticket.description = req.ticket.title;
    }
    if(req.body.status != null) {
        res.ticket.status = req.ticket.status
    }
    if(req.body.priority != null) {
        res.ticket.priority = req.ticket.priority
    }

    try {
        const updatedTicket = await res.ticket.save();
        res.json(updatedTicket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Delete ticket by Id
router.delete('/tickets/:id', getTicket, async (req, res) => {
    try {
        await res.ticket.deleteOne();
        res.json({ message: 'Ticket deleted'});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
 

async function getTicket(req, res, next) {
    let ticket;
    try {
        ticket = await Ticket.findById(req.params.id);
        if(!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.ticket = ticket;
    next();
}

module.exports = router;