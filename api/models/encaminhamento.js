'use strict';
import { Model}  from 'sequelize';
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  class Encaminhamentos extends Model {
    static associate(models) {
      Encaminhamentos.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'Remetente' });
      Encaminhamentos.belongsTo(models.Usuario, { foreignKey: 'destinatario_id', as: 'Destinatario' });
      Encaminhamentos.belongsTo(models.Demanda, { foreignKey: 'demanda_id', as:'Demanda' });
      Encaminhamentos.hasMany(models.IntervencaoDemanda, { foreignKey: 'encaminhamento_id', as:'Intervencao' });
      }
  }
  Encaminhamentos.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    demanda_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Demanda',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    destinatario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false
    },
    data:{
      type: DataTypes.DATE, 
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Encaminhamentos',
  });
  return Encaminhamentos;
};