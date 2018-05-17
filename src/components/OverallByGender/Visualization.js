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

const data = Provider.getOverallByGender(600); // todo depends on element's size?
const roles = Provider.getRoles();

const scaleColor = d3.scaleOrdinal()
					.domain(["male", "female"])
					.range(["steelblue", "tomato"]);

const scaleOpacity = d3.scaleBand()
					.domain(roles)
					.range([0.3, 1]);

const scaleStroke = d3.scaleBand()
						.domain(roles)
						.range([6, 0]);

const baseColor = "#999";
const zeroOpacity = 1e-6;
const baseOpacity = scaleOpacity("other");
const baseStroke = `${scaleStroke("other")}px`;

class OverallByGenderViz extends React.PureComponent { 

	constructor(props) {
		super(props);

		this.state = getModeOptions(props.mode);
		this.setVizRef = (element) => { this.viz = element; };
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
			.style("strokeWidth", showRoles ? 
					(d) => `${scaleStroke(d.type)}px` : 
					baseStroke );
	}

	render() {
		const { width, height } = this.props;
		const pointRadius = Math.min(width / 30, height / 20) * 0.5;

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
								cx={ pointRadius * (2 * x + 1 )}
								cy={ pointRadius * (2 * y + 1 )}
								r={ pointRadius }
								style= {{ 
									fill: baseColor, 
									fillOpacity: zeroOpacity, 
									strokeWidth: baseStroke
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
	mode: "hidden",
	animDuration: 1000
};

export default OverallByGenderViz;