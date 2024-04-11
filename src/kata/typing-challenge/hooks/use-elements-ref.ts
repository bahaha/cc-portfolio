import { useEffect, useRef, useState } from "react";

export function useElementsRef() {
  const cacheRef = useRef<Map<string, HTMLElement>>(new Map());
  const [indices, setIndices] = useState<number[] | undefined>();
  const lastEl = indices ? cacheRef.current.get(indices.join("_")) : undefined;

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
