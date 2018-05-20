import React from 'react';
import PropTypes from "prop-types"; 

import Visualization from "./Visualization";

import './styles.css';

const Section = (props) => (
		<article>
			<section className="viz">
				<Visualization { ...props } />
			</section>
			<section className="note">
				<div>Text 1</div>
				<div>Text 3</div>
				<div>Text 2</div>
			</section>
		</article>
	);

export default Section;
