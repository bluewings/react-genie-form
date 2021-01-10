import React from 'react';

function TypeObject({ childNodes, name, defaultValue, onChange }: any) {
  return (
    <>
      {childNodes &&
        childNodes.map((Node: any, i: number) => {
          return <Node key={Node.key} />;
        })}
    </>
  );
}

export default TypeObject;
