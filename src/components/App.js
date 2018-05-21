import React from 'react';
import PropTypes from "prop-types"; 

import OverallByGenderSection from "./OverallByGender/Section";
import OverallBySectorSection from "./OverallBySector/Section";
import OverallByRaceSection from "./OverallByRace/Section";
import TopCompaniesSection from "./TopCompanies/Section";

const Header = (props) => ( <header></header>);
const Footer = (props) => ( 
		<footer>
		  	<p>Created | <a href="http://twitter.com/maryzamcode">Mary Zam</a></p>
	  		<p>Data | <a href="http://www.deartechpeople.com/">Dear Tech People</a></p>
		</footer>
	);

const App = (props) => (
		<React.Fragment>
			<Header />
			<main>
				 <OverallByGenderSection {...props} />
				 <OverallByRaceSection {...props} />
				 <OverallBySectorSection {...props} />
				 <TopCompaniesSection {...props} />
			</main>
			<Footer />
		</React.Fragment>
	);

export default App;