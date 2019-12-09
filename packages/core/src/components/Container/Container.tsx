/** @jsx jsx */
import { useMemo, useRef } from 'react';
import { jsx } from '@emotion/core';
import useCss from './useCss';
import { useHandle } from '../../hooks';
import FormGroup from '../FormGroup';

export type ContainerProps = {
  schema: any;
  defaultValue?: any;
  onChange?: (value: any) => void;
  layout?: 'vertical' | 'horizontal';
  labelAlign?: 'left' | 'center' | 'right';
  labelWidth?: number | string;
};

function Container({
  schema,
  defaultValue,
  onChange,
  layout,
  labelAlign,
  labelWidth,
}: ContainerProps) {
  const _defaultValue = useMemo(() => defaultValue || {}, [defaultValue]);

  const currValue = useRef(_defaultValue);
  const handleValueChange = useHandle((value: any) => {
    if (currValue.current !== value && typeof onChange === 'function') {
      onChange(value);
    }
    currValue.current = value;
  });

  const { className, css } = useCss({ layout, labelAlign, labelWidth });

  return (
    <div className={className} css={css}>
      <FormGroup
        isRoot={true}
        schema={schema}
        defaultValue={_defaultValue}
        onChange={handleValueChange}
      />
    </div>
  );
}

export default Container;
