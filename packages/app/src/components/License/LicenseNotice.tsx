import * as React from 'react';
import * as t from 'common/types';
import { useIntl } from 'react-intl';
import * as moment from 'moment';

interface Props {
  license: t.License;
}

export const LicenseNotice = ({ license }: Props) => {
  const intl = useIntl();

  if (!license || !license.validUntil) {
    return <div />;
  }

  const validUntil = new Date(license.validUntil);
  const diff = validUntil.getTime() - new Date().getTime();
  if (diff <= 0) {
    return (
      <div style={{ backgroundColor: '#D12D25', padding: '10px', textAlign: 'center' }}>
        {intl.formatMessage({ id: 'LICENSE_EXPIRED' })}
      </div>
    );
  }

  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  if (diff <= oneWeek) {
    return (
      <div style={{ backgroundColor: '#F3A83B', padding: '10px', textAlign: 'center' }}>
        {intl.formatMessage({ id: 'LICENSE_WILL_EXPIRE' }) + moment(license.validUntil).format('L')}
      </div>
    );
  }

  return <div />;
};
