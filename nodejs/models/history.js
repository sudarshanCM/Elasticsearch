'use strict';
module.exports = (sequelize, DataTypes) => {
  const History = sequelize.define('History', {
    searchTerm: DataTypes.STRING
  }, {});
  History.associate = function(models) {
    // associations can be defined here
  };
  return History;
};