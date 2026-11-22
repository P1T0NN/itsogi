// SCHEMAS
import { timeConfigSchema } from './schemas/timeSchemas';

// Presentation only: never shift stored instants, expiry windows or cron schedules.
export const TIME_CONFIG = timeConfigSchema.parse({
	DEFAULT_TIME_ZONE: 'UTC',
	LOCALE: 'en-GB'
});
