import React from 'react';
import PropTypes from "prop-types"; 

import OverallByGenderSection from "./OverallByGender/Section";
import OverallBySectorSection from "./OverallBySector/Section";
import OverallByRaceSection from "./OverallByRace/Section";
import TopCompaniesSection from "./TopCompanies/Section";

const Header = (props) => ( <header></header>);
const Footer = (props) => ( 
		<footer>
		  	<p>Created | <a href="http://twitter.com/maryzamcode" targer="_blank">Mary Zam</a></p>
	  		<p>Data | <a href="http://www.deartechpeople.com/" targer="_blank">Dear Tech People</a></p>
	  		<p>Inspiration | <a href="https://www.vizforsocialgood.com" targer="_blank">Viz for Social Good</a></p>
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