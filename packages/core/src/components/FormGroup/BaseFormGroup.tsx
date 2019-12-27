import React from 'react';
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
}: any) {
  return (
    <div className={className} onFocus={onFocus} onBlur={onBlur}>
      {/* <Counter> </Counter> */}
      {isHidden && (
        <>
          {isHidden && (
            <pre style={{ border: 'red 1px dashed', color: 'red' }}>
              isHidden
            </pre>
          )}
        </>
      )}

      <div
        style={{ display: isHidden ? 'none' : '' }}
        className={classNames.formGroup}
      >
        <Label />
        <div className={classNames.control}>
          <FormComponent />
          <Description />
          <ErrorMessage />
        </div>
      </div>
    </div>
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
