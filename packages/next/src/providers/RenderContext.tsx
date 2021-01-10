import React, { createContext, useMemo, useRef } from 'react';

const RenderContext = createContext<any>({});

const Provider = ({ render: customRender, children }: any) => {
  const render = useMemo(
    () => (typeof customRender === 'function' ? customRender : DefaultRender),
    [customRender],
  );

  return (
    <RenderContext.Provider value={render}>{children}</RenderContext.Provider>
  );
};

export default RenderContext;

export { Provider };

const DefaultRender = ({ isArrayItem, depth, name, errors, Input }: any) => {
  const count = useRef(0);
  count.current++;
  return depth === 0 ? (
    <Input />
  ) : (
    <div>
      <label className="form-label">{name}</label>
      <Input className="form-control" />
      <pre>{JSON.stringify(errors, null, 2)}</pre>
    </div>
  );
};
