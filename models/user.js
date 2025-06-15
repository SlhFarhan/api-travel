'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Travel, { foreignKey: 'userId', as: 'travels' });
    }
  }
  User.init({
    // ID tidak perlu didefinisikan, Sequelize akan menanganinya secara otomatis
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};