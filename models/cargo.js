'use strict';
import { Model}  from 'sequelize';
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  class Cargo extends Model {
    static associate(models) {
      Cargo.hasMany(models.Usuario, { foreignKey: 'cargo_id' });
    }
  }
  Cargo.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.ENUM,
      values: ['Coodernador', "Diretor Ensino", 'Diretor Geral', 'Funcionario CTP', "Professor"],
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Cargo',
    tableName: 'Cargos'
  });
  return Cargo;
};