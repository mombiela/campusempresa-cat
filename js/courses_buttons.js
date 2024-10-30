import { updateAll } from './app.js';
import { isUserValid, existCurrent, existFinish, isCurrentMod, isFinishMod, enrollModFirebase, unenrollModFirebase, markReadModUnitFirebase, markUnreadModUnitFirebase } 
			from './app_model.js';
import { abrirModal } from './user.js';

$(document).ready(function() {
	// Botones generales
	$("#btnMyCourses").click(clickButtonMyCourses);
	$("[data-enroll-mod]").click(enrollMod);

	$("[data-unenroll-mod]").click(unenrollMod);
	$("[data-read-mod]").click(markReadModUnit);
	$("[data-unread-mod]").click(markUnreadModUnit);	
	
	$("#btnShowUnenrollSection").click(showUnenrollSection);
	$("#btn-close-alert").click(hideUnenrollSection);
});

export function updateCoursesButtons()
{
	$("#btnMyCourses").addClass("d-none");
	$("#trophy_button").addClass("d-none");
	
	if (PATH == "") $("#btnHome").addClass("selected");
	if (PATH == "my_modules")  $("#btnMyCourses").addClass("selected");
	if (PATH == "end_modules")  $("#trophy_button").addClass("selected");
	
	$("#btnShowUnenrollSection").addClass("d-none");
	
	if (!isUserValid())
	{
		$("[data-enroll-mod]").removeClass("d-none");
		 return;	
	}
	
	// Botones mis cursos y finalizados
	if (existCurrent())	$("#btnMyCourses").removeClass("d-none");
	if (existFinish())	$("#trophy_button").removeClass("d-none");
	
	// Eliminamos cursos de my_modules y end_modules e insertamos clase para visualizar
	$("[data-mod]").each(function(index, element){
		let elem = $(element)
		let mod = elem.data("mod");
		
		let isCurrent = isCurrentMod(mod);
		let isFinish = isFinishMod(mod);
		
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
		
		updateVisibilityCoursesButtons(elem, mod, isCurrent, isFinish);
	});
	
	// Botones del módulo
	updateUnenrollButton();
}

function updateUnenrollButton()
{
	if (isCurrentMod(MOD_NAME) && IS_INDEX) $("#btnShowUnenrollSection").removeClass("d-none");	
}

function updateVisibilityCoursesButtons(elem, mod, isCurrent, isFinish)
{
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
	if (!isUserValid()) 
	{
		ev.preventDefault();
		abrirModal();
	}
}

async function enrollMod(ev)
{
	if (!isUserValid())
	{
		abrirModal();
		return;
	}
	let modName = $(ev.target).data("enroll-mod");
	let unitName = "index";
	
	await enrollModFirebase(modName, unitName);
	await updateAll();
}


async function unenrollMod(ev)
{
	ev.preventDefault();
	let modName = $(ev.target).data("unenroll-mod");
	await unenrollModFirebase(modName);
	await updateAll();
	hideUnenrollSection();
}

async function markReadModUnit(ev)
{
	ev.preventDefault();
	
	let elem = $(ev.target);
	let modName = elem.data("read-mod");
	let unitName = elem.data("read-unit");
	
	if (!IS_INDEX && isUserValid())
		await markReadModUnitFirebase(modName, unitName);
	
	let href = elem.attr("href");
	if (href && href != "#") window.location.href = href;
	else await updateAll();
}

async function markUnreadModUnit(ev)
{
	ev.preventDefault();
	
	let modName = $(ev.target).data("unread-mod");
	let unitName = $(ev.target).data("unread-unit");

	await markUnreadModUnitFirebase(modName, unitName);
	await updateAll();
}


function showUnenrollSection()
{
	$("#unEnrollSectionAlert").removeClass("d-none");
	$("#btnShowUnenrollSection").addClass("d-none");
}

function hideUnenrollSection()
{
	$("#unEnrollSectionAlert").addClass("d-none");
	updateUnenrollButton();
}