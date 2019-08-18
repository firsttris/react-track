import * as t from 'types';

export const timestampMock: t.Timestamp[] = [
  {
    id: '1',
    time: '2017-06-15T01:15:00.000Z',
    actualTime: '2017-06-15T01:15:00.000Z',
    status: 'K',
    type: 'manuell'
  },
  {
    id: '2',
    time: '2017-06-15T04:00:00.000Z',
    actualTime: '2017-06-15T04:00:00.000Z',
    status: 'G',
    type: 'manuell'
  },
  {
    id: '3',
    time: '2017-06-15T14:19:31.225Z',
    actualTime: '2017-06-15T14:19:31.225Z',
    type: 'card',
    status: 'K'
  },
  {
    id: '4',
    time: '2017-06-15T15:00:00.000Z',
    actualTime: '2017-06-15T15:00:00.000Z',
    status: 'G',
    type: 'manuell'
  },
  {
    id: '5',
    time: '2017-06-15T19:29:54.535Z',
    actualTime: '2017-06-15T19:29:54.535Z',
    type: 'card',
    status: 'K'
  }
];

export const timestampMock2: t.Timestamp[] = [
  {
    id: '1',
    time: '2017-06-15T08:00:00.000Z',
    actualTime: '2017-06-15T08:00:00.000Z',
    status: 'K',
    type: 'manuell'
  },
  {
    id: '2',
    time: '2017-06-15T18:30:00.000Z',
    actualTime: '2017-06-15T18:30:00.000Z',
    status: 'G',
    type: 'manuell'
  }
];

export const timestampMock3: t.Timestamp[] = [
  {
    id: '1',
    time: '2017-10-15T01:15:00.000Z',
    actualTime: '2017-10-15T01:15:00.000Z',
    status: 'K',
    type: 'manuell'
  },
  {
    id: '2',
    time: '2017-10-15T04:00:00.000Z',
    actualTime: '2017-10-15T04:00:00.000Z',
    status: 'G',
    type: 'manuell'
  },
  {
    id: '3',
    time: '2017-10-15T14:19:31.225Z',
    actualTime: '2017-10-15T14:19:31.225Z',
    type: 'card',
    status: 'K'
  },
  {
    id: '4',
    time: '2017-10-15T15:00:00.000Z',
    actualTime: '2017-10-15T15:00:00.000Z',
    status: 'G',
    type: 'manuell'
  },
  {
    id: '5',
    time: '2017-10-15T19:29:54.535Z',
    actualTime: '2017-10-15T19:29:54.535Z',
    type: 'card',
    status: 'K'
  }
];

export const newTimestampMock: t.Timestamp = {
  id: '4',
  time: '2017-06-14T14:10:01.001Z',
  actualTime: '2017-06-14T14:10:01.001Z',
  status: 'G',
  type: 'auto'
};

export const timestampMock4: t.Timestamp[] = [
  {
    id: '1',
    time: '2017-06-14T14:01:01.001Z',
    actualTime: '2017-06-14T14:01:01.001Z',
    status: 'K',
    type: 'auto'
  },
  {
    id: '2',
    time: '2017-06-14T14:05:01.001Z',
    actualTime: '2017-06-14T14:05:01.001Z',
    status: 'G',
    type: 'auto'
  },
  {
    id: '3',
    time: '2017-06-14T14:08:01.001Z',
    actualTime: '2017-06-14T14:08:01.001Z',
    status: 'K',
    type: 'auto'
  },
  newTimestampMock
];

export const timestampMock5: t.Timestamp = {
  id: '1234567890',
  time: '2017-12-11T08:00:00+01:00',
  actualTime: '2017-12-11T08:00:00+01:00',
  type: 'card',
  status: 'K'
};
