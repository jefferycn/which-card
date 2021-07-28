const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar Date
  type Card {
    id: ID!
    key: String!
    name: String!
  }

  type Tag {
    id: ID!
    key: String!
    name: String!
  }

  type Offer {
    id: ID!
    tag: Tag
    card: Card
    value: Int!
    startDate: Date
    endDate: Date
  }

  type Query {
    offers: [Offer]!
    getOffer(id: ID!): Offer!
    getTag(key: String!): Tag!
    getCard(key: String!): Card!
  }

  type Mutation {
    createTag(key: String!, name: String!): Tag!
    createCard(key: String!, name: String!): Card!
    createOffer(cardKey: String!, tagKey: String!, value: Int!, startDate: Date, endDate: Date): Offer!
  }
`;

module.exports = typeDefs;
