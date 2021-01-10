import React from 'react';

function TypeNumber({
  // name, defaultValue, onChange

  name,
  defaultValue,
  value,
  onChange,
  schema,
  ...rest
}: any) {
  return (
    <input
      {...rest}
      type="number"
      name={name}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  );
}

export default TypeNumber;
