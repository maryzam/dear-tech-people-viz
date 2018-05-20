import React from 'react';
import PropTypes from "prop-types"; 

import Visualization from "./Visualization";

import './styles.css';

const OverallByGenderSection = (props) => (
		<article className="overall-by-gender">
			<Visualization { ...props } />
			<section className="note">
				<p>Most of us agree that tech could be a little more diverse. After talking to 50 HR leaders and hundreds of employees, we found diversity data to be incredibly sparse.</p>
				<p>Dear Tech People is dedicated to unearthing the data behind diversity in tech, starting with a race/gender ranking of 100 top tech companies.</p>
				<p>They analyzed over 6000 of profiles and now have the data to hold companies accountable.</p>
			</section>
		</article>
	);

export default OverallByGenderSection;
