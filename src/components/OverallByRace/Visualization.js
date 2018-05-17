import React from 'react';
import PropTypes from "prop-types"; 

import * as d3 from "d3";

import Provider from "../../utils/dataProvider";

const roles = Provider.getRoles();
const data = Provider.getOverallByRaceAndGender();

const angle = Math.PI / roles.length;
const angleTan = Math.tan(angle);

const scaleGenderColor = d3.scaleOrdinal()
					.domain(["male", "female"])
					.range(["steelblue", "tomato"]);

const scaleRoleColor = d3.scaleOrdinal()
					.domain(roles)
					.range(["#777", "#555", "#111"]);

const scaleRoleOpacity = d3.scaleBand()
					.domain(roles)
					.range([0.3, 1]);

const initRotation = Math.round(angle * (90 / Math.PI));
const scaleRotation = d3.scaleBand()
						.domain(roles)
						.range([initRotation, (360 + initRotation)]);

const arcWidth = 10;
const scaleArcAngle = d3.scaleLinear()
						.range([
							-(Math.PI + angle - 0.1) / 2,
							 (Math.PI - angle + 0.1) / 2
						]);

const arc = d3.arc()
				.cornerRadius(3)
				.startAngle((d) => scaleArcAngle(d.from))
				.endAngle((d) => scaleArcAngle(d.to));

class OverallByRaceViz extends React.PureComponent { 

	constructor(props) {

		super(props);

		this.viz = React.createRef();
		this.scaleSize = d3.scaleLinear();
		this.scaleArcRadius = d3.scaleLinear();
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
		const grid = this.getGridSize();
		const maxRadius =  grid.size / 2; 
		this.scaleSize.range([0, maxRadius ]);
		this.scaleArcRadius.range([maxRadius * 0.3, maxRadius]);
		
		return (
			<svg width={width} height={height} ref={ this.viz } >
				{
					data.map((d, i) => {
						const xCenter = grid.size * (Math.floor(i % grid.x) + 0.5);
						const yCenter = grid.size * (Math.floor(i / grid.x) + 0.5);
						return (
							<g key={d.race}
								transform={`translate(${ xCenter }, ${ yCenter })`}>
								{ this.renderRoles(d) }
								{ this.renderOverallGender(d) }
								{ this.renderOverallRoles(d) }
								<text dy="-5px">
									<textPath href={`#${d.race}_other`} startOffset="25%"> 
										{ d.race } 
									</textPath>
								</text>
							</g>							
						)})
				}
			</svg>
		);
	}

	renderRoles(d) {
		return d.roles.map((r) => (
					<path 
						key={ r.key }
						d={ this.createLeaf(r) }
						transform={ `rotate(${scaleRotation(r.role)})` }
						style={{
							fill: scaleGenderColor(r.gender),
							fillOpacity: scaleRoleOpacity(r.role)
						}}
					/>
				));
	}

	renderOverallGender(d) {
		const radius = this.scaleArcRadius(d.freq);
		arc.innerRadius(radius).outerRadius(radius + arcWidth);
		return [ (<path 
					key="all_female"
					d={ arc({ from: 0, to: d.ratio.female }) }
					style={{ fill: scaleGenderColor("female") }}
				/>),
				(<path 
					key="all_male"
					d={ arc({ from: d.ratio.female, to: 1 }) }
					style={{ fill: scaleGenderColor("male") }}
				/>)];
	}

	renderOverallRoles(d) {
		const radius = this.scaleArcRadius(d.freq);
		arc.innerRadius(radius + arcWidth * 1.5).outerRadius(radius + 2 * arcWidth);
		let start = 0;
		return roles.map((r) => {
				const end = start + d.ratio[r];
				const current = arc({ from: start, to: end});
				start = end;
				return (<path
					key={`all_${r}`}
					id={`${d.race}_${r}`}
					d={ current }
					style={{ fill: scaleRoleColor(r) }}
				/>)
			});
	}

	createLeaf(d) {
       	const x = this.scaleSize(d.ratio);
       	const xq = x / 2;
       	const yq = xq * angleTan * (d.gender === "male" ? -1: 1); 
       	return `M 0 0 Q ${xq} ${yq} ${x} 0 Z`
    }

    getGridSize() {

    	const { width, height } = this.props;
    	const total = data.length;
    	const ySize = Math.sqrt( total * (height / width));
    	
    	const floorGrid = { y: Math.floor(ySize) };
    	floorGrid.x = Math.ceil(total / floorGrid.y);
    	floorGrid.size = Math.floor(Math.min( width / floorGrid.x, height / floorGrid.y));

    	const ceilGrid = { y: Math.ceil(ySize) };
    	ceilGrid.x = Math.ceil(total / ceilGrid.y);
    	ceilGrid.size = Math.floor(Math.min( width / ceilGrid.x, height / ceilGrid.y));

    	return (ceilGrid.size > floorGrid.size) ? ceilGrid : floorGrid;
    }
};

OverallByRaceViz.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	animDuration: PropTypes.number
};

OverallByRaceViz.defaultProps = {
	animDuration: 1000
};

export default OverallByRaceViz;