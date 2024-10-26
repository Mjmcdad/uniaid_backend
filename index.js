const Sequelize = require('sequelize');

const sequelize = new Sequelize('uniaid_db', 'root', 'toor', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Error connecting to the database:', error);
});

