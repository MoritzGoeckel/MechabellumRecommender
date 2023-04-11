const endl = "<br/>"

let getUnitIdx = (name) => {
	if(name in syns){
		return syns[name]
	}
	return -1
}

let addScores = (target, source) => {
	for(let id in source){
		if(id in target){
			target[id] += source[id]
		} else {
			target[id] = source[id]
		}
	}
}

let sortScores = (scores) => {
	let result = []
	for(let id in scores){
		result.push({"id": id, "score": scores[id]})
	}
	result.sort((a,b) => {
		return a["score"] - b["score"]
	})
	return result
}

let limitScores = (scores, num) => {
	let result = []
	for(let idx = 0; idx < num && idx < scores.length && scores[idx]["score"] < 0; ++idx){
		result.push(scores[idx])
	}
	return result
}

let scoresToString = (scores) => {
	let result = [] 
	for(let element of scores){
		result.push(names[element["id"]] + " (" + element["score"] + ")")
	}
	return result.join(", ")
}

/*let combineScores = (left, right) => {
	let result = {}
	addScores(result, left)
	addScores(result, right)
	return result
}*/

let unitHandler = (unit, num) => {
	let idx = getUnitIdx(unit)
	if(idx == -1){
		return {"report": unit + ": Not found" + endl, "ctors": {}}
	}
	
	let fullName = names[idx]

	let ctorNames = []
	let ctorScores = {}
	let ctors = counters[idx]
	for(let ctorIdx in ctors){
		counterScore = ctors[ctorIdx]
		if(counterScore == -2){
			ctorNames.push(names[ctorIdx])
		}

		if(counterScore == -1){
			ctorNames.push("(" + names[ctorIdx] + ")")
		}

		ctorScores[ctorIdx] = counterScore // * num
	}

	ctorNames.sort()
	ctorNames.reverse()

	return {"report": fullName + " (" + unit + "): " + ctorNames.join(", ") + endl, "ctors": ctorScores}
}

let output = document.getElementById('out')
let input = document.getElementById('in')

let inputHandler = () => {
	result = endl + "<b>Enemy units and answer:</b>" + endl

	let lines = input.value.split(/\r?\n/)
	let scores = {}
	for (let line of lines){
		let parsed = line.split(/ /)
		let unit = undefined
		if(parsed.length > 0){
			unit = parsed[0]
		}
		let num = 1
		if(parsed.length > 1){
			num = parsed[1]
		}

		if(unit != undefined && unit != ""){
			let pair = unitHandler(unit, num)
			result += pair["report"]
			addScores(scores, pair["ctors"])
		}
	}

	let sortedScores = sortScores(scores)
	let topScores = limitScores(sortedScores, 5)
	result += endl
	result += "<b>Combined answer:</b>" + endl
	result += scoresToString(topScores)

	output.innerHTML = result
}

input.addEventListener("input", inputHandler)

