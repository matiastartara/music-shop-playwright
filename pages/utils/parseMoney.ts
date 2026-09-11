export function parseMoney(text: string): number {
    const cleaned = text
        .replace('$', '')
        .replace(',', '')
        .trim();

    const amount = Number(cleaned);

    if (Number.isNaN(amount)) {
        throw new Error(`Unable to parse money amount from text: "${text}"`);
    }

    return amount;
}
