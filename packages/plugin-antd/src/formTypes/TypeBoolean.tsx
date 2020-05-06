import * as React from 'react';
import { useMemo } from 'react';
import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import cx from 'classnames';
import { useHandle } from '../hooks';
import styles from './TypeBoolean.module.scss';

function TypeBoolean({ name, value, size, onChange, schema, readOnly }: any) {
  const handleChange = useHandle((event: CheckboxChangeEvent) =>
    onChange(!!event.target.checked),
  );

  const [indeterminate, checked] = useMemo(
    () => [typeof value !== 'boolean', !!value],
    [value],
  );

  return (
    <div className={cx(styles.root, size === 'small' && styles.small)}>
      <Checkbox
        name={name}
        indeterminate={indeterminate}
        checked={checked}
        onChange={handleChange}
        disabled={readOnly}
      />
    </div>
  );
}

export default TypeBoolean;
