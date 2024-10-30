import * as FirebaseService from './FirebaseService.js';
import { MODULES } from './modules.js'; 

export let USER = null;

let DATA = null;
let FINISH_MODS = null;
let MY_MODS = null;

export function registerUserConfigFirebase(lang, acceptConditions, allowComunications)
{
	let config = {
		"lang": lang,
		"accept_conditions": acceptConditions,
		"allow_comunications": allowComunications,
		"date_register": Date.now()
	}
	FirebaseService.guardarDatos({"_config":config})
}

export function setUser(user)
{
	USER = user;
}
export function setData(data)
{
	DATA = data;
}
export function setFinishMods(finishMods)
{
	FINISH_MODS = finishMods;
}
export function setMyMods(myMods)
{
	MY_MODS = myMods;
}

export async function enrollModFirebase(modName)
{
	await FirebaseService.agregarClaveValorAlObjeto(modName, "ts", Date.now());
}

export async function unenrollModFirebase(modName)
{
	await FirebaseService.eliminarCampoDelDocumento(modName);
}

export async function markReadModUnitFirebase(modName, unitName)
{
	let unit = parseUnitName(unitName);
	let version = MODULES[modName][unit.unit][unit.subunit].v;
	
	if (!DATA[modName].ts) await enrollModFirebase(modName);
	
	await FirebaseService.agregarClaveValorAlObjeto(modName, unit.unit + "." + unit.subunit + ".v", version);
	await FirebaseService.agregarClaveValorAlObjeto(modName, unit.unit + "." + unit.subunit + ".ts", Date.now());
}

export async function markUnreadModUnitFirebase(modName, unitName)
{
	let unit = parseUnitName(unitName);
	await FirebaseService.eliminarClaveDeObjeto(modName, unit.unit + "." + unit.subunit);
}

export function isCurrentMod(modName)
{
	return MY_MODS && MY_MODS.includes(modName);
}
export function isFinishMod(modName)
{
	return FINISH_MODS && FINISH_MODS.includes(modName);
}
export function existCurrent()
{
	return MY_MODS && MY_MODS.length > 0;
}
export function existFinish()
{
	return FINISH_MODS && FINISH_MODS.length > 0;
}

export function isUserValid()
{
	if (USER) return true;
	else return false;
	//return USER && USER.emailVerified;
}

export async function updateFirebaseData()
{
	if (!isUserValid()) return;
	
	const docSnap = await FirebaseService.cargarDatos();
		
	if (docSnap.exists()) 
	{
    	const data = docSnap.data();
		setData(data);
	}
	else
	{
		MY_MODS = null;
		FINISH_MODS = null;
		return;
	}	
	console.log("DATA from firebase: " + JSON.stringify(DATA,null,3));
	
	// Calculamos progreso
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
	
	MY_MODS = myMods;
	FINISH_MODS = finishMods;
	console.log("Finish mods: " + FINISH_MODS);
	console.log("My mods: " + MY_MODS);
}

function isComplete(allValues, setValues) 
{
	try
	{
		for (let unitName in allValues)
		{
			let unit = allValues[unitName];
			let unitCheck = setValues[unitName];
			if (!unitCheck) return false;
			
			for (let subunitName in unit)
			{
				if (!unitCheck[subunitName]) return false;
			}
		}
		return true;
    }
    catch (e)
    {
		return false;
	}	
}

export function isReadUnit(modName, href)
{
	try
	{
		let unit = parseUnitName(href);
		if (!DATA) return;
		
		let result = DATA[modName];
		if (!result) return false;
		
		result = result[unit.unit];
		if (!result) return false;
		
		result = result[unit.subunit];
		if (result)	return true;
		else return false;
	}
	catch (e)
	{
		console.log(e);
		return false;
	}
}

// ------------------
// Función utilitaria
// ------------------

function parseUnitName(unitName)
{
	let parts = unitName.split("-");
	let result = {};
	
	result.unit = parts[0];
	result.subunit = parts[1];
	
	return result;
}



