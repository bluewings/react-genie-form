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
  component: Component<any> | FunctionComponent<any>;
  test:
    | {
        type: string | string[];
        [key: string]: any;
      }
    | Function;
};

declare type Plugin = {
  formTypes?: FormType[];
  parseValue?: any;
  FormGroup?: Component | FunctionComponent;
  Label?: Component | FunctionComponent;
  Description?: Component | FunctionComponent;
  ErrorMessage?: Component | FunctionComponent;
};
