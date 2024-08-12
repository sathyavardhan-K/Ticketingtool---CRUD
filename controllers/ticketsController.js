const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'model', 'operations.json');

const readData = () => {
    return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
};

const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};

const getAllTickets = (req, res) => {
    const data = readData();
    res.json(data.tickets);
};

const createNewTicket = (req, res) => {
    const { title, description, team, status, assignee, reporter } = req.body;

    // Trim whitespace
    const trimmedTitle = (title || '').trim();
    const trimmedDescription = (description || '').trim();
    const trimmedTeam = (team || '').trim();
    const trimmedStatus = (status || '').trim();
    const trimmedAssignee = (assignee || '').trim();
    const trimmedReporter = (reporter || '').trim();

    // Check if any required field is missing or empty
    if (!trimmedTitle || !trimmedDescription || !trimmedTeam || !trimmedStatus || !trimmedAssignee || !trimmedReporter) {
        return res.status(400).json({
            error: true,
            message: "All fields are required",
            missingFields: {
                title: !trimmedTitle ? "Title is required" : undefined,
                description: !trimmedDescription ? "Description is required" : undefined,
                team: !trimmedTeam ? "Team is required" : undefined,
                status: !trimmedStatus ? "Status is required" : undefined,
                assignee: !trimmedAssignee ? "Assignee is required" : undefined,
                reporter: !trimmedReporter ? "Reporter is required" : undefined,
            }
        });
    }

    // Optional: Add further validation for specific fields
    const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
    if (!validStatuses.includes(trimmedStatus.toLowerCase())) {
        return res.status(400).json({
            error: true,
            message: "Invalid status value",
            invalidStatus: trimmedStatus
        });
    }

    // Read current tickets and create a new ticket
    const data = readData();
    const newTicket = {
        id: data.tickets.length > 0 ? data.tickets[data.tickets.length - 1].id + 1 : 1,
        title: trimmedTitle,
        description: trimmedDescription,
        team: trimmedTeam,
        status: trimmedStatus,
        assignee: trimmedAssignee,
        reporter: trimmedReporter
    };

    data.tickets.push(newTicket);
    writeData(data);

    return res.status(201).json({
        error: false,
        message: "Ticket created successfully",
        ticket: newTicket
    });
};

const updateTicket = (req, res) => {
    const data = readData();
    const ticket = data.tickets.find(tic => tic.id === parseInt(req.params.id));

    if (!ticket) {
        return res.status(404).json({
            error: true,
            message: `Ticket with ID ${req.params.id} not found`
        });
    }

    const { title, description, team, status, assignee, reporter } = req.body;

    // Trim whitespace
    const trimmedTitle = (title || '').trim();
    const trimmedDescription = (description || '').trim();
    const trimmedTeam = (team || '').trim();
    const trimmedStatus = (status || '').trim();
    const trimmedAssignee = (assignee || '').trim();
    const trimmedReporter = (reporter || '').trim();

    // Validate non-empty fields
    if (title && !trimmedTitle) {
        return res.status(400).json({
            error: true,
            message: "Title cannot be empty"
        });
    }
    if (description && !trimmedDescription) {
        return res.status(400).json({
            error: true,
            message: "Description cannot be empty"
        });
    }
    if (team && !trimmedTeam) {
        return res.status(400).json({
            error: true,
            message: "Team cannot be empty"
        });
    }
    if (status && !trimmedStatus) {
        return res.status(400).json({
            error: true,
            message: "Status cannot be empty"
        });
    }
    if (assignee && !trimmedAssignee) {
        return res.status(400).json({
            error: true,
            message: "Assignee cannot be empty"
        });
    }
    if (reporter && !trimmedReporter) {
        return res.status(400).json({
            error: true,
            message: "Reporter cannot be empty"
        });
    }

    // Optional: Validate status against a list of valid values
    const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
    if (status && !validStatuses.includes(trimmedStatus.toLowerCase())) {
        return res.status(400).json({
            error: true,
            message: "Invalid status value",
            invalidStatus: trimmedStatus
        });
    }

    // Update ticket fields
    if (title) ticket.title = trimmedTitle;
    if (description) ticket.description = trimmedDescription;
    if (team) ticket.team = trimmedTeam;
    if (status) ticket.status = trimmedStatus;
    if (assignee) ticket.assignee = trimmedAssignee;
    if (reporter) ticket.reporter = trimmedReporter;

    // Update tickets array and sort
    const filteredArray = data.tickets.filter(tic => tic.id !== parseInt(req.params.id));
    const unsortedArray = [...filteredArray, ticket];
    data.tickets = unsortedArray.sort((a, b) => a.id - b.id);
    writeData(data);

    return res.json({
        error: false,
        message: "Ticket updated successfully",
        ticket: ticket
    });
};

const deleteTicket = (req, res) => {
    const data = readData();
    const ticket = data.tickets.find(tic => tic.id === parseInt(req.params.id));

    if (!ticket) {
        return res.status(404).json({
            error: true,
            message: `Ticket with ID ${req.params.id} not found`
        });
    }

    data.tickets = data.tickets.filter(tic => tic.id !== parseInt(req.params.id));
    writeData(data);

    return res.json({
        error: false,
        message: `Ticket with ID ${req.params.id} deleted successfully`
    });
};

const getTicket = (req, res) => {
    const data = readData();
    const ticket = data.tickets.find(tic => tic.id === parseInt(req.params.id));

    if (!ticket) {
        return res.status(404).json({
            error: true,
            message: `Ticket with ID ${req.params.id} not found`
        });
    }

    return res.json(ticket);
};

module.exports = {
    getAllTickets,
    createNewTicket,
    updateTicket,
    deleteTicket,
    getTicket
};
