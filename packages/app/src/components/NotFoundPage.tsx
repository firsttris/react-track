import * as React from 'react';
import { Link } from 'react-router-dom';
const Unicorn = require('assets/images/NotFound/unicorn-small.png');
const Lines = require('assets/images/backgrounds/lines.png');

export class NotFoundPage extends React.Component<{}, {}> {
  render(): JSX.Element {
    return (
      <div
        style={{
          textAlign: 'center',
          fontFamily: 'monospace',
          backgroundImage: `url(${Lines})`,
          position: 'absolute',
          width: '100%',
          height: '100%',
          paddingTop: '100px'
        }}
      >
        <img src={Unicorn} alt="Not Found" style={{ marginTop: '50px', marginBottom: '50px', height: '200px' }} />
        <h2>Looks like something went wrong!</h2>
        <div>Page not found, try refreshing.</div>
        <div>If the problem persists feel free to contact us.</div>
        <div>
          <div className="spacer" style={{ height: '80px' }} />
          <div>
            <b>Contact:</b>
          </div>
          <div>
            <a href="https://www.teufel-it.de">www.teufel-it.de</a>
          </div>
          <div>
            <a href="mailto:info@teufel-it.de">info@teufel-it.de</a>
          </div>
          <br />
          <Link to="/" className="btn btn-secondary">
            Start
          </Link>
        </div>
      </div>
    );
  }
}
