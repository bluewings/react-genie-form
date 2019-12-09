import { useMemo, useRef } from 'react';
import Ajv from 'ajv';

function useValidate(jsonSchema: any) {
  const errorRef = useRef<any[]>([]);

  const validate = useMemo(() => {
    const ajv = new Ajv({ allErrors: true, unknownFormats: 'ignore' });
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
  }, [jsonSchema]);

  return validate;
}

export default useValidate;
