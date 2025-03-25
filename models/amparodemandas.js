// models/amparoDemanda.js
export default (sequelize, DataTypes) => {
    const AmparoDemanda = sequelize.define('AmparoDemanda', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      demanda_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Demandas',
          key: 'id',
        },
      },
      amparoLegal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'AmparoLegals',
          key: 'id',
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    }, {
      tableName: 'AmparoDemandas', 
    });
  
    AmparoDemanda.associate = (models) => {
      AmparoDemanda.belongsTo(models.Demanda, { foreignKey: 'demanda_id' });
      AmparoDemanda.belongsTo(models.AmparoLegal, { foreignKey: 'amparolegal_id' });
    };
  
    return AmparoDemanda;
  };