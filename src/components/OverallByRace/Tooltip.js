import React from 'react';
import PropTypes from "prop-types";

import { capitalizeFirstLetter, toPercentage } from "../../utils/stringFormatting";
import Provider from "../../utils/dataProvider";

const source = Provider.getOverallByRace();
const offset = { x: -200, y: 10 };

const Tooltip = ({ hovered, tooltipPos }) => {

	if (!hovered) {
		return null;
	}

	const d = source[hovered];
	const race = capitalizeFirstLetter(hovered);

	return (
		<div className="tooltip"
				style={{
					top: (tooltipPos.y + offset.y),
					left:(tooltipPos.x + offset.x)
				}}>
			<div className="header">
				{ race } employees ({d.all.total} / {toPercentage(d.freq)})
			</div>
			<div>
			<table>
				<tr>
					<td></td>
					<td>Overall</td>
					<td>Male</td>
					<td>Femal</td>
				</tr>
				<tr>
					<td>Leadership</td>
					<td>{ toPercentage(d.leadership.total / d.all.total) }</td>
					<td>{ toPercentage(d.leadership.male / d.leadership.total) }</td>
					<td>{ toPercentage(d.leadership.female / d.leadership.total) }</td>
				</tr>
				<tr>
					<td>Technical</td>
					<td>{ toPercentage(d.technical.total / d.all.total) }</td>
					<td>{ toPercentage(d.technical.male / d.technical.total) }</td>
					<td>{ toPercentage(d.technical.female / d.technical.total) }</td>
				</tr>
				<tr>
					<td>Other</td>
					<td>{ toPercentage(d.other.total / d.all.total) }</td>
					<td>{ toPercentage(d.other.male / d.other.total) }</td>
					<td>{ toPercentage(d.other.female / d.other.total) }</td>
				</tr>
			</table>
			</div>
		</div>
	)
};

export default Tooltip;