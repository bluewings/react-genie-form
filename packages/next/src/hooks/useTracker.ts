import { useLayoutEffect, useState } from 'react';

function useTracker(node: any) {
  const [, setTick] = useState(0);
  useLayoutEffect(() => {
    if (typeof node?.subscribe === 'function') {
      const unsubscribe = node.subscribe((type: string) => {
        setTick((state) => state + 1);
      });
      return () => {
        unsubscribe();
      };
    }
  }, [node, setTick]);
}

export default useTracker;
