const fs = require('fs');
const csv = require('csv-parser');
const Subject = require('../Models/subject'); // Adjust the path to your Subject model

// Function to map CSV row to the Subject model fields
function mapRowToSubject(row) {
    return {
        name: row.name,
        description: row.description,
        prerequisites: row.prerequisites === 'لا يوجد' ? null : row.prerequisites, // Replace "لا يوجد" with null
        requiredFor: row.requiredFor === 'لا يوجد' ? null : row.requiredFor,       // Replace "لا يوجد" with null
        subjectType: row.subjectType,
        hours: parseInt(row.hours, 10) || null, // Convert to integer, handle empty values
        academicYear: row.academicYear,
        hasPractical: row.hasPractical === 'نعم' ? true : false // Convert Arabic "نعم" to boolean
    };
}

// Function to import CSV data into the database
async function importSubjects(filePath) {
    try {
        const rows = [];
        // Read and parse the CSV file
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                rows.push(mapRowToSubject(row)); // Map each row to the Subject model format
            })
            .on('end', async () => {
                console.log(`Parsed ${rows.length} rows from the CSV file.`);

                // Insert all rows into the database
                await Subject.bulkCreate(rows);
                console.log('Data successfully imported into the database.');
            });
    } catch (error) {
        console.error('Error importing data:', error);
    }
}


module.exports = {
    importSubjects
}