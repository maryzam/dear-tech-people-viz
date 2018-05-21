import React from 'react';
import PropTypes from "prop-types"; 
import { throttle } from 'lodash'; 

import Visualization from "./Visualization";

import './styles.css';

const sectionData = [
	{
		mode: "hidden",
		text: `<p>Most of us agree that tech could be a little more diverse.</p>
		       <p>But is it still a real problem nowdays even for the most progressive Companies and Start Ups  of San Francisco?</p>`
	},
	{
		mode: "employees",
		text: `<p>A new initiative called <a href="http://www.deartechpeople.com/">DearTechPeople</a> analyzed tens of thousands of LinkedIn profiles and now have the data to hold companies accountable.</p>
				<p>They compiled a <span>Race/Gender ranking</span> for 100 tech companies acoording.</p>
				<p>But who are these people?</p>
				<p>Let's take a look!</p>`
	},
	{
		mode: "gender",
		text: `<p>DearTechPeople used a combination of name analyzers, facial recognition technology, and manual identification through Mechanical Turk to determine an individual employee’s race and gender.</p>
			  <p>As the result they've got an information about over than 6'000 people.</p>
			  <p>About <strong>3'700 profiler</strong> are owened by <span class="male">men</span></p>
			  <p>And almost <strong>2'400 profiles</strong> have been recognised as <span class="female">female</span></p>`
	},
	{
		mode: "roles",
		text: `<p>They divided employees by their roles as well</p>
			   <p>They defined <span>technical</span> to be anyone who conducts a job that is technical in nature, regardless of whether they are specifically in the engineering department</p>
			   <p>They've chosen to classify <span>leadership</span> as anyone who is a VP and above (CEO, CTO, CMO and etc.)</p>`
	}
];

function isMainViewport(bounding) {
	const heigth = (window.innerHeight || document.documentElement.clientHeight);
	return (bounding.top >= 0 && bounding.top / heigth < 0.5) || 
		   (bounding.top < 0 && bounding.bottom >= 0 && bounding.bottom / heigth > 0.5 );
}

class OverallByGenderSection extends React.PureComponent 
{
	state = {
		mode: "hidden",
		isFixed: true
	};

	setNodeRef = (element) => { this.node = element; }

	updateSection = () => {
		const sections = this.node.children;
		const last = sections.length - 1;
		for (let i = 0; i < sections.length; i++) {
			const current = sections[i];
			if (!current.className.includes("note")) {
				continue;
			}
			const bounding = current.getBoundingClientRect();
			if (isMainViewport(bounding)) {
				const mode = current.dataset.mode || "";
				const isFixed = (i !== last) || (bounding.top > 10);
				this.setState({ mode, isFixed });
				break;
			}
		}
	};

	componentDidMount() {
		this.onScroll = throttle(this.updateSection, 100, { trailing: true });
	    this.attachListener();
	}

	componentWillUnmount() {
	    this.removeListener();
	}

	attachListener() {
		window.addEventListener("scroll", this.onScroll);
		window.addEventListener("resize", this.onScroll);
	}

	removeListener() {
	    window.removeEventListener("scroll", this.onScroll);
	    window.removeEventListener("resize", this.onScroll);
	}

	render() {
		const { mode, isFixed } = this.state;

		return (
			<article className="overall-by-gender" ref={ this.setNodeRef }>
				<section className={`viz ${ isFixed ? "fixed": "bottom" }`}>
					<header>
						<h1>Tech&Leadership diversity</h1>
						<h3>across 100 best companies in 18 sub-industries within tech</h3>
					</header>
					<Visualization mode={ mode } />
				</section>
				{ this.renderNotes() }
			</article>
		);
	}

	renderNotes = () => {
		return (
			<React.Fragment>
				{ sectionData.map((s) => (
					<section 
						key = { s.mode}
						data-mode = { s.mode }
						className="note">
						<div dangerouslySetInnerHTML={{__html: s.text }}>
						</div>
					</section>)
				)}
			</React.Fragment>
		);
	}
}

export default OverallByGenderSection;
