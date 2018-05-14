import React from 'react';
import PropTypes from "prop-types"; 

import * as d3 from "d3";

import { default as Provider } from "../utils/dataProvider";

const data = Provider.getOverallByRaceAndGender();
const positions = Provider.getPositions();

const color = d3.scaleOrdinal()
					.domain(["male", "female"])
					.range(["steelblue", "tomato"]);

const opacity = d3.scaleBand()
					.domain(positions)
					.range([0.5, 1]);

class OverallByRaceStats extends React.PureComponent { 

	constructor(props) {

		super(props);

		this.viz = React.createRef();

		this.scaleRadius = d3.scaleLinear();
		this.scaleAngle = d3.scaleLinear().range([-Math.PI / 2, Math.PI / 2]);

		this.arc = d3.arc()
				.cornerRadius(3)
				.innerRadius((d) => this.scaleRadius(d.radius.from))
				.outerRadius((d) => this.scaleRadius(d.radius.to))
				.startAngle((d) => this.scaleAngle(d.angle.from))
				.endAngle((d) => this.scaleAngle(d.angle.to));
	}

	componentDidMount() {
		this.updateChart();
	}

	componentDidUpdate() {
		this.updateChart();
	}

	updateChart() {
		//todo update scales if they've changed
	}

	render() {

		const { width, height } = this.props;
		const cellSize = Math.min(width * 0.5, height);
		const innerRadius = cellSize * 0.1;
		const outerRadius = cellSize * 0.5 - 10;

		this.scaleRadius.range([innerRadius, outerRadius]);

		return (
			<svg width={width} height={height} ref={ this.viz } >
				{
					data.map((d, i) => {
						const xCenter = cellSize * (Math.floor(i / 2) + 0.5);
						const yCenter = cellSize * 0.5 * (i % 2 + 1);
						return (
							<g key={d.data.race}
								transform={`translate(${ xCenter }, ${ yCenter })`}>
								<g>
									{ d.stack.map((s) => {
										return (
											<path 
												key={ `${s.type}-${s.gender}`}
												d={ this.arc(s) }
												style={{ 
													fill: color(s.gender),
													fillOpacity: opacity(s.type),
													stroke: "white",
													strokeWidth: "0.5px"
												}}
											/>
										)}
									)}
								</g>
								<text>{d.data.race}</text>
							</g>
						)})
				}
			</svg>
		);
	}
};

export default OverallByRaceStats;