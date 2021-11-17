import { InputPaginationDto } from '../common/dtos/input-pagination.dto';
import {
  GQLpaginateParams,
  GQLpaginationSerializer,
  RESTpaginateParams,
  RESTpaginationSerializer,
} from './index';

describe('utils Test', () => {
  describe('pagination test', () => {
    it('should create skip and limit', () => {
      expect(1).toBeTruthy();
    });

    it('should create skip and limit for page 1 with not perPage', () => {
      const paginationParams = RESTpaginateParams({
        page: 1,
        perPage: undefined,
      } as InputPaginationDto);
      expect(paginationParams.take).toBe(10);
      expect(paginationParams.skip).toBe(0);
    });

    it('should create skip and limit for not page and perPage 3', () => {
      const paginationParams = RESTpaginateParams({
        page: undefined,
        perPage: 3,
      } as InputPaginationDto);
      expect(paginationParams.take).toBe(3);
      expect(paginationParams.skip).toBe(0);
    });

    it('shoudl create a skip and limit when page and perPage are not defined', () => {
      const paginationParams = RESTpaginateParams({} as InputPaginationDto);
      expect(paginationParams.take).toBe(10);
      expect(paginationParams.skip).toBe(0);
    });

    it('should create skip and limit for page n with not perPage(10)', () => {
      const paginationParams = RESTpaginateParams({
        page: 2,
        perPage: undefined,
      } as InputPaginationDto);
      expect(paginationParams.take).toBe(10);
      expect(paginationParams.skip).toBe(10);
    });

    it('should create skip and limit for page 3 with perPage 8', () => {
      const paginationParams = RESTpaginateParams({
        page: 3,
        perPage: 8,
      });

      expect(paginationParams.take).toBe(8);
      expect(paginationParams.skip).toBe(16);
    });

    it('should throw an error when page is less 0', () => {
      expect(() => {
        const paginationParams = RESTpaginateParams({
          page: -1,
          perPage: 8,
        });
      }).toThrowError();
    });
  });

  it('should return an object with take equal to 2, skip and cursor equal to undefined', () => {
    const paginationParams = GQLpaginateParams({
      first: 2,
      after: undefined,
    });

    expect(paginationParams.take).toBe(2);
    expect(paginationParams.skip).toBeUndefined();
    expect(paginationParams.cursor).toBeUndefined();
  });

  it('should return an object with take equal to 5, skip to 1 and cursor: id', () => {
    const paginationParams = GQLpaginateParams({
      first: 5,
      after: 'resourceId',
    });

    expect(paginationParams.take).toBe(5);
    expect(paginationParams.skip).toBe(1);
    expect(paginationParams.cursor).not.toBeUndefined();
  });

  it('should return an object with take equal to 5, skip to 1 and cursor: id', () => {
    const paginationParams = GQLpaginateParams({
      first: undefined,
      after: 'resourceId',
    });

    expect(paginationParams.take).toBe(10);
    expect(paginationParams.skip).toBe(1);
    expect(paginationParams.cursor).not.toBeUndefined();
  });

  describe('page Info test', () => {
    const total = 10;
    const pagination = { page: 2, perPage: 10 };

    const pageInfo = RESTpaginationSerializer(total, pagination);
    expect(pageInfo.total).toBe(10);
    expect(pageInfo.nextPage).toBeNull();
  });

  describe('page Info test', () => {
    const total = 11;
    const pagination = { page: 2, perPage: 10 };

    const pageInfo = RESTpaginationSerializer(total, pagination);
    expect(pageInfo.perPage).toBe(10);
  });

  describe('page Info test', () => {
    const total = 11;
    const pagination = { page: 2, perPage: 10 };

    const pageInfo = RESTpaginationSerializer(total, pagination);
    expect(pageInfo.perPage).toBe(10);
  });

  describe('GQLpageInfo with data emtpy', () => {
    const data = [];
    const edge = [];

    const paginationSerializer = GQLpaginationSerializer(data, edge);
    expect(paginationSerializer.startCursor).toBeNull();
    expect(paginationSerializer.endCursor).toBeNull();
    expect(paginationSerializer.hasPreviousPage).toBeFalsy();
    expect(paginationSerializer.hasNextPage).toBeFalsy();
  });

  describe('GQLpageInfo with data not empty, so return an pageInfo information', () => {
    const data = [
      { id: 'resourceId1' },
      { id: 'resourceId2' },
      { id: 'resourceId3' },
      { id: 'resourceId4' },
      { id: 'resourceId5' },
    ];
    const edge = [
      { id: 'resourceId1' },
      { id: 'resourceId2' },
      { id: 'resourceId3' },
    ];

    const paginationSerializer = GQLpaginationSerializer(data, edge);
    expect(paginationSerializer.startCursor).toMatch('resourceId1');
    expect(paginationSerializer.endCursor).toMatch('resourceId3');
    expect(paginationSerializer.hasPreviousPage).toBeFalsy();
    expect(paginationSerializer.hasNextPage).toBeTruthy();
  });

  describe('GQLpageInfo with data with one element, so return an pageInfo information', () => {
    const data = [{ id: 'resourceId1' }];
    const edge = [{ id: 'resourceId1' }];

    const paginationSerializer = GQLpaginationSerializer(data, edge);
    expect(paginationSerializer.startCursor).toMatch('resourceId1');
    expect(paginationSerializer.endCursor).toMatch('resourceId1');
    expect(paginationSerializer.hasPreviousPage).toBeFalsy();
    expect(paginationSerializer.hasNextPage).toBeFalsy();
  });

  describe('GQLpageInfo with data, so return an pageInfo information', () => {
    const data = [
      { id: 'resourceId1' },
      { id: 'resourceId2' },
      { id: 'resourceId3' },
      { id: 'resourceId4' },
      { id: 'resourceId5' },
    ];
    const edge = [{ id: 'resourceId3' }, { id: 'resourceId4' }];

    const paginationSerializer = GQLpaginationSerializer(data, edge);
    expect(paginationSerializer.startCursor).toMatch('resourceId3');
    expect(paginationSerializer.endCursor).toMatch('resourceId4');
    expect(paginationSerializer.hasPreviousPage).toBeTruthy();
    expect(paginationSerializer.hasNextPage).toBeTruthy();
  });
});
