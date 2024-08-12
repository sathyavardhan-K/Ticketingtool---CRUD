const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'model', 'operations.json');

const readData = () => {
    return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
};

const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};

const getAllUsers = (req, res) => {
    const data = readData();
    res.json(data.users);
};

const createNewUser = (req, res) => {
    const data = readData();
    const { firstName, lastName, emailId, phoneNumber, employeeId, designation, teamId } = req.body;

    // Trim whitespace and perform validation
    const trimmedFirstName = (firstName || '').trim();
    const trimmedLastname = (lastName || '').trim();
    const trimmedEmailid = (emailId || '').trim();
    const trimmedPhno = (phoneNumber || '').trim();
    const trimmedEmpid = (employeeId || '').trim();
    const trimmedDesignation = (designation || '').trim();
    const trimmedTeamid = (teamId || '').trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!trimmedFirstName || !trimmedLastname || !trimmedEmailid || !trimmedPhno || !trimmedEmpid || !trimmedDesignation || !trimmedTeamid) {
        return res.status(400).json({
            error: true,
            message: "All fields are required",
            missingFields: {
                firstName: !trimmedFirstName ? "First name is required" : undefined,
                lastName: !trimmedLastname ? "Last name is required" : undefined,
                emailId: !trimmedEmailid ? "Email ID is required" : undefined,
                phoneNumber: !trimmedPhno ? "Phone number is required" : undefined,
                employeeId: !trimmedEmpid ? "Employee ID is required" : undefined,
                designation: !trimmedDesignation ? "Designation is required" : undefined,
                teamId: !trimmedTeamid ? "Team ID is required" : undefined,
            }
        });
    }

    if (!emailRegex.test(trimmedEmailid)) {
        return res.status(400).json({
            error: true,
            message: "Invalid email format",
            invalidEmail: trimmedEmailid
        });
    }

    if (!phoneRegex.test(trimmedPhno)) {
        return res.status(400).json({
            error: true,
            message: "Invalid phone number format",
            invalidPhoneNumber: trimmedPhno
        });
    }

    const existingEmail = data.users.find(user => user.emailId.toLowerCase() === trimmedEmailid.toLowerCase());
    const existingPhno = data.users.find(user => user.phoneNumber.toLowerCase() === trimmedPhno.toLowerCase());
    const existingEmpid = data.users.find(user => user.employeeId.toLowerCase() === trimmedEmpid.toLowerCase());

    if (existingPhno || existingEmail || existingEmpid) {
        return res.status(400).json({
            error: true,
            message: "A user with this emailid, phno, empid already exists",
            duplicateEmail: existingEmail ? trimmedEmailid : undefined,
            duplicatePhno: existingPhno ? trimmedPhno : undefined,
            duplicateEmpid: existingEmpid ? trimmedEmpid : undefined
        });
    }

    const newUser = {
        id: data.users.length > 0 ? data.users[data.users.length - 1].id + 1 : 1,
        firstName: trimmedFirstName,
        lastName: trimmedLastname,
        emailId: trimmedEmailid,
        phoneNumber: trimmedPhno,
        employeeId: trimmedEmpid,
        designation: trimmedDesignation,
        teamId: trimmedTeamid
    };

    data.users.push(newUser);
    writeData(data);

    return res.status(201).json({
        error: false,
        message: "User created successfully",
        user: newUser
    });
};

const updateUser = (req, res) => {
    const data = readData();
    const user = data.users.find(usr => usr.id === parseInt(req.params.id));

    if (!user) {
        return res.status(404).json({
            error: true,
            message: `User with ID ${req.params.id} not found`
        });
    }

    const { firstName, lastName, emailId, phoneNumber, employeeId, designation, teamId } = req.body;

    const trimmedFirstName = (firstName || '').trim();
    const trimmedLastname = (lastName || '').trim();
    const trimmedEmailid = (emailId || '').trim();
    const trimmedPhno = (phoneNumber || '').trim();
    const trimmedEmpid = (employeeId || '').trim();
    const trimmedDesignation = (designation || '').trim();
    const trimmedTeamid = (teamId || '').trim();

    if (firstName && !trimmedFirstName) {
        return res.status(400).json({
            error: true,
            message: "First name cannot be empty"
        });
    }
    if (lastName && !trimmedLastname) {
        return res.status(400).json({
            error: true,
            message: "Last name cannot be empty"
        });
    }
    if (emailId && !trimmedEmailid) {
        return res.status(400).json({
            error: true,
            message: "Email ID cannot be empty"
        });
    }
    if (phoneNumber && !trimmedPhno) {
        return res.status(400).json({
            error: true,
            message: "Phone number cannot be empty"
        });
    }
    if (employeeId && !trimmedEmpid) {
        return res.status(400).json({
            error: true,
            message: "Employee ID cannot be empty"
        });
    }
    if (designation && !trimmedDesignation) {
        return res.status(400).json({
            error: true,
            message: "Designation cannot be empty"
        });
    }
    if (teamId && !trimmedTeamid) {
        return res.status(400).json({
            error: true,
            message: "Team ID cannot be empty"
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (emailId && !emailRegex.test(trimmedEmailid)) {
        return res.status(400).json({
            error: true,
            message: "Invalid email format",
            invalidEmail: trimmedEmailid
        });
    }

    if (phoneNumber && !phoneRegex.test(trimmedPhno)) {
        return res.status(400).json({
            error: true,
            message: "Invalid phone number format",
            invalidPhoneNumber: trimmedPhno
        });
    }

    if (firstName) user.firstName = trimmedFirstName;
    if (lastName) user.lastName = trimmedLastname;
    if (emailId) user.emailId = trimmedEmailid;
    if (phoneNumber) user.phoneNumber = trimmedPhno;
    if (employeeId) user.employeeId = trimmedEmpid;
    if (designation) user.designation = trimmedDesignation;
    if (teamId) user.teamId = trimmedTeamid;

    const filteredArray = data.users.filter(usr => usr.id !== parseInt(req.params.id));
    data.users = [...filteredArray, user].sort((a, b) => a.id - b.id);

    writeData(data);

    return res.json({
        error: false,
        message: "User updated successfully",
        user: user
    });
};

const deleteUser = (req, res) => {
    const data = readData();
    const user = data.users.find(usr => usr.id === parseInt(req.params.id));

    if (!user) {
        return res.status(404).json({
            error: true,
            message: `User with ID ${req.params.id} not found`
        });
    }

    data.users = data.users.filter(usr => usr.id !== parseInt(req.params.id));
    writeData(data);

    return res.json({
        error: false,
        message: `User with ID ${req.params.id} deleted successfully`
    });
};

const getUser = (req, res) => {
    const data = readData();
    const user = data.users.find(usr => usr.id === parseInt(req.params.id));

    if (!user) {
        return res.status(404).json({
            error: true,
            message: `User with ID ${req.params.id} not found`
        });
    }

    return res.json(user);
};

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getUser
};
