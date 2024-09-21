import './main.scss';

import {Link } from 'react-router-dom';
import Balance from '../components/Balance';
import Transactions from '../components/Transactions';

import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTurnUp } from '@fortawesome/free-solid-svg-icons';

function Main() {
  return <div className='main'>
    <section className='action-buttons'>
      <Link to='/send'>
        <Button variant='primary'>
          <FontAwesomeIcon icon={faArrowTurnUp} />
          <span>Send XRP</span>
        </Button>
      </Link>
    </section>
    <section className='balance-containers'>
      <Balance />
    </section>
    <section className='transactions-container'>
      <Transactions />
    </section>
  </div>;
}

export default Main;
