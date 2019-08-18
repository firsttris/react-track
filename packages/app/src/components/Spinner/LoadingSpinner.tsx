import * as React from 'react';

const style: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  marginLeft: '-40px',
  marginTop: '-40px'
};

export const LoadingSpinner = () => <i style={style} className="fa fa-spinner fa-pulse fa-5x" />;
