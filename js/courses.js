import * as FirebaseService from './FirebaseService.js';
import { MSG } from './literals.js';
import { MODULES } from './modules.js'; 
import { updateUserActions, abrirModal, cerrarModal } from './user.js';
import { updateAll } from './app.js';
import { USER, DATA, FINISH_MODS, MY_MODS } from './app_model.js';

export function updateCoursesProgress()
{
	$("div.index a").removeClass("completed").find("i.bi").remove();	
	
	let modIndex = DATA[MOD_NAME];
	if (!modIndex) return;
	
	let allIndex = true;
	let actualTemaLeido = false;
	$("div.index a").each(function(index, element){
		let elem = $(element);
		let href = elem.attr("href");
		
		if (contains(modIndex, href))
		{
			elem.html("<i class='bi bi-check-circle-fill'></i>" + elem.html());
			elem.addClass("completed");
			
			// Si es el actual ponemos a true
			if (href.indexOf(TEMA_NAME + "-")==0) actualTemaLeido = true;
		}
		else
		{
			allIndex = false;
		}
	});
	
	let isFinish = FINISH_MODS && FINISH_MODS.includes(MOD_NAME);
	let isCurrent = MY_MODS && MY_MODS.includes(MOD_NAME);
	
	// Estilo global para leído
	if (actualTemaLeido)	$("body").addClass("readed");	
	else  		 			$("body").removeClass("readed");	
	
	if (isFinish) $("body").addClass("finish");
	else $("body").removeClass("finish");

	// Botones de leído o no
	if (actualTemaLeido)
	{
		$("a[data-unread-mod]").removeClass("d-none");
		$("a[data-read-mod]").addClass("d-none");
	} 	
	else
	{
		$("a[data-unread-mod]").addClass("d-none");		
		$("a[data-read-mod]").removeClass("d-none");
	}
}

function contains(modIndex, href)
{
	for(let i = 0; i<modIndex.length; i++)
	{
		let elem = modIndex[i];
		if (href.indexOf(elem + "-")==0) return true;
	}
	return false;
}

export function updateCoursesButtons()
{
	// Botones generales
	$("#btnMyCourses").click(clickButtonMyCourses);

	// Modules
	$("[data-enroll-mod]").click(enrollMod);
	$("[data-unenroll-mod]").click(unenrollMod);
	$("[data-read-mod]").click(markReadModUnit);
	$("[data-unread-mod]").click(markUnreadModUnit);
	
	// Botones del menú (tropheo)
	if (FINISH_MODS && FINISH_MODS.length > 0)
	{
		$("#trophy_button").removeClass("d-none");
	}
	else
	{
		$("#trophy_button").addClass("d-none");
	}
	
	// Eliminamos cursos de my_modules y end_modules e insertamos clase para visualizar
	$("div[data-mod]").each(function(index, element){
		let elem = $(element)
		let mod = elem.data("mod");
		
		let isCurrent = MY_MODS && MY_MODS.includes(mod);
		let isFinish = FINISH_MODS && FINISH_MODS.includes(mod);
		
		if (isCurrent){
			elem.addClass("current");
			elem.removeClass("finish");
		}
		else if(isFinish) {
			elem.removeClass("current");
			elem.addClass("finish");
		}
		else {
			elem.removeClass("current");
			elem.removeClass("finish");
		}

		if (PATH == "my_modules" || PATH == "end_modules" )
		{
			if ((PATH == "my_modules" && isCurrent)	|| (PATH == "end_modules" && isFinish))
			{
				elem.addClass("d-block");
				elem.removeClass("d-none");
			}
			else
			{
				elem.addClass("d-none");
				elem.removeClass("d-block");
			}
		} 
		
		updateVisibilityCoursesButtons(elem, mod);
	});
}

function updateVisibilityCoursesButtons(elem, mod)
{
	let isCurrent = MY_MODS && MY_MODS.includes(mod);
	let isFinish = FINISH_MODS && FINISH_MODS.includes(mod);
	
	elem.find("button, a").each(function(index, element){
		let btn = $(element);
		let isEnrollButton = btn.data("enroll-mod") == mod;
		let isContinueButton = btn.data("continue-mod") == mod;
		let isUnenrollButton = btn.data("unenroll-mod") == mod;
		let isGotoButton = btn.data("goto-mod") == mod;
		
		if (isEnrollButton)
		{
			if (isCurrent || isFinish) btn.addClass("d-none");
			else btn.removeClass("d-none");
		}
		else if(isContinueButton)
		{
			if (isCurrent) btn.removeClass("d-none");
			else btn.addClass("d-none");
		}
		else if(isUnenrollButton)
		{
			if (isCurrent && !isFinish && IS_INDEX) btn.removeClass("d-none");
			else btn.addClass("d-none");
		}
		else if(isGotoButton)
		{
			if(isCurrent) btn.addClass("d-none");
			else btn.removeClass("d-none");
		}
	});
}


// --------------------
// Funciones de módulos
// --------------------

function clickButtonMyCourses(ev)
{
	if (!USER) {
		ev.preventDefault();
		abrirModal();
	}
}

async function enrollMod(ev)
{
	if (!USER)
	{
		abrirModal();
		return;
	}
	let modName = $(ev.target).data("enroll-mod");
	let unitName = "index";
	
	await FirebaseService.agregarValorAlArray(modName, unitName);
	await updateAll();
}


async function unenrollMod(ev)
{
	ev.preventDefault();
	if (!confirm("Se va a eliminar todo")) return; // TODO Hacer correctamente
	let modName = $(ev.target).data("unenroll-mod");
	await FirebaseService.eliminarCampoDelDocumento(modName);
	await updateAll();
}

async function markReadModUnit(ev)
{
	ev.preventDefault();
	
	let elem = $(ev.target);
	let modName = elem.data("read-mod");
	let unitName = elem.data("read-unit");
	
	await FirebaseService.agregarValorAlArray(modName, unitName);
	
	let href = elem.attr("href");
	if (href && href != "#") window.location.href = href;
	else await updateAll();
}

async function markUnreadModUnit(ev)
{
	ev.preventDefault();
	
	let modName = $(ev.target).data("unread-mod");
	let unitName = $(ev.target).data("unread-unit");

	await FirebaseService.eliminarValorDelArray(modName, unitName);
	await updateAll();
}
