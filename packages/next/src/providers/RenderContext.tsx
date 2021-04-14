import React, { createContext, useMemo, useRef } from 'react';

const RenderContext = createContext<any>({});

const Provider = ({ renderNode: customRenderNode, formatError: customFormatError, showError: _showError, children }: any) => {
  const renderNode = useMemo(
    () => (typeof customRenderNode === 'function' ? customRenderNode : DefaultRender),
    [customRenderNode],
  );

  const formatError = useMemo(
    () => (typeof customFormatError === 'function' ? customFormatError : DefaultFormatError),
    [customFormatError],
  );

  const showError = useMemo(() => {
    let always = false;
    let never = false;
    let checkDirty = false;
    let checkTouched = false;
    if (_showError === true) {
      always = true;
    } else if (_showError === true) {
      never = true;
    } else if (typeof _showError === 'string') {
      _showError.split(/[^a-z]+/).forEach(e => {
        if (e === 'dirty') {
          checkDirty = true;
        }
        if (e === 'touched') {
          checkTouched = true;
        }
      })
    }
    return ({ dirty, touched }: any) => {
      if (always) {
        return true;
      } else if (never) {
        return false;
      } else if (checkDirty && !dirty) {
        return false;
      } else if (checkTouched && !touched) {
        return false;
      }
      return true;
    };
  }, [_showError]);

  const value = useMemo(() => ({ renderNode, formatError, showError }), [renderNode, formatError, showError]);

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