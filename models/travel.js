'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Travel extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'owner' });
    }
  }
  Travel.init({
    // ID tidak perlu didefinisikan
    judulPerjalanan: DataTypes.STRING,
    cerita: DataTypes.TEXT,
    imageId: DataTypes.STRING,
    userId: DataTypes.INTEGER // Menyesuaikan dengan tipe data di migrasi
  }, {
    sequelize,
    modelName: 'Travel',
  });
  return Travel;
};