
import overallByGender from "../data/overallByGender.json";
import overallByRaceGender from "../data/statsByRaceAndGender.json";
import overallBySectors from "../data/statsBySectorAndGender.json";
import topCompanies from "../data/topCompanies.json";

const races = [ "white", "black", "asian", "latinx" ]
const roles = [ "other", "technical", "leadership"];
const genders = ["male", "female"];

function getRaces() {
	return [...races];
}

function getRoles() {
	return [...roles];
}

function getSectors() {
	return overallBySectors.all.map((d) => (d.sector));
}

function getOverallByGender(total) {
	const perPoint = total / overallByGender.all.total;
	const maleTotal = Math.round(overallByGender.all.male * perPoint);
	const femaleTotal = total - maleTotal;
	const maleTech = Math.round(overallByGender.technical.male * perPoint);
	const femaleTech =Math.round(overallByGender.technical.female * perPoint);
	const maleLead = Math.round(overallByGender.leadership.male * perPoint);
	const femaleLead = Math.round(overallByGender.leadership.female * perPoint);

	const points = generatePoinst("male", maleTotal, maleTech, maleLead);
	const morePoints = generatePoinst("female", femaleTotal, femaleTech, femaleLead);
	points.push(...morePoints);
	points.forEach((d, i) => { d.id = i; });
	return	points.sort(() => (Math.random() - 0.5));
}

function generatePoinst(gender, total, tech, leadership) {
	const points = [];
	const techLead = tech + leadership;
	for (let i = 0; i < total; i++) {
		const type = (i < leadership) ? "leadership" : 
					(i < techLead) ? "technical" :
					"other";
		points.push({ gender, type });
	}
	return points;
}

function getOverallByRace() {
	const data = {}
	overallByRaceGender.map((d) => {
		data[d.race] = Object.assign({}, d);
	});
	return data;
}

function getOverallByRaceAndGender() {

	return overallByRaceGender.map((d) => {
			const result = { 
				race: d.race,
				freq: d.freq,
				ratio : {
					female: d.all.female / d.all.total,
					technical: d.technical.total / d.all.total,
					leadership: d.leadership.total / d.all.total,
					other: d.other.total / d.all.total
				},
				roles: []
			};
			roles.forEach((role) => {
				const current = d[role];
				genders.forEach((gender) => {
					result.roles.push({
						role,
						gender,
						ratio: current[gender] / current.male,
						key: `${role}_${gender}`
					});
				});
			});
			return result;
		});
};

function getOverallBySectors() {
	return overallBySectors;
}

function getTopCompanies() {
	return topCompanies;
}

export default {
	getRoles,
	getRaces,
	getSectors,
	getOverallByRace,
	getOverallByRaceAndGender,
	getOverallByGender,
	getOverallBySectors,
	getTopCompanies
};