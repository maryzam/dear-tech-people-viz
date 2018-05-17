import React from 'react';
import PropTypes from "prop-types"; 

const CategorySwitch = ({ categories, current, handleClick }) => (
		<div className="category-switch">
			{
				categories.map((category) => (
						<button
							key={category}
							data-category={category}
							className={ (category === current) ? "btn current" : "btn" }
							onClick={ handleClick }>
								{ category }
						</button>
					))
			}
		</div>
	);

CategorySwitch.propTypes = {
	categories: PropTypes.arrayOf(PropTypes.string).isRequired,
	current: PropTypes.string,
	handleClick: PropTypes.func.isRequired
};

export default CategorySwitch;