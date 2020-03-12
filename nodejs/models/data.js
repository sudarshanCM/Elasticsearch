'use strict';
module.exports = (sequelize, DataTypes) => {
  const Data = sequelize.define('Data', {
    date: DataTypes.STRING,
    open: DataTypes.STRING,
    high: DataTypes.STRING,
    low: DataTypes.STRING,
    close: DataTypes.STRING,
    volume: DataTypes.STRING,
    value: DataTypes.STRING,
    searchTerm: DataTypes.STRING
  }, {});
  Data.associate = function(models) {
    // associations can be defined here
  };
  return Data;
};