// SVELTEKIT IMPORTS
import { form, getRequestEvent } from '$app/server';
import { invalid } from '@sveltejs/kit';

// LIBRARIES
import { m } from '@/lib/paraglide/messages';

// HELPERS
import { verifyTurnstile } from '../helpers/verifyTurnstile';

// SCHEMAS
import {
	turnstileActionSchema,
	turnstileSubmissionSchema
} from '@/shared/features/turnstile/schemas/turnstileSchemas';

// TYPERS
import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { RemoteFormInput, RemoteFormInvalidField } from '$app/server';

type FormSchema = StandardSchemaV1<RemoteFormInput, Parameters<Parameters<typeof form>[1]>[0]>;

export function createTurnstileForm<Schema extends FormSchema, Output>(
	action: string,
	schema: Schema,
	handler: (
		input: StandardSchemaV1.InferOutput<Schema>,
		issue: RemoteFormInvalidField<StandardSchemaV1.InferInput<Schema>>
	) => Output | Promise<Output>
) {
	turnstileActionSchema.parse(action);

	type Input = StandardSchemaV1.InferInput<Schema>;
	type Submission = { input: StandardSchemaV1.InferOutput<Schema>; token: string };

	// SAFETY: the schema supplies these exact inferred Standard Schema input/output types.
	const standard = schema['~standard'] as StandardSchemaV1<Input, Submission['input']>['~standard'];

	const validate: StandardSchemaV1<Input, Submission>['~standard']['validate'] = async (value) => {
		const submission = turnstileSubmissionSchema.safeParse(value);

		if (!submission.success) {
			return { issues: submission.error.issues };
		}

		const result = await standard.validate(submission.data.input);

		if (result.issues) return result;

		const input = result.value;
		const token = submission.data.token;

		const validated = { input, token };

		return { value: validated };
	};

	const wrappedSchema: StandardSchemaV1<Input, Submission> = {
		'~standard': { version: 1, vendor: standard.vendor, validate }
	};

	type WrappedSchema = typeof wrappedSchema;

	// SAFETY: public safeForm overloads enforce native optional-checkbox rules; wrapping preserves the input type.
	const validatedSchema = wrappedSchema as Parameters<
		typeof form<WrappedSchema & RemoteFormInput, Output>
	>[0];

	return form<WrappedSchema & RemoteFormInput, Output>(
		validatedSchema,
		async ({ input, token }, issue) => {
			const hostname = getRequestEvent().url.hostname;
			const verified = await verifyTurnstile(token, action, hostname);

			if (!verified) {
				invalid(m['Turnstile.required']());
			}

			return handler(input, issue);
		}
	);
}
