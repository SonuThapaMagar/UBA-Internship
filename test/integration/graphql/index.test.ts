import { describe, expect, it } from 'vitest';
import { resolvers } from '../../../src/graphql/resolvers';
import { userResolvers } from '../../../src/graphql/resolvers/user.resolver';

describe('GraphQL resolvers index', () => {
  it('should correctly re-export Query resolvers', () => {
    expect(resolvers.Query).toEqual(userResolvers.Query);
  });

  it('should correctly re-export Mutation resolvers', () => {
    expect(resolvers.Mutation).toEqual(userResolvers.Mutation);
  });
});
