import { USER, DATA, FINISH_MODS, MY_MODS, setFinishMods, setMyMods } from './app_model.js';
import { MODULES } from './modules.js'; 

export function calculateModulesProgress()
{
	if (!USER || !DATA)
	{
		setMyMods(null);
		setFinishMods(null);
		return;	
	}
	console.log("INIT CALCULATE");
	
	let finishMods = [];
	let myMods = [];
	for (const module in MODULES)
	{
		const temas = MODULES[module];
		
		let modIndex = DATA[module];
		if (!modIndex) continue;
		
		if (isComplete(temas, modIndex))	finishMods.push(module);
		else								myMods.push(module);
	}
	setMyMods(myMods);
	setFinishMods(finishMods);
	console.log("Finish mods: " + FINISH_MODS);
	console.log("My mods: " + MY_MODS);
}

function isComplete(allValues, setValues) 
{
    const set = new Set(setValues);
    return allValues.every(value => set.has(value));
}
