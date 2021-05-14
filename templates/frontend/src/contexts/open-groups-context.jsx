import React, { useContext, useReducer } from 'react';

export const OpenGroupsContext = React.createContext({
  openGroups: [],
  openGroup: () => {},
  closeGroup: () => {},
});

const initialState = [];

const openGroupsReducer = (state, action) => {
  switch (action.type) {
    case 'openGroup': {
      if (state.includes(action.groupId)) {
        return state;
      }
      return [...state, action.groupId];
    }
    case 'closeGroup': {
      return state.filter((item) => item !== action.groupId);
    }
    default:
      return state;
  }
};

export const OpenGroupsProvider = ({ children }) => {
  const [openGroups, dispatch] = useReducer(openGroupsReducer, initialState);

  const contextValue = {
    openGroups,
    openGroup: (groupId) => dispatch({ type: 'openGroup', groupId }),
    closeGroup: (groupId) => dispatch({ type: 'closeGroup', groupId }),
  };

  return <OpenGroupsContext.Provider value={contextValue}>{children}</OpenGroupsContext.Provider>;
};

export const useOpenGroups = () => useContext(OpenGroupsContext);
