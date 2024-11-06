const {initModels} = require('./Models');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config();
const app = express();
const port = process.env.PORT;
const userRoutes = require('./Routes/userRoutes');
const studentRoutes = require('./Routes/studentRoutes');
const subjectRoutes = require('./Routes/subjectRoutes');
const teacherRoutes = require('./Routes/teacherRoutes');
const transactionRoutes = require('./Routes/transactionRoutes');
const subjectOfferRoutes = require('./Routes/subjectOfferRoutes');
const semesterRoutes = require('./Routes/semesterRoutes');
const roomRoutes = require('./Routes/roomRoutes');
const lectureRoutes = require('./Routes/lectureRoutes');
const markSplitRoutes = require('./Routes/markSplitRoutes');
const examRoutes = require('./Routes/examRoutes');
const enrollmentRoutes = require('./Routes/enrollmentRoutes');
const enrollmentPriceRoutes = require('./Routes/enrollmentPriceRoutes');
const assignmentRoutes = require('./Routes/assignmentRoutes');

initModels();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use(express.json());


app.use('/users', userRoutes);
app.use('/students', studentRoutes);
app.use('/subjects', subjectRoutes);
app.use('/teachers', teacherRoutes);
app.use('/transactions', transactionRoutes);
app.use('/subjectOffers', subjectOfferRoutes);
app.use('/semesters', semesterRoutes);
app.use('/rooms', roomRoutes);
app.use('/markSplits', markSplitRoutes);
app.use('/lectures', lectureRoutes);
app.use('/exams', examRoutes);
app.use('/enrollments', enrollmentRoutes);
app.use('/enrollmentPrices', enrollmentPriceRoutes);
app.use('/assignments', assignmentRoutes);





