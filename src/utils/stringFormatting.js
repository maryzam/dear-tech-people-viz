
export function capitalizeFirstLetter(word) {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

export function toPercentage(ratio) {
	return `${Math.round(ratio * 100)}%`;
}