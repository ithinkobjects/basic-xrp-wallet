import './transaction.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';

function Transaction (props) {
  const tx = props.transaction;

  const truncateAddress = (address) => {
    if (typeof address !== 'string') return '';
    if (address.length <= 22) return address;
    return `${address.substring(0, 6)}....${address.substring(address.length - 16)}`;
  };

  const transactionResult = (result) => {
    return result === 'tesSUCCESS' ?
      <>
        <FontAwesomeIcon icon={faThumbsUp} className='status-ok'/>
      </> :
      <>
        <span className='status-warning'>
          {friendlyWarning(result)}
        </span>
      </>;
  };

  const friendlyWarning = (result) => {
    switch(result) {
      case 'tecUNFUNDED_PAYMENT':
        return 'Insufficient funds';
      // Add more warnings over time
      default:
        return result;
    }
  };

  const explorerLink = (hash) => {
    return (
      <Button
        href={`https://testnet.xrpl.org/transactions/${hash}`}
        target='_blank'
        className='view-on-explorer'
      >
        <FontAwesomeIcon icon={faArrowRight} />
      </Button>
    )
  };

  return (
    <div className='row'>
      <div className='col-3'>{tx.direction}</div>
      <div className='col-9'>{tx.amount} XRP</div>

      <div className='col-3'>
        {tx.direction === 'Sent' ? 'To' : 'From'}
      </div>
      <div className='col-9'>
        {truncateAddress(tx.account)}
      </div>

      <div className='col-3'>On</div>
      <div className='col-9'>{tx.date.toLocaleString()}</div>

      <div className='col-3'>Status</div>
      <div className='col-9'>
        {transactionResult(tx.transactionResult)}
      </div>

      <div className='col-3'>On</div>
      <div className='col-9'>{explorerLink(tx.hash)}</div>
    </div>
  );
};

export default Transaction;
