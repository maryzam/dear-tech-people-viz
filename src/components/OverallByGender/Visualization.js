import React from 'react';
import PropTypes from "prop-types";
import { throttle } from 'lodash'; 

import * as d3 from "d3";

import Provider from "../../utils/dataProvider";

function getModeOptions(mode) {
	const opts = {
			showEmployees: true,
			showGenders: false,
			showRoles: false
		};

	switch (mode) {
		case "gender":
			opts.showGenders = true; 
			break;
		case "roles": 
			opts.showGenders = true;
			opts.showRoles = true;
			break;
		case "hidden":
			opts.showEmployees = false;
			break;
	}

	return opts;
}

const pointsGrid = { x: 30, y: 20 };

const data = Provider.getOverallByGender(pointsGrid.x * pointsGrid.y);
const roles = Provider.getRoles();

const scaleColor = d3.scaleOrdinal()
					.domain(["male", "female"])
					.range(["#057896", "#FC0458"]);

const scaleOpacity = d3.scalePoint()
					.domain(roles)
					.range([0.3, 1]);

const baseColor = "#999";
const zeroOpacity = 1e-6;
const baseOpacity = scaleOpacity("other");

class OverallByGenderViz extends React.PureComponent { 

	state = {
			showEmployees: true,
			showGenders: false,
			showRoles: false
		};

	setVizRef = (element) => { this.viz = element; }

	scaleX = d3.scaleLinear().domain([0, pointsGrid.x]);
	scaleY = d3.scaleLinear().domain([0, pointsGrid.y]);
	scaleRadius = d3.scalePoint().domain(roles);

	updateScales = () => {

		const { width, height } = this.container.node().getBoundingClientRect();

		const xStep = width / pointsGrid.x / 2;
		const yStep = height / pointsGrid.y / 2;

		this.scaleX.range([xStep, (width + xStep)]);
		this.scaleY.range([(height - 2 * yStep), -yStep]);

		const maxRadius = Math.min(xStep, yStep) * 0.9;
		const minRadius = maxRadius * 0.8;
		this.scaleRadius.range([minRadius, maxRadius]);

		this.container
			.select("svg")
				.attr("width", width)
				.attr("height", height);

		this.updateViz(0);
	}

	
	static getDerivedStateFromProps(nextProps, prevState) {
		const newState = getModeOptions(nextProps.mode);
		for (let option in newState) {
			if (prevState[option] !== newState[option]) {
				return newState;
			}
		}
		return null;
	}

	componentDidMount() {

		this.container = d3.select(this.viz);
		this.container
			.select("svg")
			.selectAll(".point")
			.data(data, function(d) { 
					return d ? d.id : d3.select(this).attr("item"); 
			});
		
		this.updateScales();
		this.updateViz(0);

		this.onResize = throttle(this.updateScales, 200, { trailing: true });
		window.addEventListener('resize', this.onResize);
	}

	componentDidUpdate() {
		this.updateViz(this.props.animDuration);
	}

	componentWillUnmount() {
		this.onResize.cancel();
	    window.removeEventListener('resize', this.onResize);
	}

	updateViz(animDuration) {

		const { showEmployees, showGenders, showRoles } = this.state;

		let points = this.container.select("svg").selectAll(".point");

		if (animDuration > 0) {
			points = points.transition().duration(animDuration);
		}

		points
			.style("fill-opacity", showRoles ? 
					(d) => scaleOpacity(d.type) :
					( showEmployees ? baseOpacity : 1e-6 ) )
			.style("fill", showGenders ? 
					(d) => scaleColor(d.gender) : 
					baseColor )
			.attr("r", showRoles ?
					((d) => (`${this.scaleRadius(d.type)}px`)) : 
					this.scaleRadius("other") )
			.attr("cx", (d, i) => this.scaleX(i % pointsGrid.x))
			.attr("cy", (d, i) => this.scaleY(Math.floor( i / pointsGrid.x)));
	}

	render() {
		const { width, height } = this.state;
		const { isFixed } = this.props;

		return (
			<div ref={ this.setVizRef }>
				<svg width={ width } height={ height } >
					{
						data.map((d, i) => {
							const x = i % pointsGrid.x;
							const y = Math.floor( i / pointsGrid.x);
							return (
								<circle 
									key={d.id}
									item={d.id}
									className="point"
									cx={ this.scaleX(x) }
									cy={ this.scaleY(y) }
									r={ 0 }
									style= {{ 
										fill: baseColor, 
										fillOpacity: zeroOpacity 
									}}
								/>)
							})
						}
				</svg>
			</div>
		);
	}
};

OverallByGenderViz.propTypes = {
	mode: PropTypes.string,
	animDuration: PropTypes.number
};

OverallByGenderViz.defaultProps = {
	mode: "hidden",
	animDuration: 400
};

export default OverallByGenderViz;