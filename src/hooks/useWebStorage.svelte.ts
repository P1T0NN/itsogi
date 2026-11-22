// SVELTEKIT IMPORTS
import { browser } from '$app/env';

function parse<T>(raw: string): T | undefined {
	try {
		// SAFETY: this wrapper only reads entries it wrote itself with JSON.stringify, so
		// well-formed entries decode to the caller's T; malformed entries fall through.
		return JSON.parse(raw) as T;
	} catch {
		return undefined;
	}
}

export function createStorage<T>(type: 'local' | 'session', key: string, defaultValue?: T) {
	const storage = () => (type === 'local' ? localStorage : sessionStorage);

	let value = $state<T | undefined>(defaultValue);

	if (browser) {
		const raw = storage().getItem(key);
		if (raw !== null) value = parse<T>(raw) ?? defaultValue;
	}

	const exists = () => browser && storage().getItem(key) !== null;

	const get = () => {
		if (browser) {
			const raw = storage().getItem(key);
			value = raw === null ? defaultValue : (parse<T>(raw) ?? defaultValue);
		}
		return value;
	};

	const set = (newValue: T) => {
		value = newValue;
		if (browser) storage().setItem(key, JSON.stringify(newValue));
	};

	const update = (updater: (current: T | undefined) => T) => {
		set(updater(value));
	};

	const remove = () => {
		value = defaultValue;
		if (browser) storage().removeItem(key);
	};

	return {
		get value() {
			return value;
		},
		exists,
		get,
		set,
		update,
		remove
	};
}
