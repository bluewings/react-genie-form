import React, { ReactNode } from 'react';
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
}: IFormProps) {
  const [value, setValue] = React.useState<any>({});
  const handleChange = (value: any) => {
    setValue(value);
    if (typeof onChange === 'function') {
      onChange(value);
    }
  };
  return (
    <NodeContextProvider
      schema={schema}
      defaultValue={defaultValue}
      onChange={handleChange}
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

Form.Input = FormInput;
Form.Group = FormGroup;
Form.Render = FormRender;

export default Form;
