import React, { useMemo } from 'react';

function TypeDate(props: any) {
  const { name, value, onChange, schema } = props;
  // console.log(props);

  const type = useMemo(() => schema?.format || 'date', [schema]);
  return <input type={type} name={name} value={value} onChange={onChange} />;
}

export default TypeDate;
