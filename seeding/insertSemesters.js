const Semester = require("../Models/semester");

// e
function getRandomDate(startYear, endYear) {
    const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
    const month = Math.floor(Math.random() * 12) + 1; // Random month (1-12)
    const day = Math.floor(Math.random() * 28) + 1; // Random day (1-28 to avoid month edge cases)
    return new Date(year, month - 1, day); // JavaScript months are 0-indexed
}

// Function to insert random semesters
async function insertRandomSemesters() {
    try {
        const startYear = 2020;
        const endYear = 2025;
        const terms = ['Winter', 'Summer', 'Fall']; // Possible terms

        for (let year = startYear; year <= endYear; year++) {
            for (const term of terms) {
                // Generate random start and end dates for the semester
                const startDate = getRandomDate(year, year);
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 90) + 30); // End date is 30-120 days after start date

                // Create the semester entry
                await Semester.create({
                    year: year,
                    term: term,
                    startDate: startDate,
                    endDate: endDate
                });

            }
        }

        console.log('Random semesters successfully inserted into the database.');
    } catch (error) {
        console.error('Error inserting random semesters:', error);
    }
}

module.exports = {
    insertRandomSemesters
}