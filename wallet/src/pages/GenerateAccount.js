import './generate-account.scss';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccounts } from '../contexts/AccountContext';
import { Wallet } from 'xrpl';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';

function GenerateAccount () {
  const [seed, setSeed] = useState('');
  const [address, setAddress] = useState('');
  const { addAccount } = useAccounts();
  const navigate = useNavigate();

  const handleGenerateAccount = () => {
    const newWallet = Wallet.generate();
    setSeed(newWallet.seed);
    setAddress(newWallet.classicAddress);
  }

  const handleSaveAccount = () => {
    const account = {
      address: address,
      seed: seed,
    };

    addAccount(account);
    navigate('/manage-account');
  };

  const handleCancel = () => {
    setSeed('');
  };

  return (
    <div className='generate-account'>
      {seed ? (
        <>
          <h1>
            <FontAwesomeIcon icon={faCirclePlus}/>
            <span>Save Account</span>
          </h1>

          <div className='account-container'>
            <label>Address</label>
            <div>{address}</div>
            <label>Seed</label>
            <div>{seed}</div>
          </div>

          <div className='action-button'>
            <Button variant='primary' onClick={handleSaveAccount}>Save To Wallet</Button>
            <Button variant='secondary' onClick={handleCancel}>Cancel</Button>
          </div>
        </>
      ) : (
        <>
          <h1>
            <FontAwesomeIcon icon={faFloppyDisk}/>
            <span>GenerateAccount</span>
          </h1>
          <p>
            Click Generate to create a new seed and rAddress.
            Click save to add the them to your account.
            The XRPL account wont be active until its funded with minimum reserve requirement.
          </p>
          <Button variant='primary' onClick={handleGenerateAccount}>Generate</Button>
        </>
      )}
    </div>
  );
};

export default GenerateAccount;
