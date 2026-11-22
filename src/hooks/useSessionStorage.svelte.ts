// LIBRARIES
import { createStorage } from './useWebStorage.svelte';

export function useSessionStorage<T>(key: string, defaultValue?: T) {
	return createStorage<T>('session', key, defaultValue);
}
