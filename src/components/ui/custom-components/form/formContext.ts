import { createContext } from 'svelte';

export const [useFormContext, setFormContext] = createContext<{ attempt: number }>();
