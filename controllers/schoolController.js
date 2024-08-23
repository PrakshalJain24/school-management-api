const School = require('../models/schoolModel');

const schoolMaster = {
    addSchool(req, res) {
        const { name, address, latitude, longitude } = req.body;

        if (!name || !address || !latitude || !longitude) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        School.addSchool({ name, address, latitude, longitude }, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to add school.' });
            }
            res.status(201).json({ message: 'School added successfully.', schoolId: results.insertId });
        });
    },

    listSchools(req, res) {
        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: 'Latitude and longitude are required.' });
        }

        School.getAllSchools((err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to retrieve schools.' });
            }

            const userLocation = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
            const sortedSchools = results.map(school => ({
                ...school,
                distance: getDistance(userLocation, school)
            })).sort((a, b) => a.distance - b.distance);

            res.status(200).json(sortedSchools);
        });
    }
};

function getDistance(coord1, coord2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(coord2.latitude - coord1.latitude);
    const dLon = deg2rad(coord2.longitude - coord1.longitude);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(deg2rad(coord1.latitude)) * Math.cos(deg2rad(coord2.latitude)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

module.exports = schoolMaster;
