import React, { createContext, useState } from 'react';

// Create the context
export const SearchContext = createContext();

// Provide the context to your component tree
export const SearchProvider = ({ children }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numPeople, setNumPeople] = useState(1);
  const [keyword, setKeyword] = useState('');

  return (
    <SearchContext.Provider
      value={{ startDate, setStartDate, endDate, setEndDate, numPeople, setNumPeople, keyword, setKeyword }}
    >
      {children}
    </SearchContext.Provider>
  );
};
