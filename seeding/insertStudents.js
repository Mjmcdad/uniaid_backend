const { DataTypes } = require("sequelize");
const sequelize = require("../config/dataBase");
const User = require("../Models/user");
const Student = require("../Models/student");
const EnrollmentPrice = require("../Models/enrollmentPrice"); // Import the EnrollmentPrice model
const bcrypt = require("bcrypt-nodejs");

// Helper functions to generate values
function getArabicNamesInOrder(index) {
    const arabicFirstNames = ["محمد", "علي", "أحمد", "فاطمة", "عمر", "ليلى", "مريم"];
    const arabicLastNames = ["الحاج", "السيد", "إبراهيم", "عبدالله", "مصطفى", "جمال", "رضا"];

    // Use modulo to loop through the arrays if the index exceeds their length
    const firstName = arabicFirstNames[index % arabicFirstNames.length];
    const lastName = arabicLastNames[index % arabicLastNames.length];

    return { firstName, lastName };
}

// Map Arabic names to English equivalents
const arabicToEnglishMap = {
    "محمد": "Mohammad",
    "علي": "Ali",
    "أحمد": "Ahmad",
    "فاطمة": "Fatima",
    "عمر": "Omar",
    "ليلى": "Layla",
    "مريم": "Maryam",
    "الحاج": "Haj",
    "السيد": "El-Sayed",
    "إبراهيم": "Ibrahim",
    "عبدالله": "Abdullah",
    "مصطفى": "Mustafa",
    "جمال": "Jamal",
    "رضا": "Reda",
};

function getEmail(firstName, lastName) {
    // Convert Arabic names to English equivalents
    const englishFirstName = arabicToEnglishMap[firstName];
    const englishLastName = arabicToEnglishMap[lastName];
    const randomNumber = Math.floor(Math.random() * 10000); // Generate a random number
    return `${englishFirstName.toLowerCase()}.${englishLastName.toLowerCase()}.${randomNumber}@gmail.com`;
}

function getSocialNumber() {
    return `${Math.floor(Math.random() * 1000000)}`;
}

function getMajor() {
    const majors = ["هندسة البرمجيات", "الذكاء الصنعي", "الشبكات"];
    return majors[Math.floor(Math.random() * majors.length)];
}

const insertStudents = async () => {
    try {
        const numberOfStudents = 15;

        // Fetch all enrollment prices outside the loop
        const enrollmentPrices = await EnrollmentPrice.findAll();
        if (enrollmentPrices.length === 0) {
            console.error("No enrollment prices found in the database. Please insert enrollment prices first.");
            return;
        }

        // Prepare arrays for bulk creation
        const users = [];
        const students = [];

        for (let i = 0; i < numberOfStudents; i++) {
            // Get Arabic names in order
            const { firstName, lastName } = getArabicNamesInOrder(i);

            // Create user data
            const user = {
                firstName,
                lastName,
                email: getEmail(firstName, lastName), // Use English-friendly email
                password: bcrypt.hashSync("123456789"),
                phoneNumber: "0999999999",
                role: "student",
            };

            // Push user data to the array
            users.push(user);

            // Randomly assign an enrollment price ID
            const randomIndex = Math.floor(Math.random() * enrollmentPrices.length);
            const enrollmentPrice = enrollmentPrices[randomIndex];

            // Generate student-specific fields
            const student = {
                enrollmentPriceId: enrollmentPrice.id,
                socialNumber: getSocialNumber(),
                hoursAchieved: 0,
                gpa: 0,
                academicYear: 2025 - enrollmentPrice.year, // Set academic year based on enrollment price year
                major: getMajor(),
                balance: parseFloat((Math.random() * 10000).toFixed(2)), // Random balance up to 10,000
            };

            // Push student data to the array (userId will be added later)
            students.push(student);
        }

        // Bulk create users
        const createdUsers = await User.bulkCreate(users);

        // Assign userIds to students
        createdUsers.forEach((user, index) => {
            students[index].userId = user.id;
        });

        // Bulk create students
        await Student.bulkCreate(students);

        console.log(`${numberOfStudents} students successfully inserted into the database.`);
    } catch (error) {
        console.error('Error seeding students:', error);
    }
}

module.exports = {
    insertStudents
};