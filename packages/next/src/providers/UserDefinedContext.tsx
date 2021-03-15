import React, { ReactNode, createContext, useMemo } from 'react';

const UserDefinedContext = createContext<any>({});

interface INodeContextProvider {
  context: any;
  children: ReactNode;
}

const Provider = ({
  context,
  children,
}: INodeContextProvider) => {

  const rootNode = useMemo(() => {
    return { context: context || {} };
  }, [context]);

  return (
    <UserDefinedContext.Provider value={rootNode}>
      {children}
    </UserDefinedContext.Provider>
  );
};

export default UserDefinedContext;

export { Provider };
