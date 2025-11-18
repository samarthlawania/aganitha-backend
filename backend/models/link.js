const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: { ssl: { rejectUnauthorized: false } }
});

const Link = sequelize.define('Link', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    code:{
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    target_url: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    short_url: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    clicks: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
    last_clcked_at: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
},
{
    tableName: 'links',
    timestamps: false,
});
module.exports = { sequelize };
