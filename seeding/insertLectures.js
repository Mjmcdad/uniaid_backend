const Lecture = require('../Models/lecture');
const Room = require('../Models/room');
const Subject = require('../Models/subject');

// Helper functions to generate random values
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDay() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return days[getRandomNumber(0, days.length - 1)];
}

function getRandomTime(existingTimesForDayAndRoom) {
    let startTime, endTime;

    // Generate random times until there's no conflict
    do {
        const hours = getRandomNumber(8, 16); // Random hour between 8 AM and 4 PM
        const minutes = getRandomNumber(0, 3) * 15; // Random minute in 15-minute intervals (0, 15, 30, 45)
        startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        endTime = `${(hours + 1).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } while (existingTimesForDayAndRoom.includes(startTime));

    return { startTime, endTime };
}

async function insertLectures() {
    try {
        // Fetch all rooms and subjects from the database
        const rooms = await Room.findAll({ attributes: ['id', 'isPractical'] });
        const subjects = await Subject.findAll();

        if (rooms.length === 0 || subjects.length === 0) {
            throw new Error('No rooms or subjects found in the database. Please seed rooms and subjects first.');
        }

        const lectures = [];
        const schedule = {}; // To track scheduled times for each room and day

        for (const subject of subjects) {
            const numLectures = subject.hasPractical ? 2 : 1; // Practical subjects get 2 lectures

            for (let i = 0; i < numLectures; i++) {
                // Select a random day and room
                const day = getRandomDay();
                const availableRooms = subject.hasPractical
                    ? rooms.filter(room => room.isPractical) // Practical lectures need practical rooms
                    : rooms; // Theoretical lectures can use any room
                const room = availableRooms[getRandomNumber(0, availableRooms.length - 1)];

                // Initialize schedule tracking for the selected room and day
                if (!schedule[room.id]) {
                    schedule[room.id] = {};
                }
                if (!schedule[room.id][day]) {
                    schedule[room.id][day] = [];
                }

                // Get a valid start and end time
                const { startTime, endTime } = getRandomTime(schedule[room.id][day]);

                // Add the lecture to the schedule
                schedule[room.id][day].push(startTime);

                // Create the lecture object
                const lecture = {
                    subjectId: subject.id,
                    roomId: room.id,
                    start_time: startTime,
                    end_time: endTime,
                    day: day,
                    teacherId: getRandomNumber(1, 8),
                    groups: getRandomGroups()
                };

                lectures.push(lecture);
            }
        }

        // Bulk insert all lectures into the database
        await Lecture.bulkCreate(lectures);

        console.log(`${lectures.length} lectures successfully inserted into the database.`);
    } catch (error) {
        console.error('Error seeding lectures:', error);
    }
}

const getRandomGroups = () => {
    const groups = []
    groups.push(getRandomNumber(1, 3))
    return groups;
}

module.exports = {
    insertLectures
};