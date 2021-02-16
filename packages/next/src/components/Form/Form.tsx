import React, { ReactNode, forwardRef, useImperativeHandle } from 'react';
import FormGroup from '../FormGroup';
import FormInput from '../FormInput';
import FormRender from '../FormRender';
import NodeProxy from '../NodeProxy';
import { Schema } from '../../nodes';
import {
  FormTypesContextProvider,
  NodeContextProvider,
  RenderContextProvider,
} from '../../providers';

interface IFormProps {
  schema: Schema;
  defaultValue?: any;
  onChange?: (value: any) => void;
  formTypes?: any[];
  formTypeMap?: { [key: string]: Function };
  customRender?: Function;
  form?: Form[];
  children?: ReactNode;
  errors?: any[];
}

type Form = string | any;

function Form({
  schema,
  defaultValue,
  onChange,
  formTypes,
  formTypeMap,
  customRender,
  form,
  children,
  errors,
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
    <NodeContextProvider
      schema={schema}
      defaultValue={defaultValue}
      onChange={handleChange}
      onReady={handleReady}
      errors={errors}
    >
      <FormTypesContextProvider formTypes={formTypes} formTypeMap={formTypeMap}>
        <RenderContextProvider render={customRender}>
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
  );
}

const enhanced = forwardRef(Form) as Form;

enhanced.Input = FormInput;
enhanced.Group = FormGroup;
enhanced.Render = FormRender;

export default enhanced;
