import { useMemo, useRef } from 'react';
import { get } from 'lodash-es';
import Ajv from 'ajv';

function useValidate(
  jsonSchema: any,
  customValidate: StringFunctionMap | undefined,
  previousRootData: any,
) {
  const errorRef = useRef<any[]>([]);

  const validate = useMemo(() => {
    const ajv = new Ajv({ allErrors: true, unknownFormats: 'ignore' });

    if (customValidate) {
      ajv.addKeyword('customValidate', {
        async: true,
        validate: async (
          _schema: any,
          data: any,
          parentSchema?: object,
          dataPath?: string,
          parentData?: object | Array<any>,
          parentDataProperty?: string | number,
          rootData?: object | Array<any>,
        ) => {
          const condArr = Array.isArray(_schema) ? _schema : [_schema];
          let allErrors: any[] = [];
          for (const _schema of condArr) {
            const [, schema, , params] = ((_schema || '').match(
              /^([^()]+)(\((.*)\)){0,1}$/,
            ) || []) as any;
            if (schema in customValidate) {
              const _parentData = { __context: null, ...parentData };
              const _rootData = { __context: null, ...rootData };
              delete _parentData.__context;
              delete _rootData.__context;
              const previousData = get(previousRootData, [
                parentDataProperty || '',
              ]);
              let out: any = await customValidate[schema](
                {
                  schema,
                  data,
                  parentSchema,
                  parentData: _parentData,
                  parentDataProperty,
                  rootData: _rootData,
                  previousData,
                  previousRootData,
                  params: (params || '')
                    .split(',')
                    .map((e: string) => e.trim())
                    .filter((e: string) => e),
                  hasChanged: data !== previousData,
                  ajv,
                },
                // @ts-ignore
                (rootData || {}).__context,
              );
              let error: any;
              if (out === false) {
                error = {};
              } else if (typeof out === 'string') {
                error = { message: out };
              } else if (typeof out === 'object') {
                error = { ...out };
              }
              if (error) {
                allErrors = [
                  ...allErrors,
                  {
                    keyword: schema,
                    message: `should pass "${schema}" validation`,
                    ...error,
                    params: { keyword: schema, ...error.params },
                    dataPath,
                  },
                ];
              }
            } else {
              allErrors = [...allErrors, { keyword: 'type', dataPath }];
            }
          }
          if (allErrors.length > 0) {
            throw new Ajv.ValidationError(allErrors);
          }
          return true;
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
  }, [jsonSchema, customValidate, previousRootData]);

  return validate;
}

export default useValidate;
