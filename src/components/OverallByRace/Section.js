import React from 'react';
import PropTypes from "prop-types"; 

import Visualization from "./Visualization";

import './styles.css';

const OverallByRaceSection = (props) => (
		<article className="flex overall-by-race">
			<section className="note">
				<div>Text 1</div>
				<div>Text 3</div>
				<div>Text 2</div>
			</section>
			<Visualization { ...props } />
		</article>
	);

export default OverallByRaceSection;
