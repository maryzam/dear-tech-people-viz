
import overallByRaceGender from "../../data/statsByRaceAndGender.json";

const positions = { other: true, technical: true, leadership: true };

function getOverallByGender() {
	
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
	getOverallByRaceAndGender
};