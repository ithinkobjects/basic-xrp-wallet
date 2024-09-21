import './transactions.scss';

import Transaction from './Transaction';
import { useAccounts } from '../contexts/AccountContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';

const Transactions = () => {
  const { transactions, refreshTransactions } = useAccounts();

  const handleTransactionsRefresh = () => {
    refreshTransactions();
  };

  return (
    <div className='transactions'>
      <label>
        Transactions
        <FontAwesomeIcon
          icon={faRefresh}
          onClick={handleTransactionsRefresh}
        />
      </label>
      <ul>
        {transactions.map((tx, i) => 
          <li key={i}>
            <Transaction transaction={tx} />
          </li>
        )}
      </ul>
    </div>
  );
};

export default Transactions;
