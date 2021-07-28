const Sequelize = require('sequelize');

module.exports.paginateResults = ({
                                    after: cursor,
                                    pageSize = 20,
                                    results,
                                    // can pass in a function to calculate an item's cursor
                                    getCursor = () => null,
                                  }) => {
  if (pageSize < 1) return [];

  if (!cursor) return results.slice(0, pageSize);
  const cursorIndex = results.findIndex(item => {
    // if an item has a `cursor` on it, use that, otherwise try to generate one
    let itemCursor = item.cursor ? item.cursor : getCursor(item);

    // if there's still not a cursor, return false by default
    return itemCursor ? cursor === itemCursor : false;
  });

  return cursorIndex >= 0
    ? cursorIndex === results.length - 1 // don't let us overflow
      ? []
      : results.slice(
        cursorIndex + 1,
        Math.min(results.length, cursorIndex + 1 + pageSize),
      )
    : results.slice(0, pageSize);
};

module.exports.createStore = () => {
  const Op = Sequelize.Op;
  const operatorsAliases = {
    $in: Op.in,
  };

  const db = new Sequelize('sqlite:store.sqlite');

  const cards = db.define('card', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    key: {
      type: Sequelize.STRING,
      unique: true,
    },
    name: Sequelize.STRING,
  }, {
    timestamps: false,
  });

  const tags = db.define('tag', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    key: {
      type: Sequelize.STRING,
      unique: true,
    },
    name: Sequelize.STRING,
  }, {
    timestamps: false,
  });

  const offers = db.define('offer', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tagId: {
      type: Sequelize.INTEGER,
      references: {
        model: tags,
        key: 'id',
      },
    },
    cardId: {
      type: Sequelize.INTEGER,
      references: {
        model: cards,
        key: 'id',
      },
    },
    value: Sequelize.INTEGER,
    startDate: Sequelize.DATE,
    endDate: Sequelize.DATE,
  });

  offers.belongsTo(cards);
  offers.belongsTo(tags);

  return { cards, tags, offers };
};
