const Semester = require('../Models/semester');
const SubjectOffer = require('../Models/subjectOffers');
const Subject = require('../Models/subject');

// Function to insert subject offers using bulkCreate
async function insertSubjectOffers() {
    try {
        // Step 1: Retrieve all subjects from the database
        const subjects = await Subject.findAll();
        if (subjects.length === 0) {
            console.error('No subjects found in the database. Please insert subjects first.');
            return;
        }

        // Step 2: Retrieve all semesters from the database
        const semesters = await Semester.findAll();
        if (semesters.length === 0) {
            console.error('No semesters found in the database. Please insert semesters first.');
            return;
        }

        // Step 3: Prepare an array for bulk creation
        const subjectOffers = [];

        // Step 4: Generate subject offers
        for (const dbSubject of subjects) {
            // Randomly assign the subject to some semesters
            const numberOfSemesters = Math.floor(Math.random() * semesters.length) + 1; // Assign to 1+ semesters
            const selectedSemesters = semesters.sort(() => 0.5 - Math.random()).slice(0, numberOfSemesters);

            for (const semester of selectedSemesters) {
                subjectOffers.push({
                    subjectId: dbSubject.id,
                    semesterId: semester.id,
                    isAvailable: Math.random() < 0.8, // 80% chance of being available
                });
            }
        }

        // Step 5: Perform bulk insert
        await SubjectOffer.bulkCreate(subjectOffers);

        console.log(`${subjectOffers.length} subject offers successfully inserted into the database.`);
    } catch (error) {
        console.error('Error inserting subject offers:', error);
    }
}

module.exports = {
    insertSubjectOffers
};