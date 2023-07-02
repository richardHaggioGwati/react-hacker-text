import React, { useState } from 'react';
import HackerText, { hackerTextFunction } from './components/index';

const App: React.FC = () => {
	const [text, setText] = useState('');
	
    //TODO: repair hacker text function
	return (
		<div>
			<HackerText text='Hello!' element='h1' speed={80} />
			<HackerText
				text='react-hacker-text 😄🎉'
				element='h2'
				speed={80}
				delay={2000}
				characters='numbers'
			/>
			<br />

			<input
				value={text}
				onChange={(e) =>
					hackerTextFunction(e.target.value, () => setText(e.target.value), {
						changes: 10,
						speed: 100,
						characters: 'symbols',
					})
				}
			/>
		</div>
	);
};

export default App;
