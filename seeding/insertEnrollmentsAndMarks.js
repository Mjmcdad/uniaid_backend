const Student = require('../Models/student');
const SubjectOffer = require('../Models/subjectOffers');
const Enrollment = require('../Models/enrollment');
const StudentMark = require('../Models/studentMark');
const Subject = require('../Models/subject');
const Semester = require('../Models/semester');
const EnrollmentPrice = require('../Models/enrollmentPrice');

// Helper function to generate random marks
function getRandomMark(min, max) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

// Helper function to calculate GPA
function calculateGPA(totalMarksArray) {
    const gradePoints = totalMarksArray.map(mark => {
        if (mark >= 90) return 4.0;
        if (mark >= 85) return 3.7;
        if (mark >= 80) return 3.3;
        if (mark >= 75) return 3.0;
        if (mark >= 70) return 2.7;
        if (mark >= 65) return 2.3;
        if (mark >= 60) return 2.0;
        return 0.0; // Failing grade
    });

    const totalGradePoints = gradePoints.reduce((sum, gp) => sum + gp, 0);
    return parseFloat((totalGradePoints / gradePoints.length).toFixed(2));
}

async function insertEnrollmentsAndMarks() {
    try {
        // Step 1: Retrieve all students and subject offers
        const students = await Student.findAll();
        const subjectOffers = await SubjectOffer.findAll({
            where: {
                isAvailable: true
            }
        });

        if (students.length === 0) {
            console.error('No students found in the database. Please insert students first.');
            return;
        }

        if (subjectOffers.length === 0) {
            console.error('No subject offers found in the database. Please insert subject offers first.');
            return;
        }

        // Step 2: Create enrollments and marks for each student
        for (const student of students) {
            const totalMarksForGPA = [];
            let totalHoursAchieved = 0;

            for (const subjectOffer of subjectOffers) {
                // Retrieve the subject details
                const subject = await Subject.findOne({ where: { id: subjectOffer.subjectId } });
                if (!subject) {
                    console.log(`Subject with ID ${subjectOffer.subjectId} not found. Skipping enrollment.`);
                    continue;
                }

                // Retrieve the semester details
                const semester = await Semester.findOne({ where: { id: subjectOffer.semesterId } });
                if (!semester) {
                    console.log(`Semester with ID ${subjectOffer.semesterId} not found. Skipping enrollment.`);
                    continue;
                }

                // Retrieve the enrollment price details
                const enrollmentPrice = await EnrollmentPrice.findOne({ where: { id: student.enrollmentPriceId } });
                if (!enrollmentPrice) {
                    console.log(`Enrollment price with ID ${student.enrollmentPriceId} not found. Skipping enrollment.`);
                    continue;
                }

                // Check if the enrollment price year is valid for the semester year
                if (enrollmentPrice.year > semester.year) {
                    console.log(`Student ${student.id} cannot enroll in subject offer ${subjectOffer.id} (enrollment price year mismatch).`);
                    continue;
                }

                // Check if the student's academic year matches the subject's academic year
                if (student.academicYear < subject.academicYear) {
                    console.log(`Student ${student.id} is not qualified to enroll in subject ${subject.id} (academic year mismatch).`);
                    continue;
                }

                // Check if the student has already passed any subject offer with the same subjectId
                const existingPassedEnrollment = await Enrollment.findOne({
                    include: [{
                        model: SubjectOffer,
                        where: { subjectId: subjectOffer.subjectId }
                    }],
                    where: {
                        studentId: student.id,
                        status: 'Passed' // Only check for passed enrollments
                    }
                });

                if (existingPassedEnrollment) {
                    console.log(`Student ${student.id} has already passed a subject offer with subjectId ${subjectOffer.subjectId}. Skipping enrollment.`);
                    continue;
                }

                // Generate random marks for the enrollment
                const finalMark = getRandomMark(50, 100);
                const midtermMark = getRandomMark(40, 90);
                const practicalMark = getRandomMark(30, 80);
                const assignmentMark = getRandomMark(20, 70);
                const totalMark = parseFloat((finalMark * 0.5 + midtermMark * 0.3 + practicalMark * 0.1 + assignmentMark * 0.1).toFixed(2));

                // Determine the status based on the total mark
                const status = totalMark >= 60 ? 'Passed' : 'Failed';

                // Create an enrollment
                const enrollment = await Enrollment.create({
                    studentId: student.id,
                    subjectOfferId: subjectOffer.id,
                    isQualified: true,
                    status: status // Status depends on the total mark
                });

                // Store the total mark for GPA calculation if the student passed
                if (status === 'Passed') {
                    totalMarksForGPA.push(totalMark);

                    // Add the subject's hours to the total hours achieved
                    totalHoursAchieved += subject.hours;
                }

                // Create a student mark record
                await StudentMark.create({
                    enrollmentId: enrollment.id,
                    finalMark,
                    midtermMark,
                    practicalMark,
                    assignmentMark,
                    totalMark
                });
            }

            // Calculate and update the student's GPA
            const gpa = totalMarksForGPA.length > 0 ? calculateGPA(totalMarksForGPA) : null;

            // Update the student's GPA and hoursAchieved
            await Student.update(
                { gpa, hoursAchieved: totalHoursAchieved },
                { where: { id: student.id } }
            );
        }

        console.log('Enrollments and marks successfully inserted into the database.');
    } catch (error) {
        console.error('Error seeding enrollments and marks:', error);
    }
}


module.exports = {
    insertEnrollmentsAndMarks
};