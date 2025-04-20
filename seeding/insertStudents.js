const { DataTypes } = require("sequelize");
const sequelize = require("../config/dataBase");
const User = require("../Models/user");
const Student = require("../Models/student");
const EnrollmentPrice = require("../Models/enrollmentPrice"); // Import the EnrollmentPrice model
const bcrypt = require("bcrypt-nodejs");

// Helper functions to generate values
function getArabicNamesInOrder(index) {
    const arabicFirstNames = ["محمد", "علي", "أحمد", "فاطمة", "سارة", "خالد", "عمر", "ليلى", "مريم", "يوسف"];
    const arabicLastNames = ["الحاج", "السيد", "إبراهيم", "عبدالله", "حسن", "مصطفى", "جمال", "رضا", "سعيد", "أمين"];

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
    "سارة": "Sara",
    "خالد": "Khaled",
    "عمر": "Omar",
    "ليلى": "Layla",
    "مريم": "Maryam",
    "يوسف": "Youssef",
    "الحاج": "Haj",
    "السيد": "El-Sayed",
    "إبراهيم": "Ibrahim",
    "عبدالله": "Abdullah",
    "حسن": "Hassan",
    "مصطفى": "Mustafa",
    "جمال": "Jamal",
    "رضا": "Reda",
    "سعيد": "Saeed",
    "أمين": "Ameen"
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
    const majors = ["علوم الحاسب", "هندسة البرمجيات", "الذكاء الصنعي", "الشبكات"];
    return majors[Math.floor(Math.random() * majors.length)];
}

async function inserStudents() {
    try {
        const numberOfStudents = 15;
        const students = [];

        for (let i = 0; i < numberOfStudents; i++) {
            // Get Arabic names in order
            const { firstName, lastName } = getArabicNamesInOrder(i);

            // Create a user record
            const user = await User.create({
                firstName,
                lastName,
                email: getEmail(firstName, lastName), // Use English-friendly email
                password: bcrypt.hashSync("123456789"),
                phoneNumber: "0999999999",
                role: "student",
            });

            // Randomly assign an enrollment price ID
            const enrollmentPriceId = Math.floor(Math.random() * 5) + 1; // Assuming there are 5 enrollment prices

            // Retrieve the academic year from the enrollment price
            const enrollmentPrice = await EnrollmentPrice.findOne({ where: { id: enrollmentPriceId } });
            if (!enrollmentPrice) {
                console.error(`Enrollment price with ID ${enrollmentPriceId} not found. Skipping student creation.`);
                continue;
            }

            // Generate student-specific fields
            const student = {
                userId: user.id,
                enrollmentPriceId: enrollmentPriceId,
                socialNumber: getSocialNumber(),
                hoursAchieved: 0,
                gpa: 0,
                academicYear: 2025 - enrollmentPrice.year, // Set academic year based on enrollment price year
                major: getMajor(),
                balance: parseFloat((Math.random() * 10000).toFixed(2)), // Random balance up to 10,000
            };

            students.push(student);
        }

        // Bulk insert all students into the database
        await Student.bulkCreate(students);

        console.log(`${numberOfStudents} students successfully inserted into the database.`);
    } catch (error) {
        console.error('Error seeding students:', error);
    }
}

module.exports = {
    inserStudents
};