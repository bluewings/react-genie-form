import { useContext, useEffect, useMemo, useState } from 'react';
import useTracker from '../../hooks/useTracker';
import { NodeContext } from '../../providers';

function useTargetNode(path: string | undefined, __node?: any) {
  const rootNode = useContext(NodeContext);

  const node = useMemo(
    () =>
      __node ? __node : rootNode.findNode((path || '').replace(/^\$\./, '')),
    [__node, path, rootNode],
  );

  const uiShow = node?.schema?.['ui:show'];
  const _watch = node?.schema?.options?.watch;

  const { dependencies: _dependencies, showFunc, getWatchValues } = useMemo(() => {
    const dependencies: string[] = [];
    let showFunc;
    if (typeof uiShow === 'string') {
      const funcStr = `return !!(${uiShow
        .replace(/[$@].[a-zA-Z0-9.]+/g, (whole: string) => {
          if (dependencies.indexOf(whole) === -1) {
            dependencies.push(whole);
          }
          return `deps[${dependencies.indexOf(whole)}]`;
        })
        .trim()
        .replace(/;$/, '')})`;

      showFunc = new Function('deps', funcStr);
    }
    let getWatchValues;
    if (Array.isArray(_watch) || typeof _watch === 'string') {
      const indexes = (Array.isArray(_watch) ? _watch : [_watch]).map(dep => {
        if (dependencies.indexOf(dep) === -1) {
          dependencies.push(dep);
        }
        return dependencies.indexOf(dep)
      });
      const funcStr = `return [${indexes.join(',')}].map(function(i) {
        return deps[i];
      })`;
      getWatchValues = new Function('deps', funcStr);
    }
    return { dependencies, showFunc, getWatchValues };
  }, [_watch, uiShow]);

  const deps = useMemo(() => {
    if (_dependencies.length > 0 && node) {
      return _dependencies.map((e) => {
        const at = node.findNode(e);
        return at.getValue();
      });
    }
    return [];
  }, [node, _dependencies]);

  const [_deps, setDeps] = useState(deps);

  const returnValue = useMemo(() => {
    if (typeof showFunc === 'function') {
      return showFunc(_deps);
    }
    return true;
  }, [showFunc, _deps]);

  const watchvalues = useMemo(() => {
    if (typeof getWatchValues === 'function') {
      return getWatchValues(_deps);
    }
    return [];
  }, [getWatchValues, _deps]);

  useEffect(() => {
    if (_dependencies.length > 0 && node.rootNode) {
      const unsubs = _dependencies
        .map((e, i) => {
          const at = node.findNode(e);
          if (at) {
            return at.subscribe((type: string, payload: any) => {
              if (type === 'change') {
                setDeps((state: any) => {
                  state[i] = payload;

                  return [...state];
                });
              }
            });
          }
          // return
        })
        .filter((e) => typeof e === 'function');

      return () => {
        unsubs.forEach((e: any) => {
          // if (e())
          e();
        });
      };
    }
  }, [node, _dependencies]);

  useTracker(node);

  return { node, show: !!returnValue, watchvalues };
}

export default useTargetNode;
