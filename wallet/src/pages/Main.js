import './main.scss';

import Balance from '../components/Balance';

function Main() {
  return <div className='main'>
    <section className='action-buttons'></section>
    <section className='balance-containers'>
      <Balance />
    </section>
    <section className='transactions-container'></section>
  </div>;
}

export default Main;
