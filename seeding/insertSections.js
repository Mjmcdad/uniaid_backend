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

        // Step 2: Insert random TSections and PSections for each subject
        for (const subject of subjects) {
            // Create a theoretical section for every subject
            const tSection = await TSection.create({
                subjectId: subject.id,
                t_hours: getRandomHours(),
                time: getRandomTime()
            });

            // Assign a random teacher to the theoretical section
            const randomTeacherForT = teachers[Math.floor(Math.random() * teachers.length)];
            await TTeacher.create({
                teacherId: randomTeacherForT.id,
                tSectionId: tSection.id
            });

            // If the subject has practical, create a practical section
            if (subject.hasPractical) {
                const pSection = await PSection.create({
                    subjectId: subject.id,
                    p_hours: getRandomHours(),
                    time: getRandomTime()
                });

                // Assign a random teacher to the practical section
                const randomTeacherForP = teachers[Math.floor(Math.random() * teachers.length)];
                await PTeacher.create({
                    teacherId: randomTeacherForP.id,
                    pSectionId: pSection.id
                });
            }
        }

        console.log('Random sections and teachers successfully inserted into the database.');
    } catch (error) {
        console.error('Error inserting random sections and teachers:', error);
    }
}

module.exports = {
    insertRandomSectionsAndTeachers
};


function getRandomHours() {
    return Math.floor(Math.random() * 3) + 1; // Random value between 1 and 3
}

function getRandomTime() {
    const start = new Date();
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
    return new Date(start.getTime() + Math.random() * (end - start));
}