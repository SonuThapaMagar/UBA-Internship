import { describe, expect, it } from 'vitest';
import { resolvers } from '../../../app/graphql/resolvers';
import { userResolvers } from '../../../app/graphql/resolvers/user.resolver';
import { typeDefs } from '../../../app/graphql/schema'; 

describe('GraphQL resolvers index', () => {
  it('should correctly export Query resolvers', () => {
    expect(resolvers.Query).toEqual(userResolvers.Query);
  });

  it('should correctly export Mutation resolvers', () => {
    expect(resolvers.Mutation).toEqual(userResolvers.Mutation);
  });

  it('should export non-empty typeDefs string', () => {
    expect(typeof typeDefs).toBe('string');
    expect(typeDefs.length).toBeGreaterThan(0);
    expect(typeDefs).toContain('type User');
    expect(typeDefs).toContain('type Query');
    expect(typeDefs).toContain('type Mutation');
  });
});