import '../config';
import { expect, it } from 'vitest';
import { z } from 'zod';

it('uses friendly global messages for required fields and string lengths', () => {
	expect(z.string().min(1).safeParse('').error?.issues[0].message).toBe(
		'Please fill out this field.'
	);
	expect(z.string().safeParse(undefined).error?.issues[0].message).toBe(
		'Please fill out this field.'
	);
	expect(z.string().min(8).safeParse('short').error?.issues[0].message).toBe(
		'Enter at least 8 characters.'
	);
	expect(z.string().max(1).safeParse('long').error?.issues[0].message).toBe(
		'Enter no more than 1 character.'
	);
	expect(z.string().length(3).safeParse('a').error?.issues[0].message).toBe(
		'Enter exactly 3 characters.'
	);
});

it('formats common types, formats, collections and numeric boundaries', () => {
	expect(z.number().safeParse('a').error?.issues[0].message).toBe('Enter a valid number.');
	expect(z.int().safeParse(1.5).error?.issues[0].message).toBe('Enter a whole number.');
	expect(z.email().safeParse('a').error?.issues[0].message).toBe('Enter a valid email address.');
	expect(z.array(z.string()).min(1).safeParse([]).error?.issues[0].message).toBe(
		'Provide at least 1 item.'
	);
	expect(z.number().positive().safeParse(0).error?.issues[0].message).toBe(
		'Enter a number greater than 0.'
	);
	expect(z.number().max(10).safeParse(11).error?.issues[0].message).toBe(
		'Enter a number no more than 10.'
	);
});

it('preserves feature-specific messages', () => {
	const schema = z.string().min(1, 'Give your task a title.');
	expect(schema.safeParse('').error?.issues[0].message).toBe('Give your task a title.');
	const refined = z.string().refine(() => false, 'This name is unavailable.');
	expect(refined.safeParse('name').error?.issues[0].message).toBe('This name is unavailable.');
});
