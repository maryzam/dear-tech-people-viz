import React from 'react';
import PropTypes from "prop-types"; 

import * as d3 from "d3";

import Provider from "../../utils/dataProvider";

const labelSize = { width: 100, height: 30 }

const roles = [ "technical", "overall", "leadership"];

const data = Provider.getTopCompanies();
const rankingRange = data.map((d) => (d.ranking.overall)).filter((d) => !!d);
rankingRange.sort((a, b) => (a - b));

class TopCompaniesViz extends React.PureComponent {

	constructor(props) {
		super(props);

		const { width, height } = this.props;

		this.scaleRoles = d3.scalePoint()
							.round(true)
							.domain(roles)
							.range([0, width - labelSize.width]);

		this.scaleRanking = d3.scalePoint()
							.round(true)
							.domain(rankingRange)
							.range([0, height - labelSize.height]);
	}

	updateScales() {
		const { width, height } = this.props;
		this.scaleRoles.range([0, width - labelSize.width]);
		this.scaleRanking.range([0, height - labelSize.height]);
	}

	render() {

		const { width, height } = this.props;

		return (
			<div>
				<svg width={ width } height={ height }>


					{
						data.filter((d) => (d.ranking.technical && d.ranking.overall))
							.map((d)=> (
									<path key={`${d.name}_tech`} 
										  d={ this.getLink(d, "technical", "overall") }
										  style={{stroke: "black"}}/>
								))
					}
					{
						data.filter((d) => (d.ranking.overall && d.ranking.leadership))
							.map((d)=> (
									<path key={`${d.name}_lead`} 
										  d={ this.getLink(d, "overall", "leadership") }
										  style={{stroke: "black" }}/>
								))
					}
					{
						data.map((company) => {
							const items = [];
							for (let role in company.ranking) {
								const ranking = company.ranking[role];
								items.push((
									<image 
										key={`${company.name}_${role}`}
										href={`assets/images/${ company.name }.png`}
										width={ labelSize.width } height={ labelSize.height }
										transform={`translate(${this.scaleRoles(role)},${this.scaleRanking(ranking)})`}>
									</image>)
								);
							}
							return items;
						})
					}

				</svg>
			</div>
			);
	}

	getLink(company, fromRole, toRole) {
	  const offset = labelSize.height / 2;
	  const source = {
	  	x: this.scaleRoles(fromRole) + labelSize.width,
	  	y: this.scaleRanking(company.ranking[fromRole]) + offset
	  };
	  const target = {
	  	x: this.scaleRoles(toRole),
	  	y: this.scaleRanking(company.ranking[toRole]) + offset
	  };
	  return "M" + source.x + "," + source.y
	      + "C" + (source.x + target.x) / 2 + "," + source.y
	      + " " + (source.x + target.x) / 2 + "," + target.y
	      + " " + target.x + "," + target.y;
	}
}


TopCompaniesViz.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	animDuration: PropTypes.number
};

TopCompaniesViz.defaultProps = {
	animDuration: 1000
};

export default TopCompaniesViz;