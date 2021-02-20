import React, { useRef } from 'react';

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
  const handleClick = () => {
    node.push();
  };

  const handleRemoveClick = (index: number) => {
    node.remove(index);
  };
  const count = useRef(0);
  count.current++;
  return (
    <div
    // style={{ padding: 20, background: 'lightYellow' }}
    >
      {/* <h1>{count.current}</h1> */}
      {childNodes &&
        childNodes.map((Node: any, i: number) => {
          return (
            <div key={Node.key}
            // style={{ border: '1px dashed red' }}
            >
              <DeleteButton index={i} onClick={handleRemoveClick} />
              <Node
              // style={{ background: 'orange', fontSize: 20 }}
              />

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

export default TypeArray;
