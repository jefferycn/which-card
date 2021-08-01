module.exports = {
  Query: {
    offers: (_, { mode }, { dataSources }) => dataSources.SqlAPI.getOffers(
      { mode }),
    getOffer: (
      _, { id }, { dataSources }) => dataSources.SqlAPI.findOfferById(id),
    getTag: (_, { key }, { dataSources }) => dataSources.SqlAPI.getTag(
      key),
    getCard: (_, { key }, { dataSources }) => dataSources.SqlAPI.findCardByKey(
      key),
  },
  Offer: {
    tag: (offer, _, { dataSources }) => dataSources.SqlAPI.findTagById(
      offer.tagId),
    card: (offer, _, { dataSources }) => dataSources.SqlAPI.findCardById(
      offer.cardId),
  },
  Mutation: {
    createTag: (
      _, { key, name }, { dataSources }) => dataSources.SqlAPI.findOrCreateTag(
      { key, name }),
    createCard: (
      _, { key, name }, { dataSources }) => dataSources.SqlAPI.findOrCreateCard(
      { key, name }),
    createOffer: (
      _, { cardKey, tagKey, value, startDate, endDate },
      { dataSources }) => dataSources.SqlAPI.createOrUpdateOffer(
      { cardKey, tagKey, value, startDate, endDate }),
  },
};
