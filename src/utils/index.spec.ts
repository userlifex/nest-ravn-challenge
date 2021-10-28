import { InputPaginationDto } from 'src/common/dtos/input-pagination.dto';
import { paginateParams } from './index';

describe('utils Test', () => {
  describe('pagination test', () => {
    it('should create skip and limit', () => {
      expect(1).toBeTruthy();
    });

    it('should create skip and limit for page 1 with not perPage', () => {
      const paginationParams = paginateParams({
        page: 1,
        perPage: undefined,
      } as InputPaginationDto);
      expect(paginationParams.take).toBe(10);
      expect(paginationParams.skip).toBe(0);
    });

    it('should create skip and limit for not page and perPage 3', () => {
      const paginationParams = paginateParams({
        page: undefined,
        perPage: 3,
      } as InputPaginationDto);
      expect(paginationParams.take).toBe(3);
      expect(paginationParams.skip).toBe(0);
    });

    it('shoudl create a skip and limit when page and perPage are not defined', () => {
      const paginationParams = paginateParams({} as InputPaginationDto);
      expect(paginationParams.take).toBe(10);
      expect(paginationParams.skip).toBe(0);
    });

    it('should create skip and limit for page n with not perPage(10)', () => {
      const paginationParams = paginateParams({
        page: 2,
        perPage: undefined,
      } as InputPaginationDto);
      expect(paginationParams.take).toBe(10);
      expect(paginationParams.skip).toBe(10);
    });

    it('should create skip and limit for page 3 with perPage 8', () => {
      const paginationParams = paginateParams({
        page: 3,
        perPage: 8,
      });

      expect(paginationParams.take).toBe(8);
      expect(paginationParams.skip).toBe(16);
    });
  });
});
