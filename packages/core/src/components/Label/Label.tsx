import * as React from 'react';

function Label({ className, formattedLabel }: any) {
  return <label className={className}>{formattedLabel}</label>;
}

export default Label;
