const connection = require('../config/db');

const schoolModel = {
    addSchool(schoolData, callback) {
        const query = 'INSERT INTO schools SET ?';
        connection.query(query, schoolData, callback);
    },
    
    getAllSchools(callback) {
        const query = 'SELECT * FROM schools';
        connection.query(query, callback);
    }
};

module.exports = schoolModel;
