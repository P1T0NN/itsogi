// LIBRARIES
import { z } from 'zod';
import { getLocale } from '@/lib/paraglide/runtime';

// UTILS
import { formatZodValidationError } from './utils/formatZodValidationError';

z.config({ customError: (issue) => formatZodValidationError(issue, getLocale()) });
