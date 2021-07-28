const { DataSource } = require('apollo-datasource');
const { Op } = require('sequelize');
const DataLoader = require('dataloader');

class SqlAPI extends DataSource {
  cardDataLoader = new DataLoader(async (ids) => {
    const cards = await this.store.cards.findAll();
    return Promise.all(ids.map(id => cards.find(c => c.id === id)));
  });

  tagDataLoader = new DataLoader(async (ids) => {
    const tags = await this.store.tags.findAll();
    return Promise.all(ids.map(id => tags.find(t => t.id === id)));
  });

  constructor({ store }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
    this.cache = config.cache;
  }

  async getOffers() {
    const offers = await this.store.offers.findAll({
      where: {
        endDate: {
          [Op.or]: [
            null,
            { [Op.gt]: new Date() },
          ],
        },
        startDate: {
          [Op.or]: [
            null,
            { [Op.lt]: new Date() },
          ],
        },
      },
    });
    return offers.map(offer => this.offerReducer(offer));
  }

  offerReducer(offer) {
    return {
      id: offer.id,
      value: offer.value,
      cardId: offer.cardId,
      tagId: offer.tagId,
      startDate: offer.startDate,
      endDate: offer.endDate,
    };
  }

  async findOfferById(id) {
    return this.offerReducer(await this.store.offers.findByPk(id));
  }

  findCardById(id) {
    return this.cardDataLoader.load(id);
  }

  findTagById(id) {
    return this.tagDataLoader.load(id);
  }

  findCardByKey(key) {
    return this.store.cards.findOne({
      where: { key },
    });
  }

  async findOrCreateTag({ key, name } = {}) {
    const [tag] = await this.store.tags.findOrCreate({
      where: { key },
      defaults: { name },
    });
    return tag;
  }

  findTagByKey(key) {
    return this.store.tags.findOne({
      where: { key },
    });
  }

  async findOrCreateCard({ key, name } = {}) {
    const [card] = await this.store.cards.findOrCreate({
      where: { key },
      defaults: { name },
    });
    return card;
  }

  async findOrCreateOffer({ cardKey, tagKey, value, startDate, endDate } = {}) {
    const Card = this.store.cards;
    const Tag = this.store.tags;
    const Offer = this.store.offers;

    let [offer] = await Offer.findAll({
      include: [
        {
          model: Card,
          where: { key: cardKey },
        },
        {
          model: Tag,
          where: { key: tagKey },
        },
      ],
      where: {},
    });
    if (!offer) {
      const currentCard = await Card.findOne({ where: { key: cardKey } });
      const currentTag = await Tag.findOne({ where: { key: tagKey } });
      offer = await Offer.create({
        cardId: currentCard.id,
        tagId: currentTag.id,
        value,
        startDate,
        endDate,
      });
    } else {
      offer.value = value;
      offer.startDate = startDate;
      offer.endDate = endDate;
      await offer.save();
    }
    return offer;
  }

  getDateTime(string) {
    const dateTime = new Date(string);
    dateTime.setHours(0, 0, 0);
    return dateTime;
  }

  isOverlapping(sourceStart, sourceEnd, targetStart, targetEnd) {
    const sourceStartDate = this.getDateTime(sourceStart);
    const sourceEndDate = this.getDateTime(sourceEnd);
    const targetStartDate = this.getDateTime(targetStart);
    const targetEndDate = this.getDateTime(targetEnd);
    return sourceStartDate <= targetStartDate <= sourceEndDate <=
      targetEndDate ||
      targetStartDate <= sourceStartDate <= targetEndDate <= sourceEndDate;
  }

  isSameDay(source, target) {
    const sourceDate = this.getDateTime(source);
    const targetDate = this.getDateTime(target);
    return sourceDate.getTime() === targetDate.getTime();
  }
}

module.exports = SqlAPI;
