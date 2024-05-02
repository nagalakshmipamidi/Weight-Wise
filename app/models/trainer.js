// Get the functions in the db.js file to use
const db = require('../services/db');
const bcrypt = require("bcryptjs");

class Trainer {

    // Id of the trainer
    id;

    // Email of the trainer
    email;

    constructor(email) {
        this.email = email;
    }

    // Get an existing trainer id from an email address, or return false if not found
    // Checks to see if the submitted email address exists in the Trainers table
    async getIdFromEmail() {
        var sql = "SELECT id FROM Trainers WHERE Trainers.email = ?";
        const result = await db.query(sql, [this.email]);
        // TODO LOTS OF ERROR CHECKS HERE..
        if (JSON.stringify(result) != '[]') {
            this.id = result[0].id;
            return this.id;
        }
        else {
            return false;
        }
    }

    // Add a password to an existing trainer
    async setUserPassword(password) {
        const pw = await bcrypt.hash(password, 10);
        var sql = "UPDATE Trainers SET password = ? WHERE Trainers.id = ?"
        const result = await db.query(sql, [pw, this.id]);
        return true;
    }

    // Add a new record to the users table
    async addUser(password) {
        const pw = await bcrypt.hash(password, 10);
        var sql = "INSERT INTO Trainers (email, password) VALUES (? , ?)";
        const result = await db.query(sql, [this.email, pw]);
        console.log(result.insertId);
        this.id = result.insertId;
        return true;
    }

    // Test a submitted password against a stored password
    // Test a submitted password against a stored password
    async authenticate(submitted) {
        // Get the stored, hashed password for the trainer
        var sql = "SELECT password FROM Trainers WHERE id = ?";
        const result = await db.query(sql, [this.id]);
        const match = await bcrypt.compare(submitted, result[0].password);
        if (match == true) {
            return true;
        }
        else {
            return false;
        }
    }


}

module.exports = {
    Trainer
}