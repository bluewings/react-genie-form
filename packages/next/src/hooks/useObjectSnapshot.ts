import { useRef } from 'react';

function useObjectSnapshot(object: any) {
  const snapshot = useRef<any>(object);
  if (object) {
    let changed = false;
    Object.entries(object).forEach(([key, value]: any) => {
      if (
        changed === false &&
        snapshot.current[key] !== value &&
        (typeof value !== 'object' ||
          JSON.stringify(snapshot.current[key]) !== JSON.stringify(value))
      ) {
        changed = true;
      }
    });
    if (changed === false) {
      const objectKeys = Object.keys(object);
      const notInObject = Object.keys(snapshot.current).find(
        (key: string) => !objectKeys.includes(key),
      );
      if (notInObject) {
        changed = true;
      }
    }
    if (changed) {
      snapshot.current = object;
    }
  }
  return snapshot.current;
}

export default useObjectSnapshot;
