import './header.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faGear } from '@fortawesome/free-solid-svg-icons';

function Header () {
  const handleSwitchToHome = () => {

  };

  const handleSwitchToSettings = () => {

  };

  return (<header>
    <div className='header-logo' onClick={handleSwitchToHome}>
      <FontAwesomeIcon icon={faWallet}/>
      <span className='project-name'>Basic XRP Wallet</span>
    </div>
    <div className='header-settings' onClick={handleSwitchToSettings}>
      <FontAwesomeIcon icon={faGear}/>
    </div>
  </header>)
};

export default Header;
