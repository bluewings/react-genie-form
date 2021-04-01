import React, { useMemo } from 'react';
import BaseCodeMirror from 'react-codemirror';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/mode/css/css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/xml/xml';
import styles from './FormTypeCode.module.scss';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/darcula.css';
import 'codemirror/theme/base16-light.css';
import './FormTypeCode.theme.css';

const alias: any = {
  js: 'javascript',
  html: 'htmlmixed',
  yml: 'yaml',
};

const getMode = (function () {
  return (name = '') => {
    return (name && alias[name.toLowerCase()]) || name;
  };
})();

const FormTypeCode = ({
  defaultValue,
  onChange,
  isReadOnly,
  schema,
  __ui,
}: any) => {
  const options = useMemo(() => {
    // const styleActiveLine = schema.getIn(['options', 'styleActiveLine'], true);
    // const lineNumbers = schema.getIn(['options', 'lineNumbers'], true);
    // const lineWrapping = schema.getIn(['options', 'lineWrapping'], false);
    // const tabSize = schema.getIn(['options', 'tabSize'], 2);
    const mode = getMode(__ui?.language);
    // const theme = getMode(schema.getIn(['options', 'theme'], null));
    return {
      styleActiveLine: true,
      lineNumbers: true,
      lineWrapping: false,
      tabSize: 2,
      mode,
      // theme: typeof theme === 'string' && theme ? theme : 'default',
      theme: 'default',
      readOnly: false,
    };
  }, [schema, isReadOnly]);

  const handleChange = (value: string) => {
    onChange(value.trim());
  };

  return (
    <div className={styles.root}>
      <BaseCodeMirror
        value={defaultValue}
        options={options}
        onChange={handleChange}
      />
    </div>
  );
};

export default FormTypeCode;
