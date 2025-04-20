const EnrollmentPrice = require('../Models/enrollmentPrice'); // Adjust the path to your models

// Function to insert enrollment prices for years 2017 to 2025
async function insertEnrollmentPrices() {
    try {
        const startYear = 2020;
        const endYear = 2025;

        // Generate and insert enrollment prices for each year
        for (let year = startYear; year <= endYear; year++) {
            // Generate a random price between 1000 and 5000 (you can adjust the range)
            const price = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;

            // Create the enrollment price entry
            await EnrollmentPrice.create({
                price: price,
                year: year
            });

            console.log(`Inserted enrollment price for year ${year}: $${price}`);
        }

        console.log('Enrollment prices successfully inserted into the database.');
    } catch (error) {
        console.error('Error inserting enrollment prices:', error);
    }
}


module.exports = {
    insertEnrollmentPrices
}