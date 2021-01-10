import React, {
  ReactNode,
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useConstant, useHandle } from '../hooks';
import { Schema, nodeFromSchema } from '../nodes';

const NodeContext = createContext<any>({});

interface INodeContextProvider {
  schema: Schema;
  defaultValue?: any;
  onChange?: (value: any) => void;
  children: ReactNode;
}

const Provider = ({
  schema,
  defaultValue,
  onChange,
  children,
}: INodeContextProvider) => {
  const initialValue = useConstant(defaultValue);

  const [value, setValue] = useState(() => initialValue);
  const handleChange = useHandle((value: any) => {
    setValue(value);
  });

  const isFirstRun = useRef(true);
  const emitChange = useHandle(onChange);
  useEffect(() => {
    if (isFirstRun.current === true) {
      if (initialValue !== value) {
        emitChange(value);
      }
    } else {
      emitChange(value);
    }
    isFirstRun.current = false;
  }, [emitChange, initialValue, value]);

  const rootNode = useMemo(
    () =>
      nodeFromSchema(schema, {
        defaultValue: initialValue,
        onChange: handleChange,
      }),
    [schema, initialValue, handleChange],
  );

  return (
    <NodeContext.Provider value={rootNode}>
      {children}
      {/* <table>
        <tbody>
          <tr>
            <td valign="top">{children}</td>
            <td valign="top">
              <pre>{JSON.stringify(value, null, 2)}</pre>
            </td>
          </tr>
        </tbody>
      </table> */}
    </NodeContext.Provider>
  );
};

export default NodeContext;

export { Provider };
