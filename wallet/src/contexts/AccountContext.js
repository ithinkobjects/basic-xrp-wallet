import { createContext, useContext, useState } from "react";

// Create a context
const AccountContext = createContext();

// Provider component
export const AccountProvider = ({children}) => {
  const [accounts, setAccounts] = useState([]);

  const addAccount = (account) => {
    // setAccounts(({prev}) => [...prev, account]);
    setAccounts((prev) => {
      const updatedAccounts = [...prev, account];
      localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
      return updatedAccounts;
    });
  };

  return (
    <AccountContext.Provider value={{accounts, addAccount}}>
      {children}
    </AccountContext.Provider>
  )
};

// Custom hook
export const useAccounts = () => useContext(AccountContext);
