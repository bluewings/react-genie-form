import React, { useMemo } from 'react';
// import { Fragment } from 'react';
// import styles from './FormGroup.module.scss';
// import { checkPropTypes } from 'prop-types';

function BaseFormGroup({
  Label,
  FormComponent,
  Description,
  ErrorMessage,
  isHidden,
  className,
  classNames,
  onFocus,
  onBlur,
  style,
  schema,
}: any) {
  // const isHidden = !__ui.show;
  const type = schema?.type;
  const _style = useMemo(() => {
    const _style = {
      ...style,
      display: isHidden ? 'none' : style?.display || '',
    };
    if (type === 'object') {
      _style.marginBottom = 0;
    }
    return _style;
  }, [style, isHidden, type]);
  return (
    <span className={className} onFocus={onFocus} onBlur={onBlur}>
      {/* <Counter> </Counter> */}
      {/* {isHidden && (
        <>
          {isHidden && (
            <pre style={{ border: 'red 1px dashed', color: 'red' }}>
              isHidden
            </pre>
          )}
        </>
      )} */}

      <div style={_style} className={classNames.formGroup}>
        <Label />
        <div className={classNames.control}>
          <FormComponent />
          <Description />
          <ErrorMessage />
        </div>
      </div>
    </span>
  );
}

export default BaseFormGroup;

//  /* USAGE EXAMPLE */
//  // components
//  import Counter from '__modulePath__/Counter';
//  import Description from '__modulePath__/Description';
//  import ErrorMessage from '__modulePath__/ErrorMessage';
//  import FormComponent from '__modulePath__/FormComponent';
//  import Label from '__modulePath__/Label';
//
//  // jsx
//  import template from './renderFormGroup.pug';
//
//  class Sample extends React.Component {
//    render() {
//      const { isHidden, styleClass } = this;
//
//      return template({
//        // variables
//        isHidden,
//        styleClass,
//        // components
//        Counter,
//        Description,
//        ErrorMessage,
//        FormComponent,
//        Label,
//      });
//    }
//  }
//
//  /* // USAGE EXAMPLE */
