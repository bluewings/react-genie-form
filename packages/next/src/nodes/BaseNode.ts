import Ajv from 'ajv';

enum JSONPath {
  Root = '$',
  Current = '@',
  Child = '.',
}

export type Schema = {
  type: string;
  [key: string]: any;
};

export interface IConstructorProps {
  key?: string;
  name: string;
  schema: Schema;
  defaultValue: any;
  onChange: (value: any) => void;
  parentNode?: any;
  refNodes?: BaseNode[];
  ajv?: any;
  nodeFactory?: any;
}

type Listener = (type: string, payload: any) => void;

abstract class BaseNode {
  readonly defaultValue: any;
  readonly depth: number;
  readonly isArrayItem: boolean;
  readonly isRoot: boolean;
  private name: string;
  readonly rootNode: BaseNode;
  readonly parentNode: BaseNode;
  private path: string;
  private key?: string;
  readonly schema: any;

  abstract children: () => any[];
  abstract getValue: () => any;
  abstract setValue?: (value: any) => void;
  abstract parseValue: (value: any) => any;

  // need refactoring
  setName = (name: string, actor: any) => {
    // 부모만 이름을 바꿔줄 수 있음
    if (true || actor === this.parentNode) {
      this.name = name;
      this.updatePath();
    }
  }
  updatePath = () => {
    const newPath = this.parentNode?.getPath()
      ? `${this.parentNode.getPath()}${JSONPath.Child}${this.getName()}`
      : JSONPath.Root;
    if (this.path !== newPath) {
      this.path = newPath;
      this.publish('pathChange', newPath);
    }
  }
  getName = () => {
    return this.name;
  }
  getPath = () => {
    return this.path;
  }
  getKey = () => {
    return this.key;
  }
  // //need refactoring

  getErrors = (): any[] | null => {
    const errors = [...this._receivedErrors, ...this._errors];
    return errors.length > 0 ? errors : null;
  };
  setErrors = (errors: any[]) => {
    const serialized = JSON.stringify(errors);
    if (this._errorHash !== serialized) {
      this._errorHash = serialized;
      this._errors = errors;
      this.publish('validate', [...this._receivedErrors, ...this._errors]);
    }
  };
  clearErrors = () => {
    this.setErrors([]);
  };

  setReceivedErrors = (errors: any[]) => {
    const serialized = JSON.stringify(errors);
    if (this._receivedErrorHash !== serialized) {
      this._receivedErrorHash = serialized;
      this._receivedErrors = errors;
      this.publish('validate', [...this._receivedErrors, ...this._errors]);
    }
  };
  clearReceivedErrors = () => {
    if (this._receivedErrors && this._receivedErrors.length > 0) {
      this.setReceivedErrors([]);
    }
  };

  getState = () => this._state;
  setState = (state: Function | { [key: string]: any }) => {
    let nextState;
    if (typeof state === 'function') {
      const tmpState = state(this._state);
      if (
        Object.keys(tmpState).length !== Object.keys(this._state).length ||
        Object.entries(tmpState).find(([k, v]: any) => this._state[k] !== v)
      ) {
        nextState = tmpState;
      }
    } else if (typeof state === 'object' && state) {
      nextState = Object.entries(state).reduce((accum, [k, v]) => {
        if (accum[k] !== v) {
          if (typeof v === 'undefined') {
            accum = { ...accum };
            delete accum[k];
          } else {
            accum = { ...accum, [k]: v };
          }
        }
        return accum;
      }, this._state);
    }
    if (
      nextState &&
      typeof nextState === 'object' &&
      this._state !== nextState
    ) {
      this._state = nextState;
      this.publish('stateChange', this._state);
    }
  };

  findNode = (path: string): BaseNode => find(this, path);
  subscribe = (callback: Listener) => {
    this._listeners.push(callback);
    return () =>
    (this._listeners = this._listeners.filter(
      (listener) => listener !== callback,
    ));
  };
  publish = (type: string, payload: any) => {
    this._listeners.forEach((listener) => listener(type, payload));
  };

  protected _listeners: Listener[] = [];
  protected _validate?: Function;

  private _errors: any = [];
  private _errorHash?: string;
  private _errorDataPaths: string[] = [];

  private _receivedErrors: any = [];
  private _receivedErrorHash?: string;

  private _state: { [key: string]: any } = {};

  constructor({
    key,
    name,
    schema,
    defaultValue,
    parentNode,
    ajv,
  }: IConstructorProps) {
    this.parentNode = parentNode || null;
    this.rootNode = this.parentNode?.rootNode || this;
    this.isRoot = !this.parentNode;
    this.isArrayItem = this.parentNode?.schema?.type === 'array';
    this.name = name || '';
    this.path = this.parentNode?.getPath()
      ? `${this.parentNode.getPath()}${JSONPath.Child}${this.getName()}`
      : JSONPath.Root;
    this.key = this.parentNode?.getPath()
      ? `${this.parentNode.getPath()}${JSONPath.Child}${typeof key === 'undefined' ? this.getName() : key}`
      : JSONPath.Root;

    this.depth = this.path.split(JSONPath.Child).filter(Boolean).length - 1;
    this.schema = schema;
    this.defaultValue = defaultValue;

    if (this.parentNode) {
      this.parentNode.subscribe((type, payload) => {
        if (type === 'pathChange') {
          this.updatePath();
        }
      });
    }

    if (this.isRoot) {
      const ajvInstance =
        ajv || new Ajv({ allErrors: true, unknownFormats: 'ignore' });
      let ajvValidate: Function;
      try {
        ajvValidate = ajvInstance.compile({ ...schema, $async: true });
      } catch (err) {
        ajvValidate = async () => {
          throw {
            errors: [
              { keyword: '__jsonSchema', parans: {}, message: err.message },
            ],
          };
        };
      }

      const validate = async (value: any) => {
        let nextErrors = [];
        try {
          await ajvValidate(value);
        } catch (err) {
          nextErrors = err.errors;
        }
        return nextErrors;
      };

      const validateOnChange = async () => {
        const errors = transformErrors(await validate(this.getValue()));
        const errorsByDataPath = errors.reduce((accum: any, error: any) => {
          if (!accum[error.dataPath]) {
            accum[error.dataPath] = [];
          }
          accum[error.dataPath].push(error);
          return accum;
        }, {});

        Object.entries(errorsByDataPath).forEach(([dataPath, errors]: any) => {
          const node = this.findNode(dataPath);
          node?.setErrors(errors);
        });

        const _errorDataPaths = Object.keys(errorsByDataPath);
        this._errorDataPaths
          .filter((dataPath) => !_errorDataPaths.includes(dataPath))
          .forEach((dataPath) => {
            const node = this.findNode(dataPath);
            node?.clearErrors();
          });
        this._errorDataPaths = _errorDataPaths;
      };

      this.subscribe((type) => {
        if (type === 'change') {
          validateOnChange();
        }
      });

      // validate for initial value
      setTimeout(() => {
        validateOnChange();
      }, 0);
    }
  }
}

export default BaseNode;

function find(target: any, path: string): BaseNode | any {
  const [currPath, ...rest] = path
    .replace(/^\.([^.])/, '$1')
    // to access array items
    .replace(/\[(\d+)\]/g, '.$1')
    .split(JSONPath.Child);
  if (path === '') {
    return target;
  } else if (currPath === JSONPath.Root) {
    return find(target?.rootNode, rest.join(JSONPath.Child));
  } else if (currPath === JSONPath.Current) {
    return find(target?.parentNode, rest.join(JSONPath.Child));
  } else if (target?.children) {
    const children = target.children();
    const found = children.find((e: any) => e?.node?.getName() === currPath);
    if (found && rest.length > 0) {
      return find(found.node, rest.join(JSONPath.Child));
    }
    return found?.node || null;
  }
  return null;
}

export const transformErrors = (errors: any) => {
  return (Array.isArray(errors) ? errors : []).map((error: any) => {
    if (error.dataPath && error.keyword === 'required' && error.params?.missingProperty) {
      return { ...error, dataPath: `${error.dataPath}.${error.params.missingProperty}` };
    }
    return error;
  }, []);
};