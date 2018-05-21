import React from 'react';
import PropTypes from "prop-types"; 

import './styles.css';

import Visualization from "./Visualization";
import CategorySwitch from "./CategorySwitch";

import Provider from "../../utils/dataProvider";

const roles = ["all", ...Provider.getRoles()];
const races = ["all", ...Provider.getRaces()];

class OverallBySectorSection extends React.PureComponent {

	state = {
		role: "all",
		race: "all"
	};

	onRoleChanged = (e) => {
		this.setState({
			role: e.target.dataset.category
		});
	};

	onRaceChanged = (e) => {
		this.setState({
			race: e.target.dataset.category
		});
	};

	render() {

		const { race, role } = this.state;

		return(
			<article className="overall-by-sector">
				<header>
					<h1>Gender breakdown by Industries & Races</h1>
				</header>
				<div className="flex">
					<Visualization {...this.props } {...this.state } />
					<section className="note">
						<CategorySwitch 
							label="Role"
							categories={ roles }
							current={ role } 
							handleClick={ this.onRoleChanged } />
						<CategorySwitch 
							label="Race"
							categories={ races }
							current={ race } 
							handleClick={ this.onRaceChanged } />
						<p>
							According to the data, we still can distinguish <span className="male">male</span> and <span className="female">female</span> industries.
						</p>
						<p>
							The <span>highest gap</span> between men & women even on non-tech positions is in such sectors as <strong>Security, Hardware and Infrastructure</strong>
						</p>
						<p>
							However, <strong>Ecommerce, Media & Helthcare</strong> companies have more female employees overall.
							But even in these industries there is <span>gender breakdown</span> in Tech&Leadership positions
						</p>
					</section>
				</div>
			</article>
		);
	}
}

OverallBySectorSection.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	animDuration: PropTypes.number
};

OverallBySectorSection.defaultProps = {
	animDuration: 1000
};

export default OverallBySectorSection;