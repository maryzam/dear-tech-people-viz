
import overallByGender from "../../data/overallByGender.json";
import overallByRaceGender from "../../data/statsByRaceAndGender.json";

const positions = { other: true, technical: true, leadership: true };

function getPositions() {
	return Object.keys(positions);
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

function getOverallByRaceAndGender() {

	return overallByRaceGender.map((r) => {
			const result = { 
				data: r,
				ratio: r.all.female / r.all.total,
				stack: []
			};

			let innerRadius = 0;
			
			for (let key in positions) {
				const current = r[key];
				const outerRadius = innerRadius + current.total / r.all.total;
				const ratioAngle = current.female / current.total;
				result.stack.push({
					type: key,
					gender: "female",
					radius: { from: innerRadius, to: outerRadius},
					angle: { from: 0, to: ratioAngle }
				});
				result.stack.push({
					type: key,
					gender: "male",
					radius: { from: innerRadius, to: outerRadius},
					angle: { from: ratioAngle, to: 1 }
				});
				innerRadius = outerRadius;
			}

			return result;
		});
};

export default {
	getPositions,
	getOverallByRaceAndGender,
	getOverallByGender
};