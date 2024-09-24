import { Client, Wallet, dropsToXrp, xrpToDrops } from 'xrpl';
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { ToastManager } from './../components/Toast'

// Create a context
const AccountContext = createContext();

// Provider component
export const AccountProvider = ({children}) => {
  const client = useRef();
  const [selectedAccount, setSelectedAccount] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState();
  const [reserve, setReserve] = useState();
  const [transactions, setTransactions] = useState([]);

  const _getBalance = useCallback(async (account) => {
    if (account) {
      // Create XRPL connection
      const client = new Client(process.env.REACT_APP_NETWORK);
      await client.connect();
      // Get account balance from latest ledger
        // Disconnect
      try {
        const res = await client.request({
          account: account.address,
          command: 'account_info',
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

  const _getTransactions = useCallback(async (account) => {
    if (account) {
      const client = new Client(process.env.REACT_APP_NETWORK);
      await client.connect();

      try {
        const res = await client.request({
          account: account.address,
          command: 'account_tx',
          ledger_index_min: -1, // Get tx from specified time period
          ledger_index_max: -1, // Get tx to specified period end
          limit: 20, // Limit of tx to fetch
          forward: false, // Returns from newest to oldest
        });

        const filteredTxs = res.result.transactions.filter(tx => {
          // If Tx is a XRP payment tx, return true
          if (tx.tx_json.TransactionType !== 'Payment') {
            return false;
          };
          return typeof tx.meta.delivered_amount === 'string';
        }).map((tx) => {
          return {
            account: tx.tx_json.Account,
            destination: tx.tx_json.Destination,
            hash: tx.hash,
            direction: tx.tx_json.Account === account.address ? 'Sent' : 'Received',
            date: new Date((tx.tx_json.date + 946684800) * 1000),
            transactionResult: tx.meta.TransactionResult,
            amount: tx.meta.TransactionResult === 'tesSUCCESS' ?
              dropsToXrp(tx.meta?.delivered_amount) : 0,
          };
        });

        setTransactions(filteredTxs);

      } catch (error) {
        console.log(error);
        setTransactions([]);
      } finally {
        client.disconnect();
      };
    };
  }, []);

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

  useEffect(() => {
    if (!client.current) {
      client.current = new Client(process.env.REACT_APP_NETWORK);
    };

    const onTransaction = async (e) => {
      if (e.meta.TransactionResult === 'tesSUCCESS') {
        if (e.tx_json.Account === selectedAccount.address) {
          ToastManager.addToast(`Successfully sent ${dropsToXrp(e.meta.delivered_amount)} XRP`)
        } else if (e.tx_json.Destination === selectedAccount.address) {
          ToastManager.addToast(`Successfully received ${dropsToXrp(e.meta.delivered_amount)} XRP`);
        }
      } else {
        ToastManager.addToast('Failed');
      };
      _getBalance(selectedAccount);
      _getTransactions(selectedAccount);
    };
  
    const listenToAccount = async () => {
      try {
        if (!client.current.isConnected()) await client.current.connect();
        client.current.on('transaction', onTransaction);
        await client.current.request({
          command: 'subscribe', // Can sub to arr of accounts
          accounts: [selectedAccount?.address],
        });
      } catch (error) {
        console.log(error);
      }
    };

    selectedAccount && listenToAccount();
    _getBalance(selectedAccount);
    _getTransactions(selectedAccount);

    return () => {
      if (client.current.isConnected()) {
        (async () => {
          client.current.removeListener('transaction', onTransaction);
          await client.current.request({
            command: 'unsubscribe',
            accounts:[selectedAccount.address]
          });
        })();
      };
    };

  }, [selectedAccount, _getBalance, _getTransactions]); // Use selectedAccount and re-run on change

  useEffect(() => {
    if (!client.current) {
      client.current = new Client(process.env.REACT_APP_NETWORK);
    };

    const handleLedgerStream = async (e) => {
      console.log(e);
    };

    
    const listenToLedger = async () => {
      try {
        if (!client.current.isConnected()) await client.current.connect();
        client.current.on('ledgerClosed', handleLedgerStream);
        await client.current.request({
          command: 'subscribe',
        });
      } catch (error) {
        console.log(error);
      }
    }

    listenToLedger();
  }, []);


  const refreshBalance = () => {
    _getBalance(selectedAccount);
    return balance;
  }

  const refreshTransactions = () => {
    _getTransactions(selectedAccount);
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

  const sendXrp = async (amount, destination, destinationTag) => {
    if (!selectedAccount) throw new Error('No wallet selected');

    const wallet = Wallet.fromSeed(selectedAccount.seed);
    const client = new Client(process.env.REACT_APP_NETWORK);
    await client.connect();

    try {
      const payment = {
        TransactionType: 'Payment',
        Account: selectedAccount.address,
        Amount: xrpToDrops(amount),
        Destination: destination,
      };

      if (destinationTag) {
        payment.DestinationTag = parseInt(destinationTag);
      };

      const preparedTx = await client.autofill(payment);
      const signedTx = wallet.sign(preparedTx);
      await client.submitAndWait(signedTx.tx_blob);

    } catch (error) {
      console.log(error);
      
    } finally {
      await client.disconnect();
      refreshBalance(selectedAccount);
      refreshTransactions(selectedAccount);
    }
  };

  return (
    <AccountContext.Provider value={{
        accounts, reserve, balance, transactions, selectedAccount,
        addAccount, deleteAccount, selectAccount, refreshBalance,
        refreshTransactions, sendXrp,
      }}>
      {children}
    </AccountContext.Provider>
  )
};

// Custom hook
export const useAccounts = () => useContext(AccountContext);
