import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
  ChangeEvent,
} from 'react';
import { Input, Select } from 'antd';

const defaultProtocols = ['http://', 'https://'];

function FormTypeURI({
  name,
  size,
  schema,
  defaultValue,
  onChange,
  readOnly,
  __ui,
}: any) {
  const { style } = __ui || {};
  const protocols: string[] = useMemo(
    () =>
      Object.keys(
        (Array.isArray(schema.options?.protocols)
          ? schema.options?.protocols
          : Array.isArray(schema.protocols)
            ? schema.protocols
            : defaultProtocols
        ).reduce((accum: any, key: string) => ({ ...accum, [key]: true }), {}),
      ),
    [schema],
  );

  const parseUri = useMemo(() => {
    const prefixes = protocols.slice().sort((a, b) => b.length - a.length);
    return (value: string) => {
      const protocol = prefixes.find((e) => value.startsWith(e));
      return protocol
        ? [protocol, value.replace(protocol, '')]
        : [undefined, value || ''];
    };
  }, [protocols]);

  const [defaultProtocol, defaultPath] = useMemo(() => {
    const [protocol, path] = parseUri(defaultValue || '');
    return [protocol || protocols[0], path];
  }, [defaultValue, parseUri, protocols]);

  const [protocol, setProtocol] = useState(defaultProtocol);
  const handleProtocolChange = useCallback((value: string) => {
    setProtocol(value);
  }, []);

  const [path, setPath] = useState(defaultPath);
  const handlePathChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const [nextProtocol, nextPath] = parseUri(event.target.value);
      if (protocol !== nextProtocol && nextProtocol) {
        setProtocol(nextProtocol);
      }
      if (path !== nextPath) {
        setPath(nextPath);
      }
    },
    [protocol, path],
  );

  const protocolDropdown = (
    <Select value={protocol} onChange={handleProtocolChange}>
      {protocols.map((e, i) => (
        <Select.Option key={i} value={e}>
          {' '}
          {e}
        </Select.Option>
      ))}
    </Select>
  );

  const [tick, setTick] = useState('');
  const ref = useRef<HTMLSpanElement>(null);
  const handleBlur = useCallback(() => {
    if (ref.current) {
      const input = ref.current.querySelector(
        'input.ant-input',
      ) as HTMLInputElement;
      if (input && input.value !== path) {
        setTick(Math.random().toString(36).substr(-8));
      }
    }
  }, [path]);

  const value = (path ? [protocol, path] : []).filter(Boolean).join('');

  useEffect(() => {
    onChange(value);
  }, [value]);

  return (
    <span ref={ref}>
      <Input
        key={tick}
        addonBefore={protocolDropdown}
        name={name}
        size={size}
        defaultValue={path}
        readOnly={readOnly}
        onChange={handlePathChange}
        onBlur={handleBlur}
        style={{ ...style }}
      />
    </span>
  );
}

export default FormTypeURI;
