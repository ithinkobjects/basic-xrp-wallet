import './main.scss';

import { useState } from 'react';
import {Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Balance from '../components/Balance';
import Transactions from '../components/Transactions';
import { useAccounts } from '../contexts/AccountContext';

import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTurnUp, faArrowTurnDown } from '@fortawesome/free-solid-svg-icons';

function Main() {
  const { selectedAccount } = useAccounts();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleRequestXrp = () => {
    setModalIsOpen(true);
  };

  const hideModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <div className='main'>
        <section className='action-buttons'>
          <Link to='/send'>
            <Button variant='primary'>
              <FontAwesomeIcon icon={faArrowTurnUp} />
              <span>Send XRP</span>
            </Button>
          </Link>
          <Button variant='primary' onClick={handleRequestXrp}>
            <FontAwesomeIcon icon={faArrowTurnDown} />
            <span>Receive</span>
          </Button>
        </section>
        <section className='balance-containers'>
          <Balance />
        </section>
        <section className='transactions-container'>
          <Transactions />
        </section>
      </div>
      {
        modalIsOpen ?
        <Modal show={modalIsOpen} onHide={hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Receive XRP</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Give the sender this address</strong></p>
            <p>{selectedAccount?.address}</p>
          </Modal.Body>
        </Modal> : null
      }
    </>
  );
}

export default Main;
