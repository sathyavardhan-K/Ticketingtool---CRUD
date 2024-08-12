const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'model', 'operations.json');

const readData = () => {
    return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
};

const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};

const getAllTeams = (req, res) => {
    const data = readData();
    res.json(data.teams);
};

const createNewTeam = (req, res) => {
    const { teamname, members } = req.body;

    // Trim whitespace
    const trimmedTeamname = (teamname || '').trim();

    // Check if any required field is missing or empty
    if (!trimmedTeamname || !members || !Array.isArray(members) || members.length === 0) {
        return res.status(400).json({
            error: true,
            message: "All fields are required and members must be a non-empty array of strings",
            missingFields: {
                teamname: !trimmedTeamname ? "Team name is required" : undefined,
                members: !members || !Array.isArray(members) || members.length === 0 ? "Members are required and must be a non-empty array" : undefined
            }
        });
    }

    // Validate that all members are strings
    const invalidMembers = members.filter(member => typeof member !== 'string' || !member.trim());
    if (invalidMembers.length > 0) {
        return res.status(400).json({
            error: true,
            message: "All members must be non-empty strings",
            invalidMembers
        });
    }

    // Check if the team name is unique
    const data = readData();
    const existingTeam = data.teams.find(team => team.teamname.toLowerCase() === trimmedTeamname.toLowerCase());
    if (existingTeam) {
        return res.status(400).json({
            error: true,
            message: "A team with this title already exists",
            duplicateTitle: trimmedTeamname
        });
    }

    // Create a new team object
    const newTeam = {
        id: data.teams.length > 0 ? data.teams[data.teams.length - 1].id + 1 : 1,
        teamname: trimmedTeamname,
        members: members.map(member => member.trim()) // Ensure all members are trimmed
    };

    data.teams.push(newTeam);
    writeData(data);

    return res.status(201).json({
        error: false,
        message: "Team created successfully",
        team: newTeam
    });
};

const updateTeam = (req, res) => {
    const data = readData();
    const team = data.teams.find(tm => tm.id === parseInt(req.params.id));
    
    if (!team) {
        return res.status(404).json({
            error: true,
            message: `Team with ID ${req.params.id} not found`
        });
    }

    const { teamname, members } = req.body;

    // Trim whitespace
    const trimmedTeamname = (teamname || '').trim();

    // Validate non-empty fields
    if (teamname && !trimmedTeamname) {
        return res.status(400).json({
            error: true,
            message: "Team name cannot be empty"
        });
    }

    // Validate members is a non-empty array of strings
    if (members && (!Array.isArray(members) || members.length === 0)) {
        return res.status(400).json({
            error: true,
            message: "Members must be a non-empty array of strings"
        });
    }

    // Validate each member in the array is a non-empty string
    const invalidMembers = members ? members.filter(member => typeof member !== 'string' || !member.trim()) : [];
    if (invalidMembers.length > 0) {
        return res.status(400).json({
            error: true,
            message: "All members must be non-empty strings",
            invalidMembers
        });
    }

    // Update team fields
    if (teamname) team.teamname = trimmedTeamname;
    if (members) team.members = members.map(member => member.trim());

    // Update teams array and sort
    const filteredArray = data.teams.filter(t => t.id !== parseInt(req.params.id));
    data.teams = [...filteredArray, team].sort((a, b) => a.id - b.id);
    writeData(data);

    return res.json({
        error: false,
        message: "Team updated successfully",
        team: team
    });
};

const deleteTeam = (req, res) => {
    const data = readData();
    const team = data.teams.find(tm => tm.id === parseInt(req.params.id));

    if (!team) {
        return res.status(404).json({
            error: true,
            message: `Team with ID ${req.params.id} not found`
        });
    }

    data.teams = data.teams.filter(tm => tm.id !== parseInt(req.params.id));
    writeData(data);

    return res.json({
        error: false,
        message: `Team with ID ${req.params.id} deleted successfully`
    });
};

const getTeam = (req, res) => {
    const data = readData();
    const team = data.teams.find(tm => tm.id === parseInt(req.params.id));

    if (!team) {
        return res.status(404).json({
            error: true,
            message: `Team with ID ${req.params.id} not found`
        });
    }

    return res.json(team);
};

module.exports = {
    getAllTeams,
    createNewTeam,
    getTeam,
    updateTeam,
    deleteTeam
};
