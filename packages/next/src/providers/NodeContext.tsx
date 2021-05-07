import React, {
  ReactNode,
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Ajv } from 'ajv';
import { useConstant, useHandle } from '../hooks';
import { Schema, nodeFromSchema } from '../nodes';
import { transformErrors } from '../nodes/BaseNode';

const NodeContext = createContext<any>({});

interface INodeContextProvider {
  schema: Schema;
  defaultValue?: any;
  onChange?: (value: any) => void;
  onReady?: (rootNode: any) => void;
  children: ReactNode;
  ajv?: Ajv;
  errors?: any[];
}

const Provider = ({
  schema,
  defaultValue,
  onChange,
  onReady,
  children,
  ajv,
  errors,
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
        ajv,
        defaultValue: initialValue,
        onChange: handleChange,
      }),
    [schema, ajv, initialValue, handleChange],
  );
  useEffect(() => {
    if (typeof onReady === 'function') {
      onReady({ rootNode });
    }
  }, [rootNode]);

  const lastErrors = useRef<any>({});
  useEffect(() => {
    const currErrors = transformErrors(errors || []).reduce((accum: any, e) => {
      if (!accum[e.dataPath]) {
        accum[e.dataPath] = [];
      }
      accum[e.dataPath].push(e);
      return accum
    }, {});
    [...Object.keys(lastErrors.current), ...Object.keys(currErrors),]
      .filter((e, i, arr) => arr.indexOf(e) === i)
      .forEach(dataPath => {
        rootNode?.findNode(dataPath)?.setReceivedErrors(currErrors[dataPath] || []);
      });
    lastErrors.current = currErrors;
  }, [rootNode, errors]);

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
