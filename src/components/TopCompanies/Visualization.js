import React from 'react';
import * as d3 from "d3";
import { throttle } from 'lodash'; 

import Provider from "../../utils/dataProvider";

const labelSize = { width: 100, height: 30, offset: 10 }

const roles = [ "technical", "overall", "leadership"];

const data = Provider.getTopCompanies();
const rankingRange = data.map((d) => (d.ranking.overall)).filter((d) => !!d);
rankingRange.sort((a, b) => (a - b));

class TopCompaniesViz extends React.PureComponent {

	state = {
		width: 400,
		height: 200
	};

	setVizRef = (element) => { this.viz = element; }

	scaleRoles = d3.scalePoint().domain(roles).round(true)
	scaleRanking = d3.scalePoint().domain(rankingRange).round(true)

	updateScales() {
		const { width, height } = this.state;
		this.scaleRoles.range([0, width - labelSize.width]);
		this.scaleRanking.range([
								(labelSize.height + labelSize.offset), 
								(height - labelSize.height)
							]);
	}

	updateSize = () => { 
		const size = this.container.node().getBoundingClientRect();
		this.setState({ 
			width: size.width, 
			height: Math.max(size.height, 10 * labelSize.height) 
		});
	}

	onResize = throttle(this.updateSize, 200, { trailing: true });

	componentDidMount() {
		this.container = d3.select(this.viz);
		this.updateSize();
		window.addEventListener('resize', this.onResize);
	}

	componentWillUnmount() {
		this.onResize.cancel();
	    window.removeEventListener('resize', this.onResize);
	}

	render() {

		this.updateScales();

		const { width, height } = this.state;
		return (
			<section className="viz" ref={ this.setVizRef }>
				<svg width={ width } height={ height } >
					{ this.getHeader() }
					{ this.getAllLinks("technical", "overall") }
					{ this.getAllLinks("overall", "leadership") }
					{ this.getAllLabels() }
				</svg>
			</section>
		);
	}

	getHeader() {
		const dx = labelSize.width / 2;
		const dy = labelSize.height / 2 + 5;
		return(
			<g className="header">
				{
					roles.map((role) => (
						<g key={ role } className="label"
							transform={`translate(${this.scaleRoles(role)},0)`}>
							<rect width={labelSize.width} height={labelSize.height} />
							<text dx={dx} dy={dy}>{ role }</text>
						</g>
					))
				}
			</g>
		);
	}

	getAllLinks(fromRole, toRole) {
		const links = [];
		for (let i = 0; i < data.length; i++) {
			const curr = data[i];
			if (curr.ranking[fromRole] && curr.ranking[toRole]) {
				links.push((
					<path 
						key={`${curr.name}_tech`} 
						className="link"
						d={ this.getLink(curr, fromRole, toRole) }/>
					))
			}
		}
		return links;
	}

	getAllLabels() {
		const labels = [];
		for (let i = 0; i < data.length; i++) {
			const company = data[i];
			for (let role in company.ranking) {
				const label = this.getLabel(company, role)
				labels.push(label)
			}
		}
		return labels;
	}

	getLabel(company, role) {
		const ranking = company.ranking[role];
		return (
			<image 
				key={`${company.name}_${role}`}
				href={`assets/images/${ company.name }.png`}
				width={ labelSize.width } height={ labelSize.height }
				transform={`translate(${this.scaleRoles(role)},${this.scaleRanking(ranking)})`}>
			</image>
		);
	}

	getLink(company, fromRole, toRole) {
	  const offset = labelSize.height / 2;
	  const source = {
	  	x: this.scaleRoles(fromRole) + labelSize.width + labelSize.offset,
	  	y: this.scaleRanking(company.ranking[fromRole]) + offset
	  };
	  const target = {
	  	x: this.scaleRoles(toRole) - labelSize.offset,
	  	y: this.scaleRanking(company.ranking[toRole]) + offset
	  };
	  return `M ${source.x} ${source.y}
	  		C ${(source.x + target.x) / 2} ${source.y}
	  		${(source.x + target.x) / 2} ${target.y}
	  		${target.x} ${target.y}`;
	}
}

export default TopCompaniesViz;