import { isReadUnit, isUserValid, isFinishMod, isCurrentMod } from './app_model.js';

export function updateCoursesProgress()
{
	$("div.index a").removeClass("completed").find("i.bi").remove();	
	$("body").removeClass("finish").removeClass("readed");
	
	if (!isUserValid()) return;
	
	$("div.index a").each(function(index, element){
		let elem = $(element);
		let href = elem.attr("href");
		
		if (isReadUnit(MOD_NAME, href))
		{
			elem.html("<i class='bi bi-check-circle-fill'></i>" + elem.html());
			elem.addClass("completed");
		}
	});
	
	let actualTemaLeido = isReadUnit(MOD_NAME, TEMA_NAME);
	let isFinish = isFinishMod(MOD_NAME);
	let isCurrent = isCurrentMod(MOD_NAME);
	
	// Estilo global para leído
	if (actualTemaLeido || (isCurrent && IS_INDEX))		$("body").addClass("readed");	
	else  		 										$("body").removeClass("readed");	
	
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


