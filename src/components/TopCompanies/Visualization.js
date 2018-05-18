import React from 'react';
import PropTypes from "prop-types"; 

import * as d3 from "d3";

import Provider from "../../utils/dataProvider";

const padding = { x : 50, y: 10 };

const roles = ["overall", "technical", "leadership"];

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
							.range([padding.x, width - padding.x]);

		this.scaleRanking = d3.scalePoint()
							.round(true)
							.domain(rankingRange)
							.range([padding.y, height - padding.y]);
	}

	updateScales() {
		const { width, height } = this.props;
		this.scaleRoles.range([padding.x, width - padding.x]);
		this.scaleRanking.range([padding.y, height - padding.y]);
	}

	render() {

		const { width, height } = this.props;

		return (
				<svg width={ width } height={ height }>
					{
						data.map((company) => {
							const items = [];
							for (let role in company.ranking) {
								const ranking = company.ranking[role];
								items.push((
									<text 
										key={`${company.name}_${role}`}
										data-key={`${company.name}_${role}`}
										transform={`translate(${this.scaleRoles(role)},${this.scaleRanking(ranking)})`}>
										{company.name}
									</text>)
								);
							}
							return items;
						})
					}
					{
						data.filter((d) => (d.ranking.overall && d.ranking.technical))
							.map((d)=> (
									<link key={`${d.name}_tech`} 
										  d={ this.getLink(d, "overall", "technical") }
										  style={{stroke: "black"}}/>
								))
					}
				</svg>
			);
	}

	getLink(company, fromRole, toRole) {
	  const source = {
	  	x: this.scaleRoles(fromRole),
	  	y: this.scaleRanking(company.ranking[fromRole])
	  };
	  const target = {
	  	x: this.scaleRoles(toRole),
	  	y: this.scaleRanking(company.ranking[toRole])
	  };
	  return "M" + source.y + "," + source.x
	      + "C" + (source.y + target.y) / 2 + "," + source.x
	      + " " + (source.y + target.y) / 2 + "," + target.x
	      + " " + target.y + "," + target.x;
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