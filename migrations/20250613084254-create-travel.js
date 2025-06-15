'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Travels', {
      id: {
        allowNull: false,
        autoIncrement: true, // ID auto-increment
        primaryKey: true,
        type: Sequelize.INTEGER // Tipe data INTEGER
      },
      judulPerjalanan: {
        type: Sequelize.STRING
      },
      cerita: {
        type: Sequelize.TEXT
      },
      imageId: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER, // Foreign key sebagai INTEGER
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Travels');
  }
};