import React from 'react';
import PropTypes from "prop-types"; 

import OverallByRaceStats from "./viz/OverallByRaceStats";
import OverallBySectorStats from "./viz/OverallBySectorStats";
import OverallByGenderStats from "./viz/OverallByGenderStats";

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
			</div>
			<Footer />
		</div>
	);

export default App;