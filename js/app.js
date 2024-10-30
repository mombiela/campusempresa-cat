import * as FirebaseService from './FirebaseService.js';
import { updateUserActions } from './user.js';
import { updateCoursesButtons } from './courses_buttons.js';
import { updateCoursesProgress } from './courses_progress.js';
import { setUser, updateFirebaseData } from './app_model.js';
import { MSG } from './literals.js';

if(window["DEVELOP"]) {
	$(document).ready(function() {
	  	FirebaseService.onChangeAuth(updateInfoUser);
	});
}
else
{
	$("body").removeClass("d-none");
}

async function updateInfoUser(user)
{
	setUser(user);
	await updateAll();
}

export async function updateAll()
{
	try
	{
		// Cargamos datos firebase
		await updateFirebaseData();
		
		// Actualizamos datos y vista
		updateUserActions();
		updateCoursesButtons();
		updateCoursesProgress();
		
		// Ya se puede mostrar página
		$("body").removeClass("d-none");
	}
	catch (e)
	{
		console.log(e);
		mostrarAlertaConBoton("inner_content");
		$("body").removeClass("d-none");
	}	
}

function mostrarAlertaConBoton(divId, mensaje) {
    // Crear el contenedor de alerta con botón de cerrar
    var alerta = $(`
        <div class="text-center alert alert-danger alert-dismissible fade show" role="alert">
            <p class="text-center">${MSG("error_generic_message_refresh")}</p>
            <button id="botonActualizar" class="btn btn-primary btn-sm">${MSG("button_refresh")}</button>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `);

    // Insertar el contenedor de alerta al inicio del div especificado
    $(`#${divId}`).prepend(alerta);

    // Agregar evento de clic al botón para recargar la página
    $('#botonActualizar').on('click', function() {
        location.reload(); // Recarga la página
    });
}