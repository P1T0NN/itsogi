// SVELTEKIT IMPORTS
import { form } from '$app/server';
import { z } from 'zod';

// WRAPPERS
import { createTurnstileForm } from '@/server/turnstile/wrappers/createTurnstileForm';

// TYPES
import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { RemoteFormInput } from '$app/server';
import type { TurnstileFormOptions } from '@/shared/features/turnstile/types/turnstileTypes';

type FormSchema = StandardSchemaV1<RemoteFormInput, Parameters<Parameters<typeof form>[1]>[0]>;
// The intersection disambiguates native generic overloads; the schema's inferred input/output stay intact.
type FormArguments<Schema extends FormSchema, Output> = Parameters<
	typeof form<Schema & RemoteFormInput, Output>
>;
type ValidatedFormSchema<Schema extends FormSchema, Output> = FormArguments<
	Schema,
	Output
>[0] extends string
	? FormArguments<Schema, Output>[0]
	: Schema;

export function safeForm<Output>(
	options: TurnstileFormOptions,
	handler: () => Output | Promise<Output>
): ReturnType<typeof form<Output>>;

export function safeForm<Schema extends FormSchema, Output>(
	options: TurnstileFormOptions,
	schema: Schema & ValidatedFormSchema<Schema, Output>,
	handler: FormArguments<Schema, Output>[1]
): ReturnType<typeof form<Schema & RemoteFormInput, Output>>;

export function safeForm<Schema extends FormSchema, Output>(
	options: TurnstileFormOptions,
	...args:
		| [handler: () => Output | Promise<Output>]
		| [schema: Schema, handler: FormArguments<Schema, Output>[1]]
) {
	if (args.length === 1) {
		if (options.turnstile) {
			const handler = args[0];
			return createTurnstileForm(options.turnstile.action, z.object({}), () => handler());
		}
		return form(args[0]);
	}

	if (options.turnstile) {
		return createTurnstileForm<Schema, Output>(options.turnstile.action, args[0], args[1]);
	}

	// SAFETY: the public overload applies the native boolean/schema check; this bridges generic overload inference only.
	const schema = args[0] as FormArguments<Schema, Output>[0];

	return form<Schema & RemoteFormInput, Output>(schema, args[1]);
}
