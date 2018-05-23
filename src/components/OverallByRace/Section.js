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
					<p>Distribution by Roles is different across the races</p>
					<p>White people have the highest percentage of employees at <span>Leadership positions (4.2%)</span>.
					 However only 1.6% of Black people are on the Leadership positions as well.</p>
					<p>Otherwise, there is a largest gender breakdown in Tech between white men and women.
					  <span>Only 16% of employees</span> of this category are <span className="female">women</span>.
					  However, there are less than <span className="male">3 men</span> per woman in Tech when we talk about Black or Asian races.</p>
					 <p>
					 	<span>How to read the viz</span>
					 </p>
					 <p>Each leaf shows the gender distribution among the role</p>
					 <p>
					 	<span className="leaf male leadership"></span>
					 	<span className="leaf female leadership"></span>
					 	<span className="label">Leadership roles</span>
					 </p>
					 <p>
					 	<span className="leaf male tech"></span>
					 	<span className="leaf female tech"></span>
					 	<span className="label">Technical roles</span>
					 </p>
					 <p>
					 	<span className="leaf male other"></span>
					 	<span className="leaf female other"></span>
					 	<span className="label">Other roles</span>
					 </p>
					 <p>Grey arcs display the percentage of each role types.</p>
					 <p>Blue&Red arcs show the overall gender ratio.</p>
					 <p>
					 	For more interesting facts hover the charts
					 </p>
				</section>
				<Visualization { ...props } />
			</div>
		</article>
	);

export default OverallByRaceSection;
