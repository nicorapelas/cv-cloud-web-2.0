import React, { useReducer, createContext, useMemo } from 'react';

const createDataContext = (reducer, actions, defaultValue) => {
  const Context = createContext();

  const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, defaultValue);

    const boundActions = useMemo(() => {
      const actionsObj = {};
      for (let key in actions) {
        actionsObj[key] = actions[key](dispatch);
      }
      return actionsObj;
    }, []);

    // Memoize the entire provider value to prevent unnecessary re-renders
    const value = useMemo(
      () => ({ state, ...boundActions }),
      [state, boundActions]
    );

    return (
      <Context.Provider value={value}>
        {children}
      </Context.Provider>
    );
  };

  return { Context, Provider };
};

export default createDataContext;
