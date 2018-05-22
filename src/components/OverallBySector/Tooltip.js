import React from 'react';
import PropTypes from "prop-types";

function formatWord(word) {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

function getHeader(gender, race, role) {

	const who = (gender === "male") ? "Men" : "Women";
	const raceFormated = (race === "all") ? "" : formatWord(race);
	const roleFormated = formatWord(role);

	return (
		<div className={`header ${gender}`}>
			{raceFormated} {who} in { formatWord(role)} roles
		</div>
	);
}

function getContent(data, role, gender) {

	const total = data[role][gender];
	const ratio = Math.round(data[role].freq[gender] * 100);

	return (
		<div>
			<p>{ total } employees </p>
			<p>Ratio: { ratio }% </p>
		</div>
	);
}

const offset = { x: 10, y: 10 };

const Tooltip = ({ role, race, gender, data, position }) => {

	if (!data || !gender) {
		return null;
	}

	return (
		<div className="tooltip"
				style={{
					top: (position.y + offset.y),
					left:(position.x + offset.x),
				}}>
			{ getHeader(gender, race, role) }
			{ getContent(data, role, gender) }

		</div>
	)
};

export default Tooltip;