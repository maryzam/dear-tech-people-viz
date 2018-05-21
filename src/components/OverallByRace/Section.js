import React from 'react';
import PropTypes from "prop-types"; 

import Visualization from "./Visualization";

import './styles.css';

const OverallByRaceSection = (props) => (
		<article className="overall-by-race">
			<header>
				<h1>Are the situation the same across the races?</h1>
			</header>
			<div className="flex">
				<section className="note">
					<p></p>
				</section>
				<Visualization { ...props } />
			</div>
		</article>
	);

export default OverallByRaceSection;
