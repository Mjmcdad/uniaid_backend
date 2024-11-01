const { sequelize, initModels } = require('./Models');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv')
const app = express();
const port = process.env.PORT || 3000;
const userRoutes = require('./Routes/userRoutes');

dotenv.config();

const corsOptions = {
    origin: "*"
}

initModels();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
