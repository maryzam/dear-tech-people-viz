import React from 'react';
import PropTypes from "prop-types"; 

import OverallByRaceStats from "./viz/OverallByRaceStats";

const Header = (props) => ( 
	<header>TODO: Header</header>
);

const Footer = (props) => ( 
	<footer>TODO: Footer</footer>
);

const App = ({ width, height }) => (
		<div>
			<Header />
			<div className="main"
				 style={ { border: "1px solid black", padding: "20px" }} >
				<OverallByRaceStats 
						width = { width } 
						height = { height }	
					/>
			</div>
			<Footer />
		</div>
	);

export default App;