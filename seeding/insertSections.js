const Subject = require('../Models/subject');
const TSection = require('../Models/tSection');
const PSection = require('../Models/pSection');
const Teacher = require('../Models/teacher');
const TTeacher = require('../Models/tTeacher');
const PTeacher = require('../Models/pTeacher');

async function insertRandomSectionsAndTeachers() {
    try {
        // Step 1: Retrieve all subjects and teachers from the database
        const subjects = await Subject.findAll();
        const teachers = await Teacher.findAll();

        if (subjects.length === 0) {
            console.error('No subjects found in the database. Please insert subjects first.');
            return;
        }

        if (teachers.length === 0) {
            console.error('No teachers found in the database. Please insert teachers first.');
            return;
        }

        // Step 2: Insert one TSection and one PSection (if applicable) for each subject
        for (const subject of subjects) {
            // Create one theoretical section for the subject
            const tSection = await TSection.create({
                subjectId: subject.id,
                t_hours: getRandomHours(),
                time: getRandomTime(), // Random time in HH:mm:ss format
            });

            // Assign one random teacher to the theoretical section
            const randomTeacherForT = teachers[Math.floor(Math.random() * teachers.length)];
            await TTeacher.create({
                teacherId: randomTeacherForT.id,
                tSectionId: tSection.id,
            });

            // If the subject has practical sessions, create one practical section
            if (subject.hasPractical) {
                const pSection = await PSection.create({
                    subjectId: subject.id,
                    p_hours: getRandomHours(),
                    time: getRandomTime(), // Random time in HH:mm:ss format
                });

                // Assign one random teacher to the practical section
                const randomTeacherForP = teachers[Math.floor(Math.random() * teachers.length)];
                await PTeacher.create({
                    teacherId: randomTeacherForP.id,
                    pSectionId: pSection.id,
                });
            } else {
                console.log(`Subject ${subject.name} does not have practical sessions. Skipping PSection creation.`);
            }
        }

        console.log('Random sections and teachers successfully inserted into the database.');
    } catch (error) {
        console.error('Error inserting random sections and teachers:', error);
    }
}

module.exports = {
    insertRandomSectionsAndTeachers,
};

// Helper Function: Generate Random Hours
function getRandomHours() {
    return Math.floor(Math.random() * 3) + 1; // Random value between 1 and 3
}

// Helper Function: Generate Random Time (Only Time, No Date)
function getRandomTime() {
    const hours = String(Math.floor(Math.random() * 24)).padStart(2, '0'); // Random hour (0-23)
    const minutes = String(Math.floor(Math.random() * 60)).padStart(2, '0'); // Random minute (0-59)
    const seconds = String(Math.floor(Math.random() * 60)).padStart(2, '0'); // Random second (0-59)
    return `${hours}:${minutes}:${seconds}`; // Format: HH:mm:ss
}