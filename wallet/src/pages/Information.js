import './information.scss';

import Table from 'react-bootstrap/Table';

import { useAccounts } from '../contexts/AccountContext';

const Information = () => {
  const { ledger } = useAccounts();

  const truncateHash = (hash) => {
    if (typeof hash !== 'string') return '';
    return `${hash.substring(0, 6)}....${hash.substring(hash.length - 16)}`;
  };

  return (
    <div className='ledgerInfoTable'>
      <Table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ledger Hash</td>
            <td>{truncateHash(ledger?.ledger_hash)}</td>
          </tr>
          <tr>
            <td>Ledger Index</td>
            <td>{ledger?.ledger_index}</td>
          </tr>
          <tr>
            <td>Transaction Count</td>
            <td>{ledger?.txn_count}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default Information;
