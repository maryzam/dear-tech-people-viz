import React from 'react';
import PropTypes from "prop-types"; 
import { throttle } from 'lodash'; 

import * as d3 from "d3";

import Provider from "../../utils/dataProvider";
import Tooltip from "./Tooltip";

const sectors = Provider.getSectors();
const data = Provider.getOverallBySectors();

const labelOffset = 70;
const padding = { x: 10, y: 10 }

class OverallBySectorStats extends React.PureComponent {

	state = {
		gender: null,
		data: null,
		position: null
	}

	setVizRef = (element) => { this.viz = element; };

	scaleSectors = d3.scalePoint().domain(sectors).round(true);
	scaleFreq = d3.scaleLinear();
	scaleTotal = d3.scaleLinear();

	componentDidMount() {
		
		this.node = d3.select(this.viz);
	    this.onResize = throttle(this.updateViz, 200, { trailing: true });

	    window.addEventListener('resize', this.onResize);

	    this.updateViz();
	    this.addHoverEvents();
	}

	componentDidUpdate() {
		this.updateViz();
	}

	componentWillUnmount() {
		this.onResize.cancel();
	    window.removeEventListener('resize', this.onResize);
	}

	setupTooltip = (data) => {
		const position = { 
			x: d3.event.clientX,
			y: d3.event.clientY 
		};
		const target = d3.event.target;
		const gender = target.dataset.gender;
		this.setState({ position, data, gender });
	}

	updateTooltip = () => {
		const position = { 
			x: d3.event.clientX,
			y: d3.event.clientY 
		};
		this.setState({ position });
	}

	removeTooltip = () => {
		this.setState({ gender: null, position: null, data: null });
	}

	updateViz = () => {

		this.updateScales();

		const { race, role, animDuration } = this.props;

		const nodes = this.node
			.select("svg")
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
			.attr("data-gender", "male")
			.style("fill-opacity", (d) => (d[role].male > 0 ? 0.5 : 1e-6));

		nodes
			.select(".female")
			.transition().duration(animDuration)
			.attr("cx", (d) => this.scaleFreq(d[role].freq.female))
			.attr("r", (d) => this.scaleTotal(d[role].female))
			.attr("data-gender", "female")
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
			.style("stroke", (d) => (d[role].freq.female < 0.5 ? "#057896": "#FC0458"));

		nodes
			.select(".label")
			.transition().duration(animDuration)
			.style("fill-opacity", (d) => (d[role].all > 0 ? 1 : 0.3 ))
	}

	addHoverEvents() {
		const nodes = this.node
			.select("svg")
			.selectAll(".mark");

		nodes
			.on("mouseover", this.setupTooltip)
			.on("mouseout", this.removeTooltip)
			.on("mousemove", this.updateTooltip);
	}

	updateScales() {
		const { race, role } = this.props;
		const { width, height } = this.node.node().getBoundingClientRect();

		const vizHeight = height - padding.y * 2;
		const vizWidth = width - labelOffset - padding.y * 2;

		this.scaleSectors.range([0, vizHeight]);
		this.scaleFreq.range([0, vizWidth]);

		const maxRadius = this.scaleSectors.step() / 2;
		const maxCount = d3.max(data[race], (d) => (Math.max(d[role].male, d[role].female)));
		this.scaleTotal.range([3, maxRadius]).domain([0, maxCount]);

		this.node
				.select("svg")
				.attr("width", width)
				.attr("height", height);
	}

	render() {

		const { width, height, race, role } = this.props;
		const xMiddle = width / 2;
		const xMin = this.scaleFreq(0);
		const xMax = this.scaleFreq(1);

		return (
			<section className="viz" ref={ this.setVizRef }>
				<svg width={width} height={height} >
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
										className="male mark"
										cx={ xMiddle } cy={0} r={0} />	
									<circle 
										className="female mark"
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
				<Tooltip {...this.state } {...this.props} />
			</section>
		);
	}
}

OverallBySectorStats.propTypes = {
	race: PropTypes.string,
	role: PropTypes.string,
	animDuration: PropTypes.number
};

OverallBySectorStats.defaultProps = {
	race: "all",
	role: "all",
	animDuration: 1000
};

export default OverallBySectorStats;