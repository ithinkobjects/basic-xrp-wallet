import './import-account.scss';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Wallet } from 'xrpl';
import { useAccounts } from '../contexts/AccountContext';
import { useNavigate } from 'react-router-dom';

function ImportAccount () {
  const [seed, setSeed] = useState('');
  const { addAccount } = useAccounts();
  const navigate = useNavigate();

  const handleSeedChange = (e) => {
    setSeed(e.target.value);
  };

  const handleImport = (e) => {
    e.preventDefault();
    
    // Derive the address from the imported family seed
    const newAccount = Wallet.deriveWallet(seed);

    // Create new account object to store state
    const account = {
      address: newAccount.classicAddress,
      seed: newAccount.seed,
    };

    // Update the app state
    addAccount(account);

    // Navigate back to manage accounts page
    navigate('/manage-account');
  };

  return (
    <div className='import-account'>
      <Form onSubmit={handleImport}>
        <h1>
          <FontAwesomeIcon icon={faFileImport} />
          <span>Import Account</span>
        </h1>

        <Form.Group className='seed-container' controlId='formImportSeed'>
          <Form.Label>Family Seed</Form.Label>
          <Form.Control type='text' value={seed} onChange={handleSeedChange} required></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary'>Import</Button>
      </Form>
    </div>
  );
};

export default ImportAccount;
