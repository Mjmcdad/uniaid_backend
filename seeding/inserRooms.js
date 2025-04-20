const Room = require('../Models/room');

// Helper functions to generate random values
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomBoolean() {
    return Math.random() < 0.5; // 50% chance of true or false
}

async function insertRooms() {
    try {
        const numberOfRooms = 20; // Number of rooms to insert
        const rooms = [];

        for (let i = 0; i < numberOfRooms; i++) {
            const room = {
                number: i + 1,
                floor: getRandomNumber(1, 4), // Random floor between 1 and 5
                capacity: getRandomNumber(20, 80), // Random capacity between 20 and 100
                isPractical: getRandomBoolean() // Random boolean for isPractical
            };

            rooms.push(room);
        }

        // Bulk insert all rooms into the database
        await Room.bulkCreate(rooms);

        console.log(`${numberOfRooms} rooms successfully inserted into the database.`);
    } catch (error) {
        console.error('Error seeding rooms:', error);
    }
}



module.exports = {
    insertRooms
};