import React from 'react';
import PropTypes from "prop-types"; 

import Visualization from "./Visualization";

const Section = (props) => (
		<article>
			<Visualization { ...props } />
			<section className="note">
				<div>Text 1</div>
				<div>Text 3</div>
				<div>Text 2</div>
			</section>
		</article>
	);

export default Section;
