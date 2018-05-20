import React from 'react';
import PropTypes from "prop-types"; 

import Visualization from "./Visualization";

import './styles.css';

const TopCompaniesSection = (props) => (
		<article className="top-companies flex">
			<section className="note">
				<h2>Top 10 companies by Ranking</h2>
				<p>Learn more about DearTechPeople methodology <a href="http://www.deartechpeople.com/methodology">here</a></p>
			</section>
			<Visualization { ...props } />
		</article>
	);

export default TopCompaniesSection;
