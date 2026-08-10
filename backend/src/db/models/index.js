import User from './User.js';
import Theme from './Theme.js';
import Activity from './Activity.js';
import Week from './Week.js';
import ActivityInstance from './ActivityInstance.js';
import ExternalActivityType from './ExternalActivityType.js';

User.hasMany(Theme, { foreignKey: 'userId', onDelete: 'CASCADE' });
Theme.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Activity, { foreignKey: 'userId', onDelete: 'CASCADE' });
Activity.belongsTo(User, { foreignKey: 'userId' });
Theme.hasMany(Activity, { foreignKey: 'themeId', onDelete: 'SET NULL' });
Activity.belongsTo(Theme, { foreignKey: 'themeId' });

User.hasMany(Week, { foreignKey: 'userId', onDelete: 'CASCADE' });
Week.belongsTo(User, { foreignKey: 'userId' });

Week.hasMany(ActivityInstance, { foreignKey: 'weekId', onDelete: 'CASCADE' });
ActivityInstance.belongsTo(Week, { foreignKey: 'weekId' });
Activity.hasMany(ActivityInstance, { foreignKey: 'activityId', onDelete: 'RESTRICT' });
ActivityInstance.belongsTo(Activity, { foreignKey: 'activityId' });

User.hasMany(ExternalActivityType, { foreignKey: 'userId', onDelete: 'CASCADE' });
ExternalActivityType.belongsTo(User, { foreignKey: 'userId' });
ExternalActivityType.hasMany(ActivityInstance, { foreignKey: 'externalTypeId', onDelete: 'SET NULL' });
ActivityInstance.belongsTo(ExternalActivityType, { foreignKey: 'externalTypeId' });

export { User, Theme, Activity, Week, ActivityInstance, ExternalActivityType };