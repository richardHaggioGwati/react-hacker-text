import * as utils from './utils';

interface ChangingLetter {
	index: number;
	changes: number;
	original: string;
	showingLetter?: string;
}

type characterType = "all" | "capital-letters" | "lower-letters" | "numbers" | "symbols"

const defaultOptions = { changes: 4, speed: 50 };

const hackerTextFunction = (
	text: string,
	callback: (text: string) => void,
	options: { changes?: number; speed?: number; characters?: characterType } = {},
): void => {
	let changingLetter: { [key: number]: ChangingLetter } = {};
	let textLength = 0;
	let timeoutWrite: NodeJS.Timeout | undefined;

	const verifyConsistency = (text: string): void => {
		//TODO: remove any
		Object.keys(changingLetter).forEach((key: any) => {
			const char = text[key];
			if (
				typeof changingLetter[key] === 'undefined' ||
				typeof changingLetter[key].showingLetter === 'undefined'
			)
				return;

			if (char !== changingLetter[key].showingLetter)
				//@ts-ignore
				changingLetter[key] = undefined;
		});
	};

	const verifyLettersToChange = (
		text: string,
		callback: (text: string) => void,
		options: { changes?: number; speed?: number; characters?: string },
	): void => {
		let hackerText = '';
		for (let index = 0; index < text.length; index++) {
			const char = text[index];

			if (typeof changingLetter[index] === 'undefined') {
				hackerText += char;
				continue;
			}

			changingLetter[index].changes++;
			const isFinishedChanges =
				changingLetter[index].changes >= options.changes!; // ensure that change is no undefined

			if (isFinishedChanges) {
				changingLetter[index].showingLetter = changingLetter[index].original;
				hackerText += changingLetter[index].original;
			} else {
				const randomChar = utils.randomCharacter(char, options.characters);
				changingLetter[index].showingLetter = randomChar;
				hackerText += randomChar;
			}
		}

		callback(hackerText);
		timeoutWrite = setTimeout(
			() => verifyLettersToChange(text, callback, options),
			options.speed,
		);
	};

	if (!callback) return;
	if (timeoutWrite) clearTimeout(timeoutWrite);

	if (textLength > text.length) {
		verifyConsistency(text);
	}
	textLength = text.length;

	const textIndex = text.length - 1;
	options = { ...defaultOptions, ...options };
	if (!changingLetter[textIndex])
		changingLetter[textIndex] = {
			index: textIndex,
			changes: 0,
			original: text[textIndex],
		};

	verifyLettersToChange(text, callback, options);
};

export default hackerTextFunction;
