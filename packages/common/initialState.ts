import * as t from 'common/types';

export const initialUserState: t.User = {
  id: '',
  name: '',
  holidays: [],
  code: '',
  token: '',
  role: t.UserRole.GUEST,
  workTimes: {
    monday: { startTime: '00:00', endTime: '00:00', mandatoryHours: '00:00' },
    tuesday: { startTime: '00:00', endTime: '00:00', mandatoryHours: '00:00' },
    wednesday: { startTime: '00:00', endTime: '00:00', mandatoryHours: '00:00' },
    thursday: { startTime: '00:00', endTime: '00:00', mandatoryHours: '00:00' },
    friday: { startTime: '00:00', endTime: '00:00', mandatoryHours: '00:00' },
    saturday: { startTime: '00:00', endTime: '00:00', mandatoryHours: '00:00' },
    sunday: { startTime: '00:00', endTime: '00:00', mandatoryHours: '00:00' }
  },
  startDate: '',
  saldos: []
};

export const initialLicenseState: t.License = { key: '0', validUntil: '', userLimit: '1' };
