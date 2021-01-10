import React, { useMemo } from 'react';

function TypeDate(pro: any) {
  const { name, value, onChange, schema } = pro;
  console.log(pro);

  const type = useMemo(() => schema?.format || 'date', [schema]);
  return <input type={type} name={name} value={value} onChange={onChange} />;
}

export default TypeDate;
