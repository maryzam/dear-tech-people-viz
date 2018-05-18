import React from 'react';
import PropTypes from "prop-types"; 

import * as d3 from "d3";

import Provider from "../../utils/dataProvider";

import './styles.css';

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
					.range(["steelblue", "tomato"]);

const scaleOpacity = d3.scalePoint()
					.domain(roles)
					.range([0.3, 1]);

const baseColor = "#999";
const zeroOpacity = 1e-6;
const baseOpacity = scaleOpacity("other");

class OverallByGenderViz extends React.PureComponent { 

	constructor(props) {
		super(props);

		this.state = getModeOptions(props.mode);
		this.setVizRef = (element) => { this.viz = element; };
		this.scaleRadius = d3.scalePoint()
						.domain(roles)
						.range([4, 6]);
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
		const { showEmployees, showGenders, showRoles} = this.state;

		this.node = d3.select(this.viz);
		this.node
			.selectAll(".point")
			.data(data, function(d) { 
					return d ? d.id : d3.select(this).attr("item"); 
			});
		
		this.updateViz();
	}

	componentDidUpdate() {
		this.updateViz();
	}

	updateViz() {
		const { showEmployees, showGenders, showRoles} = this.state;

		this.node
			.selectAll(".point")
			.transition()
				.duration(this.props.animDuration)
			.style("fill-opacity", showRoles ? 
					(d) => scaleOpacity(d.type) :
					( showEmployees ? baseOpacity : 1e-6 ) )
			.style("fill", showGenders ? 
					(d) => scaleColor(d.gender) : 
					baseColor )
			.attr("r", showRoles ?
					((d) => (`${this.scaleRadius(d.type)}px`)) : 
					this.scaleRadius("other") );
	}

	render() {
		const { width, height } = this.props;
		const xStep = width / pointsGrid.x / 2;
		const yStep = height / pointsGrid.y / 2;
		const maxRadius = Math.min(xStep, yStep) * 0.9;
		const minRadius = maxRadius * 0.8;
		this.scaleRadius.range([minRadius, maxRadius]);

		return (
			<svg ref={ this.setVizRef }
					className="overall-by-gender"
					width={width} 
					height={height} >
				{
					data.map((d, i) => {
						const x = i % 30;
						const y = Math.floor( i / 30);
						return (
							<circle 
								key={d.id}
								item={d.id}
								className="point"
								cx={ xStep * (2 * x + 1 )}
								cy={ yStep * (2 * y + 1 )}
								r={ minRadius }
								style= {{ 
									fill: baseColor, 
									fillOpacity: zeroOpacity 
								}}
							/>)
					})
				}
			</svg>
		);
	}
};

OverallByGenderViz.propTypes = {
	mode: PropTypes.string,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	animDuration: PropTypes.number
};

OverallByGenderViz.defaultProps = {
	mode: "roles",
	animDuration: 1000
};

export default OverallByGenderViz;