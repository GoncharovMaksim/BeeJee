const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
	'beejee',
	'beejee_user',
	'YOUR_PASSWORD',
	{
		host: 'dpg-d359q0e3jp1c73esmcrg-a',
		port: 5432,
		dialect: 'postgres',
		logging: false,
	}
);

module.exports = { sequelize };
