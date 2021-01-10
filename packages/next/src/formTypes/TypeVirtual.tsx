import React from 'react';
import { useMemo } from 'react';

function TypeString({
  name,
  defaultValue,
  value,
  onChange,
  schema,
  childNodes,
  ...rest
}: any) {
  return (
    <div style={{ padding: 10, border: '1px solid red', margin: 10 }}>
      <>
        {childNodes &&
          childNodes.map((Node: any, i: number) => {
            return <Node key={Node.key} />;
          })}
      </>
    </div>
  );
}

export default TypeString;
