import * as React from 'react';

function Label({ className, formattedLabel, style }: any) {
  return (
    <label className={className} style={style}>
      {formattedLabel}
    </label>
  );
}

export default Label;
