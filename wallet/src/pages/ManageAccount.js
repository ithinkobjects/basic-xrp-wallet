import './manage-account.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faTrash, faList } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useAccounts } from './../contexts/AccountContext';

function ManageAccount () {
  const { accounts, deleteAccount, selectAccount, initAccounts } = useAccounts();

  const handleSelectAccount = (account) => {
    selectAccount(account);
  };

  const handleDeleteAccount = (index) => {
    deleteAccount(index);
  };

  return (
    <div className='manage-accounts'>
      <h1>
        <FontAwesomeIcon icon={faList} />
        <span>My Accounts</span>
      </h1>

      <ul>
        {
          accounts.map((account, i) => 
            <li key={account.address}>
              <div className='address'>{account.address}</div>
              <div className='buttons-container'>
                <Button variant='primary' onClick={()=> handleSelectAccount(account)}>
                  <FontAwesomeIcon icon={faThumbsUp} />
                </Button>
                <Button variant='danger' onClick={() => handleDeleteAccount(i)}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
            </li>
          )
        }
      </ul>

      <div className='action-buttons'>
        <Link to='/import-account'>
          <Button variant='primary'>Import</Button>
        </Link>
        <Link to='/generate-account'>
          <Button variant='success'>Generate New</Button>
        </Link>
      </div>
    </div>
  );
};

export default ManageAccount;