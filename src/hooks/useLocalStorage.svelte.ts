// LIBRARIES
import { createStorage } from './useWebStorage.svelte';

export function useLocalStorage<T>(key: string, defaultValue?: T) {
	return createStorage<T>('local', key, defaultValue);
}
