import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

type QueryStateSetter = (value: number | ((prev: number) => number)) => void;

/**
 * Binds a numeric value to a query param.
 * Uses history replace to avoid adding a new entry on every change.
 */
export function useQueryState(
  key: string,
  defaultValue: number
): readonly [number, QueryStateSetter] {
  const [params, setParams] = useSearchParams();

  const value = useMemo(() => {
    const raw = params.get(key);
    if (raw == null) return defaultValue;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : defaultValue;
  }, [defaultValue, key, params]);

  const setValue = useCallback<QueryStateSetter>(
    (nextValueOrUpdater) => {
      const resolvedValue =
        typeof nextValueOrUpdater === 'function'
          ? nextValueOrUpdater(value)
          : nextValueOrUpdater;

      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);

          if (Object.is(resolvedValue, defaultValue)) {
            next.delete(key);
          } else {
            next.set(key, String(resolvedValue));
          }

          return next;
        },
        { replace: true }
      );
    },
    [defaultValue, key, setParams, value]
  );

  return [value, setValue] as const;
}
