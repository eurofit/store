import { atom, Getter, Setter, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useEffect } from 'react';

type Callback<Value> = (get: Getter, set: Setter, newVal: Value, prevVal: Value) => void;

export function atomWithListeners<Value>(key: string, initialValue: Value) {
  const baseAtom = atomWithStorage<Value>(key, initialValue);

  const listenersAtom = atom<Callback<Value>[]>([]);

  const anAtom = atom(
    (get) => get(baseAtom),
    (get, set, arg: Value | ((prev: Value) => Value)) => {
      const prevVal = get(baseAtom);
      const nextVal =
        typeof arg === 'function' ? (arg as (prev: Value) => Value)(prevVal) : arg;

      // Set to localStorage atom
      set(baseAtom, nextVal);

      // Notify all listeners
      get(listenersAtom).forEach((callback) => {
        callback(get, set, nextVal, prevVal);
      });
    },
  );

  const useListener = (callback: Callback<Value>) => {
    const setListeners = useSetAtom(listenersAtom);
    useEffect(() => {
      setListeners((prev) => [...prev, callback]);
      return () => {
        setListeners((prev) => prev.filter((cb) => cb !== callback));
      };
    }, [setListeners, callback]);
  };

  return [anAtom, useListener] as const;
}
