const fs = require('fs');
const csv = require('csv-parser');
const User = require('../Models/user')
const Teacher = require('../Models/teacher')
const bcrypt = require("bcrypt-nodejs");


// Function to map CSV row to the User model fields
function mapRowToUser(row) {
    return {
        firstName: row.FirstName,
        lastName: row.LastName,
        email: row.Email,
        password: bcrypt.hashSync(row.password),
        phoneNumber: row.phoneNumber,
        role: "teacher" // All rows in this CSV are teachers
    };
}

// Function to import CSV data into the database
async function importTeachers(filePath) {
    try {
        const rows = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                rows.push(mapRowToUser(row)); // Map each row to the User model format
            })
            .on('end', async () => {

                // Insert all users into the database
                for (const userData of rows) {
                    try {
                        // Create a new user in the User table
                        const user = await User.create(userData);

                        // Create a corresponding entry in the Teacher table
                        await Teacher.create({ userId: user.id });

                    } catch (error) {
                        console.error(`Error inserting teacher ${userData.firstName} ${userData.lastName}:`, error.message);
                    }
                }
                console.log('Data successfully imported into the database.');
            });
    } catch (error) {
        console.error('Error importing data:', error);
    }
}



module.exports = {
    importTeachers
}