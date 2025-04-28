const fs = require('fs');
const csv = require('csv-parser');
const Subject = require('../Models/subject'); // Adjust the path to your Subject model

// Function to map CSV row to the Subject model fields
function mapRowToSubject(row) {
    const academicYear = parseInt(row.academicYear, 10); // Convert to integer
    if (isNaN(academicYear)) {
        console.warn(`Invalid academicYear for subject: ${row.name}. Setting to default value (0).`);
    }

    return {
        id: parseInt(row.id, 10), // Include the ID from the CSV file
        name: row.name.trim(), // Trim whitespace
        description: row.description.trim(), // Trim whitespace
        prerequisitesId: row.prerequisites === '' || row.prerequisites === 'لا يوجد' ? null : parseInt(row.prerequisites, 10), // Map prerequisites to prerequisitesId
        subjectType: row.subjectType.trim(), // Trim whitespace
        hours: parseInt(row.hours, 10) || null, // Convert to integer, handle empty values
        academicYear: isNaN(academicYear) ? 0 : academicYear, // Use default value if invalid
        hasPractical: row.hasPractical.trim() === 'نعم' ? true : false // Convert Arabic "نعم" to boolean
    };
}

// Function to import CSV data into the database
async function importSubjects(filePath) {
    try {
        const rows = [];
        const invalidRows = [];

        // Read and parse the CSV file
        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    try {
                        const mappedRow = mapRowToSubject(row);

                        // Validate required fields
                        if (
                            !mappedRow.id ||
                            !mappedRow.name ||
                            !mappedRow.description ||
                            isNaN(mappedRow.hours) ||
                            isNaN(mappedRow.academicYear)
                        ) {
                            console.warn(`Skipping invalid row: ${JSON.stringify(row)}`);
                            invalidRows.push(row);
                        } else {
                            rows.push(mappedRow); // Map each row to the Subject model format
                        }
                    } catch (error) {
                        console.error(`Error mapping row: ${JSON.stringify(row)}. Error: ${error.message}`);
                        invalidRows.push(row);
                    }
                })
                .on('end', () => {
                    console.log(`Parsed ${rows.length} valid rows and skipped ${invalidRows.length} invalid rows from the CSV file.`);
                    resolve();
                })
                .on('error', (error) => {
                    reject(error);
                });
        });

        // Step 1: Validate prerequisites
        const ids = new Set(rows.map(row => row.id)); // All valid IDs in the dataset
        rows.forEach(row => {
            if (row.prerequisitesId && !ids.has(row.prerequisitesId)) {
                console.error(`Invalid prerequisitesId (${row.prerequisitesId}) for subject: ${row.name}. Skipping row.`);
                invalidRows.push(row);
            }
        });

        // Remove invalid rows
        const validRows = rows.filter(row => !invalidRows.includes(row));

        // Step 2: Sort rows by dependency
        validRows.sort((a, b) => {
            if (a.prerequisitesId === null && b.prerequisitesId !== null) return -1; // Rows with no prerequisites come first
            if (a.prerequisitesId !== null && b.prerequisitesId === null) return 1;
            return a.id - b.id; // Otherwise, sort by ID
        });

        // Insert all valid rows into the database
        await Subject.bulkCreate(validRows, { validate: true }); // Enable validation during bulk create
        console.log('Data successfully imported into the database.');
    } catch (error) {
        console.error('Error importing data:', error);
    }
}

module.exports = {
    importSubjects
};