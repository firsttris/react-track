import * as t from 'common/types';

export const userMock: t.User = {
  id: '123456789',
  name: 'hans',
  code: '1234',
  role: t.UserRole.ADMIN,
  holidays: [],
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
