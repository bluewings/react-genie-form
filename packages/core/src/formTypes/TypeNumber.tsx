import * as React from 'react';

function TypeNumber({ name, defaultValue, onChange }: any) {
  return (
    <input
      type="number"
      name={name}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  );
}

export default TypeNumber;
