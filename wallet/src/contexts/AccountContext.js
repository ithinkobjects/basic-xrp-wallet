import { Client, dropsToXrp } from 'xrpl';
import { createContext, useContext, useState, useEffect, useCallback } from "react";

// Create a context
const AccountContext = createContext();

// Provider component
export const AccountProvider = ({children}) => {
  const [selectedAccount, setSelectedAccount] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState();
  const [reserve, setReserve] = useState();

  useEffect(() => {
    const storedDefault = JSON.parse(localStorage.getItem('selectedAccount'));
    const storedAccounts = JSON.parse(localStorage.getItem('accounts'));

    if (storedDefault) {
      setSelectedAccount(storedDefault);
    };
    if (storedAccounts) {
      setAccounts(storedAccounts);
    };

    
    const getCurrentReserve = async () => {
      const client = new Client(process.env.REACT_APP_NETWORK);
      await client.connect();

      try {
        const res = await client.request({
          command: 'server_info',
        });

        const reserve = res.result.info.validated_ledger.reserve_base_xrp;
        setReserve(reserve);

      } catch (error) {
        console.log(error);
      } finally {
        client.disconnect();
      }
    }

    getCurrentReserve();
  }, []);

  const _getBalance = useCallback(async (account) => {
    if (account) {
      // Create XRPL connection
      const client = new Client(process.env.REACT_APP_NETWORK);
      await client.connect();
      // Get account balance from latest ledger
        // Disconnect
      try {
        const res = await client.request({
          command: 'account_info',
          account: account.address,
          ledger_index: 'validated', // = most recent; optional: specify index
        });

        // Convert balance from drops to XRP
        setBalance(dropsToXrp(res.result.account_data.Balance));

      } catch (error) {
        console.log(error);
        setBalance();
      } finally {
        client.disconnect();
      }

    }
  }, []);

  useEffect(() => {
    _getBalance(selectedAccount);
  }, [selectedAccount, _getBalance]); // Use selectedAccount and re-run on change

  const refreshBalance = () => {
    _getBalance(selectedAccount);
    return balance;
  }

  const selectAccount = (account) => {
    localStorage.setItem('selectedAccount', JSON.stringify(account));
    setSelectedAccount(account);
  };

  const addAccount = (account) => {
    setAccounts((prev) => {
      for (let i = 0; i < prev.length; i++) {
        let prevAccount = prev[i];
        if (prevAccount.address.toLowerCase() === account.address.toLowerCase()) {
          console.log('Duplicate account wasnt added.');
          return prev;
        }
      };

      const updatedAccounts = [...prev, account];
      localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
      return updatedAccounts;
    });
  };

  const deleteAccount = (index) => {
    setAccounts((prev) => {
      const updatedAccounts = prev.filter((account, i) => {
        if (i !== index) {
          return true;
        }
      });

      localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
      return updatedAccounts;
    });
  };

  return (
    <AccountContext.Provider value={{
        accounts, reserve, balance,
        addAccount, deleteAccount, selectAccount, refreshBalance
      }}>
      {children}
    </AccountContext.Provider>
  )
};

// Custom hook
export const useAccounts = () => useContext(AccountContext);
