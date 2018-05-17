import React from 'react';
import PropTypes from "prop-types"; 

import * as d3 from "d3";

import Provider from "../../utils/dataProvider";

const sectors = Provider.getSectors();
const data = Provider.getOverallBySectors();

const labelOffset = 70;
const padding = { x: 10, y: 10 }

class OverallBySectorStats extends React.PureComponent {

	constructor(props) {
		super(props);

		this.setVizRef = (element) => { this.viz = element; };

		this.scaleSectors = d3.scaleBand().domain(sectors).round(true);
		this.scaleFreq = d3.scaleLinear();
		this.scaleTotal = d3.scaleLinear();
	}

	componentDidMount() {
		
		this.node = d3.select(this.viz);
		this.updateViz();
	}

	componentDidUpdate() {
		this.updateViz();
	}

	updateViz() {

		this.updateScales();

		const { race, role, animDuration } = this.props;

		const nodes = this.node
			.selectAll(".sector")
			.data(data[race], function(d) { 
				return d ? d.sector : this.dataset.sector; 
			});

		nodes
			.transition().duration(animDuration)
			.attr("transform", (d) => (`translate(0, ${this.scaleSectors(d.sector)})`));

		nodes
			.select(".male")
			.transition().duration(animDuration)
			.attr("cx", (d) => this.scaleFreq(d[role].freq.male))
			.attr("r", (d) => this.scaleTotal(d[role].male))
			.style("fill-opacity", (d) => (d[role].male > 0 ? 0.5 : 1e-6));

		nodes
			.select(".female")
			.transition().duration(animDuration)
			.attr("cx", (d) => this.scaleFreq(d[role].freq.female))
			.attr("r", (d) => this.scaleTotal(d[role].female))
			.style("fill-opacity", (d) => (d[role].female > 0 ? 0.5 : 1e-6));

		nodes
			.select(".axis")
			.transition().duration(animDuration)
			.attr("x1", this.scaleFreq(0))
			.attr("x2", this.scaleFreq(1));

		nodes
			.select(".gap")
			.transition().duration(animDuration)
			.attr("x1", (d) => this.scaleFreq(d[role].freq.female))
			.attr("x2", (d) => this.scaleFreq(d[role].freq.male))
			.style("stroke", (d) => (d[role].freq.female < 0.5 ? "steelblue": "tomato"));

		nodes
			.select(".label")
			.transition().duration(animDuration)
			.style("fill-opacity", (d) => (d[role].all > 0 ? 1 : 0.3 ))

	}

	updateScales() {
		const { race, role, height, width } = this.props;

		const vizHeight = height - padding.y * 2;
		const vizWidth = width - labelOffset - padding.y * 2;

		this.scaleSectors.range([0, vizHeight]);
		this.scaleFreq.range([0, vizWidth]);

		const maxRadius = this.scaleSectors.bandwidth() / 2;
		const maxCount = d3.max(data[race], (d) => (Math.max(d[role].male, d[role].female)));
		this.scaleTotal.range([3, maxRadius]).domain([0, maxCount]);
	}

	render() {

		const { width, height, race, role } = this.props;
		const xMiddle = width / 2;
		const xMin = this.scaleFreq(0);
		const xMax = this.scaleFreq(1);

		return (
			<svg ref={ this.setVizRef }
					className="overall-by-gender"
					width={width} 
					height={height} >
				<g transform={`translate(${labelOffset},${padding.y})`}>
				{
					data[race].map((d) => {
						return (
							<g key={ d.sector }
								data-sector={ d.sector }
								className="sector"
								transform={`translate(0, ${this.scaleSectors(d.sector)})`}>
								<line 
									className="axis"
									x1={ xMin } y1={0} 
									x2={ xMax } y2={0}/>	
								<line 
									className="gap"
									x1={ xMiddle } y1={0} 
									x2={ xMiddle } y2={0} />	
								<circle 
									className="male"
									cx={ xMiddle } cy={0} r={0} />	
								<circle 
									className="female"
									cx={ xMiddle } cy={0} r={0}/>	
								<text 
									className="label"
									dx={-7} dy={2}>
									{d.sector}
								</text>
							</g>
						);
					})
				}
				</g>
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