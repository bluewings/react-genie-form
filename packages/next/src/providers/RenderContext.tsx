import React, { createContext, useMemo, useRef } from 'react';

const RenderContext = createContext<any>({});

const Provider = ({ renderNode: customRenderNode, formatError: customFormatError, children }: any) => {
  const renderNode = useMemo(
    () => (typeof customRenderNode === 'function' ? customRenderNode : DefaultRender),
    [customRenderNode],
  );

  const formatError = useMemo(
    () => (typeof customFormatError === 'function' ? customFormatError : DefaultFormatError),
    [customFormatError],
  );

  const value = useMemo(() => ({ renderNode, formatError }), [renderNode, formatError]);

  return (
    <RenderContext.Provider value={value}>{children}</RenderContext.Provider>
  );
};

export default RenderContext;

export { Provider };

const DefaultRender = ({ isArrayItem, depth, name, errors, Input, formatError }: any) => {
  const count = useRef(0);
  count.current++;
  return depth === 0 ? (
    <Input />
  ) : (
    <div>
      <label className="form-label">{name}</label>
      <Input className="form-control" />
      {errors?.length > 0 ? formatError(errors[0]) : null}
      {/* <pre>{JSON.stringify(errors, null, 2)}</pre> */}
    </div>
  );
};

const DefaultFormatError = (error: any) => {
  return (
    <em>{error?.message}</em>
  );
}