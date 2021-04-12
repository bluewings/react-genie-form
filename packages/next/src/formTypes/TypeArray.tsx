import React, { useCallback, useRef } from 'react';

function DeleteButton(props: any) {
  const { index, onClick } = props;
  const handleClick = () => {
    onClick(index);
  };

  return (
    <button title="remove item" onClick={handleClick}>
      항목 삭제
    </button>
  );
}

function TypeArray(props: any) {
  const { node, childNodes } = props;
  const handleClick = useCallback(() => {
    node.push();
  }, [node]);

  const handleRemoveClick = useCallback((index: number) => {
    node.remove(index);
  }, [node]);
  return (
    <div style={{ padding: 20, background: 'lightYellow' }}>
      {/* <h1>{count.current}</h1> */}
      {childNodes &&
        childNodes.map((Node: any, i: number) => {
          return (
            <div key={Node.key} style={{ border: '1px dashed red' }}>
              <Node
              // style={{ background: 'orange', fontSize: 20 }}
              />
              <DeleteButton index={i} onClick={handleRemoveClick} />
            </div>
          );
        })}
      <hr />
      <button title="add item" onClick={handleClick}>
        항목 추가
      </button>
    </div>
  );
}

export default React.memo(TypeArray);
