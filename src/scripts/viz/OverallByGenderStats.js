import React from 'react';
import PropTypes from "prop-types"; 

import * as d3 from "d3";

import { default as Provider } from "../utils/dataProvider";

const data = Provider.getOverallByGender(600); // todo depends on element's size
const positions = Provider.getPositions();

const color = d3.scaleOrdinal()
					.domain(["male", "female"])
					.range(["steelblue", "tomato"]);

const opacity = d3.scaleBand()
					.domain(positions)
					.range([0.3, 1]);

const strokeWidth = d3.scaleBand()
						.domain(positions)
						.range([6, 0]);

class OverallByGenderStats extends React.PureComponent { 

	render() {

		const { width, height } = this.props;
		const pointRadius = Math.min(width / 30, height / 20) * 0.5;

		return (
			<svg width={width} height={height} >
				{
					data.map((d, i) => {
						const x = i % 30;
						const y = Math.floor( i / 30);
						return (
							<circle 
								key={i}	 //todo think aboit key ?
								cx={ pointRadius * (2 * x + 1 )}
								cy={ pointRadius * (2 * y + 1 )}
								r={ pointRadius * 0.9 }
								style={{ 
									fill: color(d.gender),
									stroke: "white",
									strokeWidth: strokeWidth(d.type),
									fillOpacity: opacity(d.type)
								}}
							/>)
					})
				}
			</svg>
		);
	}
};

export default OverallByGenderStats;