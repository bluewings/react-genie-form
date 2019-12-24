import { useMemo, useRef } from 'react';
import Ajv from 'ajv';

function useValidate(
  jsonSchema: any,
  customValidate: StringFunctionMap | undefined,
) {
  const errorRef = useRef<any[]>([]);

  const validate = useMemo(() => {
    const ajv = new Ajv({ allErrors: true, unknownFormats: 'ignore' });

    if (customValidate) {
      ajv.addKeyword('customValidate', {
        validate: function validate(...args: any) {
          const [name, , , dataPath] = args;
          if (name in customValidate) {
            const context = this;
            let out: any = customValidate[name](...args, ajv, context);
            let result = { valid: true, errors: [] } as any;
            if (typeof out === 'boolean') {
              result = { ...result, valid: out, errors: [{}] };
            } else if (typeof out === 'string') {
              result = { ...result, valid: false, errors: [{ message: out }] };
            } else if (typeof out === 'object') {
              result = { ...result, valid: false, errors: [out] };
            }
            if (!result.valid) {
              // @ts-ignore
              validate.errors = (result.errors || []).map((error: any) => ({
                keyword: name,
                message: `should pass "${name}" validation`,
                ...error,
                params: { keyword: name, ...error.params },
                dataPath,
              }));
            }
            return result.valid;
          }
          // @ts-ignore
          validate.errors = [{ keyword: 'type', dataPath }];
          return false;
        },
        errors: true,
      });
    }
    const schema = jsonSchema;
    schema.$async = true;
    let validateFn: Function;
    try {
      validateFn = ajv.compile(schema);
    } catch (err) {
      validateFn = async () => {
        throw {
          errors: [
            {
              keyword: '__jsonSchema',
              parans: {},
              message: err.message,
            },
          ],
        };
      };
    }
    return async (value: any) => {
      let nextErrors = [];
      try {
        await validateFn(value);
      } catch (err) {
        nextErrors = err.errors;
      }
      if (JSON.stringify(errorRef.current) !== JSON.stringify(nextErrors)) {
        errorRef.current = [...nextErrors];
      }
      return errorRef.current;
    };
  }, [jsonSchema, customValidate]);

  return validate;
}

export default useValidate;
