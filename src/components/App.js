import React from 'react';
import PropTypes from "prop-types"; 

import OverallByGenderStats from "./OverallByGender/Visualization";
import OverallBySectorStats from "./OverallBySector/Section";
import OverallByRaceStats from "./OverallByRace/Visualization";
import TopCompanies from "./TopCompanies/Visualization";

const App = (props) => (
		<div className="main">
			 <OverallByGenderStats {...props} />
			 <OverallBySectorStats {...props} />
			 <OverallByRaceStats {...props} />
			 <TopCompanies {...props} />
		</div>
	);

export default App;