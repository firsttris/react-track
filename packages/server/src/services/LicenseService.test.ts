import { LicenseService } from './LicenseService';
import { SettingsCollection } from '../collections/SettingsCollection';
import { LicenseErrorKeys } from '../errorKeys';
import { UserCollection } from '../collections/UserCollection';
import * as m from 'common/mocks';

describe('License Service Test', () => {
  describe('checkLicenseValidity()', () => {
    describe('unprotected operation', () => {
      beforeEach(() => {
        jest.spyOn(LicenseService, 'isProtectedOperation').mockImplementation(() => false);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should not throw error if license is not valid anymore', () => {
        const license = { key: '1', userLimit: '', validUntil: '2019-01-01' };
        SettingsCollection.getLicense = jest.fn(() => Promise.resolve(license));

        expect(async () => {
          await LicenseService.checkLicenseValidity('operation');
        }).not.toThrow();
      });

      it('should not throw error if license user limit is exceeded', () => {
        const license = { key: '1', userLimit: '1', validUntil: '' };
        SettingsCollection.getLicense = jest.fn(() => Promise.resolve(license));
        UserCollection.getUsers = jest.fn(() => Promise.resolve([m.userMock, m.userMock]));

        expect(async () => {
          await LicenseService.checkLicenseValidity('operation');
        }).not.toThrow();
      });

      it('should not throw error if user will be created and license user limit will be exceeded', () => {
        const license = { key: '1', userLimit: '1', validUntil: '' };
        SettingsCollection.getLicense = jest.fn(() => Promise.resolve(license));
        UserCollection.getUsers = jest.fn(() => Promise.resolve([m.userMock]));

        expect(async () => {
          await LicenseService.checkLicenseValidity('CreateUser');
        }).not.toThrow();
      });
    });

    describe('protected operation', () => {
      beforeEach(() => {
        jest.spyOn(LicenseService, 'isProtectedOperation').mockImplementation(() => true);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should throw error if license is not valid anymore', async () => {
        const license = { key: '1', userLimit: '', validUntil: '2019-01-01' };
        SettingsCollection.getLicense = jest.fn(() => Promise.resolve(license));

        try {
          await LicenseService.checkLicenseValidity('operation');
        } catch (error) {
          expect(error.message).toEqual(LicenseErrorKeys.LICENSE_EXPIRED);
        }
      });

      it('should throw error if license user limit is exceeded', async () => {
        const license = { key: '1', userLimit: '1', validUntil: '' };
        SettingsCollection.getLicense = jest.fn(() => Promise.resolve(license));
        UserCollection.getUsers = jest.fn(() => Promise.resolve([m.userMock, m.userMock]));

        try {
          await LicenseService.checkLicenseValidity('operation');
        } catch (error) {
          expect(error.message).toEqual(LicenseErrorKeys.LICENSE_USER_LIMIT_EXCEEDED);
        }
      });

      it('should throw error if user will be created and license user limit will be exceeded', async () => {
        const license = { key: '1', userLimit: '1', validUntil: '' };
        SettingsCollection.getLicense = jest.fn(() => Promise.resolve(license));
        UserCollection.getUsers = jest.fn(() => Promise.resolve([m.userMock]));

        try {
          await LicenseService.checkLicenseValidity('CreateUser');
        } catch (error) {
          expect(error.message).toEqual(LicenseErrorKeys.LICENSE_USER_LIMIT_EXCEEDED);
        }
      });

      it('should not throw error if user limit and validity is not exceeded', () => {
        const license = { key: '1', userLimit: '1', validUntil: '' };
        SettingsCollection.getLicense = jest.fn(() => Promise.resolve(license));
        UserCollection.getUsers = jest.fn(() => Promise.resolve([m.userMock]));

        expect(async () => {
          await LicenseService.checkLicenseValidity('operation');
        }).not.toThrow();
      });
    });
  });

  describe('isProtectedOperation()', () => {
    it('should return true if operation is protected', () => {
      expect(LicenseService.isProtectedOperation('LoadPublicHolidays')).toBe(true);
      expect(LicenseService.isProtectedOperation('GetStatisticForDate')).toBe(true);
      expect(LicenseService.isProtectedOperation('GetStatisticForWeek')).toBe(true);
      expect(LicenseService.isProtectedOperation('GetStatisticForMonth')).toBe(true);
      expect(LicenseService.isProtectedOperation('GetEvaluationForMonth')).toBe(true);
      expect(LicenseService.isProtectedOperation('GetEvaluationForUsers')).toBe(true);
      expect(LicenseService.isProtectedOperation('CreateUser')).toBe(true);
      expect(LicenseService.isProtectedOperation('UpdateUser')).toBe(true);
      expect(LicenseService.isProtectedOperation('UpdateWorkTimeSettings')).toBe(true);
      expect(LicenseService.isProtectedOperation('UpdateAllUserWorkTimesById')).toBe(true);
      expect(LicenseService.isProtectedOperation('UpdateTimestamps')).toBe(true);
      expect(LicenseService.isProtectedOperation('CreateLeave')).toBe(true);
      expect(LicenseService.isProtectedOperation('DeleteLeave')).toBe(true);
      expect(LicenseService.isProtectedOperation('UpdateComplains')).toBe(true);
      expect(LicenseService.isProtectedOperation('CreatePause')).toBe(true);
      expect(LicenseService.isProtectedOperation('DeletePause')).toBe(true);
      expect(LicenseService.isProtectedOperation('CreatePublicHoliday')).toBe(true);
      expect(LicenseService.isProtectedOperation('DeletePublicHoliday')).toBe(true);
      expect(LicenseService.isProtectedOperation('RewriteTimestamps')).toBe(true);
    });

    it('should return false if operation is not protected', () => {
      expect(LicenseService.isProtectedOperation('')).toBe(false);
      expect(LicenseService.isProtectedOperation('anythingelse')).toBe(false);
    });
  });
});
