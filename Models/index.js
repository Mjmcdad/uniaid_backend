const sequelize = require('../config/dataBase');

const User = require('./user');
const Admin = require('./admin');
const Student = require('./student');
const Teacher = require('./teacher');
const Subject = require('./subject');
const SubjectOffer = require('./subjectOffers');
const MarkSplit = require('./markSplit');
const Assignment = require('./assginments');
const Exam = require('./exam');
const Enrollment = require('./enrollment');
const StudentMark = require('./studentMark');
const Lecture = require('./lecture');
const Transaction = require('./transactions');
const Semester = require('./semester');
const TSection = require('./tSection');
const PSection = require('./pSection');
const TTeacher = require('./tTeacher');
const PTeacher = require('./pTeacher');
const Room = require('./room');

const initModels = async () => {
    User.hasOne(Admin, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Admin.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

    User.hasOne(Student, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Student.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

    User.hasOne(Teacher, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Teacher.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

    Subject.hasOne(TSection, { foreignKey: 'subjectId', onDelete: 'CASCADE' });
    TSection.belongsTo(Subject, { foreignKey: 'subjectId', onDelete: 'CASCADE' });

    Subject.hasOne(PSection, { foreignKey: 'subjectId', onDelete: 'CASCADE' });
    PSection.belongsTo(Subject, { foreignKey: 'subjectId', onDelete: 'CASCADE' });

    Teacher.belongsToMany(TSection, { through: TTeacher, foreignKey: 'teacherId', onDelete: 'CASCADE' });
    TSection.belongsToMany(Teacher, { through: TTeacher, foreignKey: 'tSectionId', onDelete: 'CASCADE' });

    Teacher.belongsToMany(PSection, { through: PTeacher, foreignKey: 'teacherId', onDelete: 'CASCADE' });
    PSection.belongsToMany(Teacher, { through: PTeacher, foreignKey: 'pSectionId', onDelete: 'CASCADE' });


    Semester.belongsToMany(Subject, { through: SubjectOffer, foreignKey: 'semesterId', onDelete: 'CASCADE' });
    Subject.belongsToMany(Semester, { through: SubjectOffer, foreignKey: 'subjectId', onDelete: 'CASCADE' });

    Student.belongsToMany(SubjectOffer, { through: Enrollment, foreignKey: 'studentId', onDelete: 'CASCADE' });
    SubjectOffer.belongsToMany(Student, { through: Enrollment, foreignKey: 'subjectOfferId', onDelete: 'CASCADE' });

    Student.belongsToMany(Subject, { through: Transaction, foreignKey: 'studentId', onDelete: 'CASCADE' });
    Subject.belongsToMany(Student, { through: Transaction, foreignKey: 'subjectId', onDelete: 'CASCADE' });

    StudentMark.belongsTo(Enrollment, { foreignKey: 'enrollmentId', onDelete: 'CASCADE' });
    Enrollment.hasOne(StudentMark, { foreignKey: 'enrollmentId', onDelete: 'CASCADE' });


    SubjectOffer.hasMany(Exam, { foreignKey: 'subjectOfferId', onDelete: 'CASCADE' });
    Exam.belongsTo(SubjectOffer, { foreignKey: 'subjectOfferId', onDelete: 'CASCADE' });

    SubjectOffer.hasOne(MarkSplit, { foreignKey: 'subjectOfferId', onDelete: 'CASCADE' });
    MarkSplit.belongsTo(SubjectOffer, { foreignKey: 'subjectOfferId', onDelete: 'CASCADE' });

    MarkSplit.hasMany(Assignment, { foreignKey: 'markSplitId', onDelete: 'CASCADE' });
    Assignment.belongsTo(MarkSplit, { foreignKey: 'markSplitId', onDelete: 'CASCADE' });


    Subject.hasMany(Lecture, { foreignKey: 'subjectId', onDelete: 'CASCADE' });
    Lecture.belongsTo(Subject, { foreignKey: "subjectId", onDelete: 'CASCADE' })

    Room.hasMany(Lecture, { foreignKey: 'roomId', onDelete: 'CASCADE' });
    Lecture.belongsTo(Room, { foreignKey: "roomId", onDelete: 'CASCADE' })

    SubjectOffer.belongsTo(Subject, { foreignKey: 'subjectId' });

    Lecture.belongsTo(Teacher, { foreignKey: "teacherId", onDelete: "CASCADE" })
    Teacher.hasMany(Lecture, { foreignKey: 'teacherId', onDelete: "CASCADE" })

    SubjectOffer.hasMany(Enrollment, { foreignKey: 'subjectOfferId', onDelete: 'CASCADE' });
    Enrollment.belongsTo(SubjectOffer, { foreignKey: 'subjectOfferId', onDelete: 'CASCADE' });

    SubjectOffer.belongsTo(Subject, { foreignKey: 'subjectId' });
    Subject.hasMany(SubjectOffer, { foreignKey: 'subjectId', onDelete: 'CASCADE' });


    SubjectOffer.belongsTo(Semester, { foreignKey: 'semesterId' });
    Semester.hasMany(SubjectOffer, { foreignKey: 'semesterId', onDelete: 'CASCADE' });
};



module.exports = { sequelize, initModels };

