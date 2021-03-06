// https://www.typescriptlang.org/docs/handbook/declaration-files/templates.html

declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare interface Hint {
  type: string;
  schema: any;
  format: string;
  formType: string;
  [key: string]: any;
}

declare type FormType = {
  name?: string;
  component: Component<any> | FunctionComponent<any>;
  test:
    | {
        type: string | string[];
        [key: string]: any;
      }
    | Function;
};

declare type FormPlugin = {
  formTypes?: FormType[];
  parseValue?: any;
  FormGroup?: Component | FunctionComponent;
  Label?: Component | FunctionComponent;
  Description?: Component | FunctionComponent;
  ErrorMessage?: Component | FunctionComponent;
  styles?: StringAnyMap;
};

declare interface StringTMap<T> {
  [key: string]: T;
}
declare interface NumberTMap<T> {
  [key: number]: T;
}

declare interface StringAnyMap extends StringTMap<any> {}
declare interface NumberAnyMap extends NumberTMap<any> {}

declare interface StringFunctionMap extends StringTMap<Function> {}
declare interface NumberFunctionMap extends NumberTMap<Function> {}
