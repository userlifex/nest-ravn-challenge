import { InputPaginationDto } from 'src/common/dtos/input-pagination.dto';
import { RESTpaginateParams, RESTpaginationSerializer } from './index';

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
});
