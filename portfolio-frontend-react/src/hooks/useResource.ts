import { useContext } from 'react';
import { DataContext } from '../context/DataContext';

// Reads from the global coordinated DataContext. Starts every section with its 
// static default content, then returns live data from the API if successfully loaded.
export function useResource<T>(path: string, defaultValue: T): T {
  const context = useContext(DataContext);
  if (!context) {
    return defaultValue;
  }
  const data = context.resources[path];
  return data !== undefined ? (data as T) : defaultValue;
}
