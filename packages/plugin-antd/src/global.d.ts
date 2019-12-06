declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
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
