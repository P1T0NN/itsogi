const prizeFormatter = new Intl.NumberFormat('en', {
	style: 'currency',
	currency: 'EUR',
	maximumFractionDigits: 0
});

export function formatPrize(value: number): string {
	return prizeFormatter.format(value);
}
