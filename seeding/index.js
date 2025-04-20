const path = require('path');
const bcrypt = require("bcrypt-nodejs");

const { importSubjects } = require("./importSubjects")
const { importTeachers } = require("./importTeachers")
const { insertEnrollmentPrices } = require("./insertEnrollmentsPrice")
const { insertSubjectOffers } = require("./insertSubjectOffer")
const { insertRandomSemesters } = require('./insertSemesters')
const { insertRandomSectionsAndTeachers } = require('./insertSections')
const { insertRooms } = require("./inserRooms")
const { inserStudents } = require("./insertStudents")
const { insertEnrollmentsAndMarks } = require('./insertEnrollmentsAndMarks')


const Admin = require("../Models/admin")
const User = require("../Models/user")

const subjectPath = path.join(__dirname, "../../المواد.csv");
const teacherPath = path.join(__dirname, "../../أساتذة.csv");

async function seed() {
    try {

        const hashedPassword = await bcrypt.hashSync("123456789");
        const user = await User.create({
            firstName: "admin",
            lastName: "admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            phoneNumber: "0999999999",
            role: "Admin",
        });

        await Admin.create({ userId: user.id });

        await importSubjects(subjectPath);


        await importTeachers(teacherPath);


        await insertRandomSemesters();


        await insertEnrollmentPrices();


        await insertSubjectOffers();

        await insertRandomSectionsAndTeachers();

        await insertRooms();

        await inserStudents();
        await insertEnrollmentsAndMarks();

        console.log("Seeding completed successfully!");
    } catch (error) {
        console.error("Error during seeding:", error);
    }
}

seed();