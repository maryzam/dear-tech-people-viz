import React from 'react';
import PropTypes from "prop-types"; 

import OverallByGenderStats from "./OverallByGender/Visualization";
import OverallBySectorStats from "./OverallBySector/Section";
import OverallByRaceStats from "./OverallByRace/Visualization";
import TopCompanies from "./TopCompanies/Visualization";

const Header = (props) => ( 
	<header>TODO: Header</header>
);

const Footer = (props) => ( 
	<footer>TODO: Footer</footer>
);

const App = (props) => (
		<div>
			<Header />
			<div className="main"
				 style={ { border: "1px solid black", padding: "20px" }} >
				 <OverallByGenderStats {...props} />
				 <OverallBySectorStats {...props} />
				 <OverallByRaceStats {...props} />
				 <TopCompanies {...props} />
			</div>
			<Footer />
		</div>
	);

export default App;