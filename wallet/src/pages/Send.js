import './send.scss';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { useAccounts } from './../contexts/AccountContext';
import Spinner from './../components/Spinner';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTurnUp } from '@fortawesome/free-solid-svg-icons';


const Send = () => {
  const { sendXrp } = useAccounts();
  const [amount, setAmount] = useState();
  const [destination, setDestination] = useState('');
  const [destinationTag, setDestinationTag] = useState();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSendXrp = async (e) => {
    e.preventDefault();
    setShowModal(true);

    try {
       await sendXrp(amount, destination, destinationTag);

    } catch (error) {
      console.log(error);

    } finally {
      setShowModal(false);
      navigate('/');
    }
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  }

  const handleDestinationTagChange = (e) => {
    setDestinationTag(e.target.value);
  }

  return (
    <>
      <div className='send'>
        <h1>
          <FontAwesomeIcon icon={faArrowTurnUp} />
          <span>Send XRP</span>
        </h1>

        <Form onSubmit={handleSendXrp}>
          <Form.Group className='form-group' controlId='amount'>
            <Form.Label>Amount (XRP)</Form.Label>
            <Form.Control value={amount} type='text' placeholder='Amount of XRP to send' required onChange={handleAmountChange}></Form.Control>
          </Form.Group>

          <Form.Group className='form-group' controlId='destination'>
            <Form.Label>Destination Address</Form.Label>
            <Form.Control value={destination} type='text' placeholder='Destination address to send XRP to' required onChange={handleDestinationChange}></Form.Control>
          </Form.Group>

          <Form.Group className='form-group' controlId='destinationTag'>
            <Form.Label>Destination Tag</Form.Label>
            <Form.Control value={destinationTag} type='text' placeholder='Destination tag to send XRP to' onChange={handleDestinationTagChange}></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary'>Send XRP</Button>
        </Form>
      </div>

      <Modal show={showModal}>
        <Modal.Header>Sending a payment of {amount} XRP</Modal.Header>
        <Modal.Body>
          <p>Destination: {destination}</p>
          {destination && <p>Destination Tag: {destinationTag}</p>}
          <Spinner />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Send;
