// LIBRARIES
import { m } from '@/lib/paraglide/messages';

// TYPES
import type { $ZodErrorMap } from 'zod/v4/core';

import type { Locale } from '@/lib/paraglide/runtime';

export function formatZodValidationError(issue: Parameters<$ZodErrorMap>[0], locale: Locale) {
	const options = { locale };
	switch (issue.code) {
		case 'invalid_type':
			const isMissing = issue.input === undefined || issue.input === null;
			if (isMissing) return m['Validation.required']({}, options);
			if (issue.expected === 'string') return m['Validation.text']({}, options);
			if (issue.expected === 'number') return m['Validation.number']({}, options);
			if (issue.expected === 'int') return m['Validation.integer']({}, options);
			return m['Validation.value']({}, options);

		case 'too_small':
		case 'too_big': {
			const isMinimum = issue.code === 'too_small';
			const limit = isMinimum ? issue.minimum : issue.maximum;
			const comparison = issue.exact ? 'exact' : isMinimum ? 'min' : 'max';

			if (issue.origin === 'string') {
				const isRequired = isMinimum && limit === 1 && issue.inclusive && !issue.exact;
				if (isRequired) {
					return m['Validation.required']({}, options);
				}
				return m['Validation.characterLimit']({ comparison, limit: Number(limit) }, options);
			}

			const isCollection = issue.origin === 'array' || issue.origin === 'set';
			if (isCollection) {
				return m['Validation.itemLimit']({ comparison, limit: Number(limit) }, options);
			}

			if (issue.origin === 'file') {
				return m['Validation.fileLimit']({ comparison, limit: Number(limit) }, options);
			}

			const isNumeric =
				issue.origin === 'number' || issue.origin === 'int' || issue.origin === 'bigint';
			if (isNumeric) {
				const isStrictBound = !issue.exact && !issue.inclusive;
				const numericComparison = isStrictBound ? (isMinimum ? 'greater' : 'less') : comparison;
				return m['Validation.numberLimit'](
					{ comparison: numericComparison, limit: String(limit) },
					options
				);
			}

			return m['Validation.range']({}, options);
		}

		case 'invalid_format':
			switch (issue.format) {
				case 'email':
					return m['Validation.email']({}, options);
				case 'url':
					return m['Validation.url']({}, options);
				case 'uuid':
					return m['Validation.identifier']({}, options);
				case 'date':
					return m['Validation.date']({}, options);
				case 'datetime':
					return m['Validation.datetime']({}, options);
				case 'time':
					return m['Validation.time']({}, options);
				default:
					return m['Validation.format']({}, options);
			}

		case 'invalid_value':
			return m['Validation.option']({}, options);
		case 'not_multiple_of':
			return m['Validation.multiple']({ divisor: String(issue.divisor) }, options);
		case 'unrecognized_keys':
			return m['Validation.unexpectedFields']({}, options);
		case 'invalid_union':
		case 'invalid_key':
		case 'invalid_element':
			return m['Validation.value']({}, options);
		case 'custom':
			return undefined;
	}
}
