import { useEffect, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useSearchParams } from 'react-router-dom';

export type UrlStateSyncOptions<T> = {
  read: (params: URLSearchParams) => Partial<T>;
  write: (state: T, params: URLSearchParams) => void;
};

/**
 * Syncs a state object with URL query params using caller-provided read/write functions.
 */
export function useUrlStateSync<T extends object>(
  state: T,
  setState: Dispatch<SetStateAction<T>>,
  options: UrlStateSyncOptions<T>
) {
  const [searchParams, setSearchParams] = useSearchParams();

  const didHydrateFromUrlRef = useRef(false);
  const skipInitialWriteRef = useRef(true);
  const skipWriteRef = useRef(false);
  const readRef = useRef(options.read);
  const writeRef = useRef(options.write);

  useEffect(() => {
    readRef.current = options.read;
    writeRef.current = options.write;
  }, [options.read, options.write]);

  useEffect(() => {
    const patch = readRef.current(searchParams);
    const patchKeys = Object.keys(patch) as Array<keyof T>;
    const hasPatch = patchKeys.length > 0;

    if (!didHydrateFromUrlRef.current) {
      didHydrateFromUrlRef.current = true;
    }

    if (!hasPatch) {
      return;
    }

    skipWriteRef.current = true;
    setState((prev) => {
      let hasChanges = false;
      const next = { ...prev } as T;

      for (const key of patchKeys) {
        const nextValue = patch[key] as T[keyof T];
        if (!Object.is(prev[key], nextValue)) {
          hasChanges = true;
          next[key] = nextValue;
        }
      }

      return hasChanges ? next : prev;
    });
  }, [searchParams, setState]);

  useEffect(() => {
    if (!didHydrateFromUrlRef.current) {
      return;
    }

    if (skipInitialWriteRef.current) {
      skipInitialWriteRef.current = false;
      return;
    }

    if (skipWriteRef.current) {
      skipWriteRef.current = false;
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    writeRef.current(state, nextParams);

    if (nextParams.toString() === searchParams.toString()) {
      return;
    }

    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams, state]);
}
