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
			<article className="overall-by-gender">
				<section >
					<CategorySwitch 
						categories={ roles }
						current={ role } 
						handleClick={ this.onRoleChanged } />
					<CategorySwitch 
						categories={ races }
						current={ race } 
						handleClick={ this.onRaceChanged } />
					<Visualization {...this.props } {...this.state } />
				</section>
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