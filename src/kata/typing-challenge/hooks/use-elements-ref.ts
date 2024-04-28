import { useEffect, useRef, useState } from "react";

function findLastActiveElement(
  indices: number[] | undefined,
  cache: Map<string, HTMLElement>,
): HTMLElement | undefined {
  if (!cache || !indices || indices[0] < 0 || indices[1] < 0) {
    return undefined;
  }

  if (cache.get(indices.join("_"))) {
    return cache.get(indices.join("_"));
  } else {
    return findLastActiveElement([indices[0], indices[1] - 1], cache);
  }
}

export function useElementsRef() {
  const cacheRef = useRef<Map<string, HTMLElement>>(new Map());
  const [indices, setIndices] = useState<number[] | undefined>();
  const lastEl = findLastActiveElement(indices, cacheRef.current);

  function attachElementRef(
    indices: number[],
  ): (el: HTMLElement | null) => void {
    const key = indices.join("_");
    return (el) => {
      const cache = cacheRef.current;
      if (el) {
        cache.set(key, el);
      } else {
        cache.delete(key);
      }
    };
  }

  useEffect(() => {
    return () => {
      cacheRef.current.clear();
    };
  }, []);

  return {
    lastEl,
    attachElementRef,
    pickElement: setIndices,
  };
}
