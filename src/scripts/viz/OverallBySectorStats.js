import React from 'react';
import PropTypes from "prop-types"; 

import * as d3 from "d3";

import { default as Provider } from "../utils/dataProvider";

const roles = Provider.getRoles();
const races = Provider.getRaces();
const sectors = Provider.getSectors();

const data = Provider.getOverallBySectors();

class OverallBySectorStats extends React.PureComponent {

	constructor(props) {
		super(props);

		this.setVizRef = (element) => { this.viz = element; };

		const { race, role, height, width } = this.props;

		this.scaleSectors = d3.scaleBand()
								.domain(sectors)
								.range([0, height])
								.round(true);
		
		this.scaleFreq = d3.scaleLinear().range([0, width]);

		const maxRadius = this.scaleSectors.bandwidth() / 2;
		const maxCount = d3.max(data[race], (d) => (Math.max(d[role].male, d[role].female)));
		const minCount = d3.min(data[race], (d) => (Math.min(d[role].male, d[role].female)));
		this.scaleTotal = d3.scaleLinear().range([3, maxRadius]).domain([minCount, maxCount]);
	}

	componentDidMount() {
		// todo
	}

	componentDidUpdate() {
		// todo
	}

	updateViz() {

	}

	updateScales() {

	}

	render() {

		const { width, height, race, role } = this.props;
		const xOffset = width / 2;
		return (
			<svg ref={ this.setVizRef }
					className="overall-by-gender"
					width={width} 
					height={height} >
				{
					data[race].map((d) => {
						return (
							<g key={ d.sector }
								transform={`translate(0, ${this.scaleSectors(d.sector)})`}>
								<circle 
									cx={this.scaleFreq(d[role].freq.male)} cy={0}
									r={ this.scaleTotal(d[role].male)} 
									style={{ fill: "steelblue" }}/>	
								<circle 
									cx={this.scaleFreq(d[role].freq.female)} cy={0} 
									r={ this.scaleTotal(d[role].female)} 
									style={{ fill: "tomato" }} />	
								<line 
									x1={this.scaleFreq(d[role].freq.female)} y1={0} 
									x2={this.scaleFreq(d[role].freq.male)} y2={0} 
									style= {{ stroke: "#333" }}/>	
								<text transform={`translate(${xOffset}, 0)`}>
									{d.sector}
								</text>
							</g>
						);
					})
				}
			</svg>
		);
	}
}

OverallBySectorStats.propTypes = {
	race: PropTypes.string,
	role: PropTypes.string,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	animDuration: PropTypes.number
};

OverallBySectorStats.defaultProps = {
	race: "all",
	role: "all",
	animDuration: 1000
};

export default OverallBySectorStats;