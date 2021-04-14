import React, { ReactNode, forwardRef, useImperativeHandle, useMemo } from 'react';
import FormGroup from '../FormGroup';
import FormInput from '../FormInput';
import FormRender from '../FormRender';
import NodeProxy from '../NodeProxy';
import { Schema } from '../../nodes';
import {
  FormTypesContextProvider,
  NodeContextProvider,
  RenderContextProvider,
  UserDefinedContextProvider,
} from '../../providers';

interface IFormProps {
  schema: Schema;
  defaultValue?: any;
  onChange?: (value: any) => void;
  formTypes?: any[];
  formTypeMap?: { [key: string]: Function };
  customRender?: Function;
  formatError?: Function;
  form?: Form[];
  children?: ReactNode;
  errors?: any[];
  showError?: any;
  context?: { [key: string]: any };
}

type Form = string | any;

function Form({
  schema,
  defaultValue,
  onChange,
  formTypes,
  formTypeMap,
  customRender,
  formatError,
  form,
  children,
  errors,
  showError = 'dirty+touched',
  context,
}: IFormProps, ref: any) {
  const [value, setValue] = React.useState<any>({});
  const handleChange = (value: any) => {
    setValue(value);
    if (typeof onChange === 'function') {
      onChange(value);
    }
  };

  const [rootNode, setRootNode] = React.useState<any>();
  const handleReady = (data: any) => {
    setRootNode(data?.rootNode);
  }

  useImperativeHandle(ref, () => ({
    node: rootNode,
  }), [rootNode]);

  return (
    <UserDefinedContextProvider context={context}>
      <NodeContextProvider
        schema={schema}
        defaultValue={defaultValue}
        onChange={handleChange}
        onReady={handleReady}
        errors={errors}
      >
        <FormTypesContextProvider formTypes={formTypes} formTypeMap={formTypeMap}>
          <RenderContextProvider renderNode={customRender} formatError={formatError} showError={showError}>
            {children ? children : <NodeProxy path="" form={form} />}
            {/* <table>
            <tbody>
              <tr>
                <td valign="top">
                  {children ? children : <NodeProxy path="" form={form} />}
                </td>
                <td valign="top">
                  <pre>{JSON.stringify(value, null, 2)}</pre>
                </td>
              </tr>
            </tbody>
          </table> */}
          </RenderContextProvider>
        </FormTypesContextProvider>
      </NodeContextProvider>
    </UserDefinedContextProvider>
  );
}

const enhanced = forwardRef(Form) as Form;

enhanced.Input = FormInput;
enhanced.Group = FormGroup;
enhanced.Render = FormRender;

export default enhanced;
