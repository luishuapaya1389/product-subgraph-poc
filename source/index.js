import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import gql from 'graphql-tag';
import fs from 'node:fs';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';

const typeDefs = gql`${fs.readFileSync(new URL('./schema.graphql', import.meta.url), 'utf8')}`;

const PRODUCTS = [
  { code: 'P-100', name: 'Laptop Pro 14', description: 'Ultrabook 14"', category: 'Computers', currency: 'USD', price: 1499.99, updatedAt: '2025-10-01T10:00:00Z' },
  { code: 'P-101', name: 'Mouse Ergo',     description: 'Mouse ergonómico', category: 'Accessories', currency: 'USD', price: 39.9,    updatedAt: '2025-10-02T09:20:00Z' },
  { code: 'P-102', name: 'Teclado MX',     description: 'Teclado mecánico', category: 'Accessories', currency: 'USD', price: 119.0,   updatedAt: '2025-10-02T12:30:00Z' },
  { code: 'P-103', name: 'Monitor 27"',    description: 'QHD 165Hz',        category: 'Displays',    currency: 'USD', price: 329.0,   updatedAt: '2025-10-03T08:15:00Z' },
  { code: 'P-104', name: 'Dock USB-C',     description: '8-in-1',           category: 'Accessories', currency: 'USD', price: 79.0,    updatedAt: '2025-10-04T11:05:00Z' }
];

const resolvers = {
  Query: {
    product: (_, { code }) => PRODUCTS.find(p => p.code === code) || null,
    products: () => PRODUCTS
  },
  Product: {
    __resolveReference: (ref) => PRODUCTS.find(p => p.code === ref.code) || null
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
  plugins: [
    // Emite el header HTTP Cache-Control basado en @cacheControl
    ApolloServerPluginCacheControl({ calculateHttpHeaders: true })
  ]
});

const { url } = await startStandaloneServer(server, { listen: { port: 4011 } });
console.log(`🚀 product subgraph ready at ${url}`);