export const validateMoney = (value: string) => {
	let decimalFlag = false; // Raise flag when decimal point is found
	let counter = 2; // Number of allowed decimal places
	const newValue = value.split('').reduce((acc, char) => {
		switch (char) {
			case '.':
			case ',':
				if (decimalFlag) {
					return acc; // Skip char
				}
				decimalFlag = true;
				if (acc.length === 0) {
					return acc + '0.'; // Prepend zero
				}
				return acc + '.'; // Convert comma to dot
			default:
				if (decimalFlag) {
					if (counter) {
						if (/[0-9]/.test(char)) {
							counter -= 1;
							return acc + char; // Append digit
						}
					}
					return acc; // Skip any other character
				} else {
					if (/[0-9]/.test(char)) {
						if (acc === '0') {
							if (char === '0') {
								return acc; // Skip second leading zero
							}
							return char; // Replace leading zero
						}
						return acc + char; // Append digit
					}
					return acc; // Skip any other character
				}
		}
	}, '');
	return newValue;
};
