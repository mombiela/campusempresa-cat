import * as FirebaseService from './FirebaseService.js';
import { MSG } from './literals.js';
import { USER, registerUserConfigFirebase } from './app_model.js';

$(document).ready(function() {
	$("#btnDisconnect").click(logout);
	$("#btnLogin").click(login);
	$("#btnRegister").click(register);
	$("#btnVerifyEmail").click(verifyEmail);
	$("#btnRecover").click(recoverPwd);
	$("#delete-user-link").click(showDeleteUser);
	$("#change-password-link").click(showChangePassword);
	$("#btnDeleteUser").click(deleteUser);
	$("#btnChangePassword").click(changePassword);
    $('#forgot-password-link').click(showRecoverPassword);
	$('#loginModal').on('hidden.bs.modal', updateUserActionsInternal);
});

export function updateUserActions()
{
	cerrarModal();
	updateUserActionsInternal();
}

function updateUserActionsInternal()
{
	// Modal user
	$("#user_button").show();
	
	// Icono de usuario por defecto reset
	$("#user_icon").removeClass("bi-person-circle");
	$("#user_icon").removeClass("bi-box-arrow-in-right");
	$("#user_icon").removeClass("bi-person-fill-exclamation");
	
	// Apartados por defecto
	$("#loginModalEmail").text("");
	$("#mensaje").text("");
	$("#mensaje_info").text("");
	$("#forgotPasswordSection").addClass("d-none");
	$("#deleteUserSection").addClass("d-none");
	$("#verifyPasswordSection").addClass("d-none");
	$("#disconnectUserSection").addClass("d-none");
	$("#modalTabsSection").addClass("d-none");
	$("#changePassordSection").addClass("d-none");
	
	// Reset campos
	$("#loginModal input").val("");
	
	if (USER) 
	{
		$("#disconnectUserSection").removeClass("d-none");
		$("#loginModalLabel").text(USER.displayName);
		$("#loginModalEmail").text(USER.email);
		
		if (USER.emailVerified)
		{
			$("#user_icon").addClass("bi-person-circle");
		} 
		else
		{
			$("#user_icon").addClass("bi-person-fill-exclamation");
			$("#verifyPasswordSection").removeClass("d-none");
		}
    }
	else 
	{
		$("#user_icon").addClass("bi-box-arrow-in-right");
		$("#modalTabsSection").removeClass("d-none");
    }
}


// Funci�n para ocultar el modal usando jQuery
export function cerrarModal() 
{
	$('#loginModal').modal('hide');
	updateUserActionsInternal();
}

export function abrirModal() 
{
	$('#loginModal').modal('show');
	updateUserActionsInternal();
}

// ------------------
// Funciones firebase
// ------------------

function mostrarMensaje(texto) 
{
	$('#mensaje').text(MSG(texto));
}

function mostrarMensajeInfo(texto)
{
	$('#mensaje_info').text(MSG(texto));
}

async function logout() 
{
	try
	{
    	await FirebaseService.cerrarSesion();
		cerrarModal();
        updateInfoUser(null);
	}
	catch (error)
	{
        mostrarMensaje(error.code);
	}
}

async function login() 
{
    const email = $('#login-username').val();
    const password = $('#login-password').val();

    if (email && password) 
	{
		try
		{
    		const userCredential = await FirebaseService.iniciarSesion(email, password);
			cerrarModal();
        	updateInfoUser(userCredential.user);
		}
		catch (error)
		{
          mostrarMensaje(error.code);
		}
    } 
	else 
	{
    	mostrarMensaje("email_pwd_null");
    }
}

async function register() 
{
    const email = $('#register-email').val();
    const password = $('#register-password').val();
	const nombre = $('#register-name').val();
	const acceptConditions = $("#accept-conditions-reg").is(':checked');
	const allowComunications = $("#accept-allow_comunications").is(':checked');

	if (!email || !password || !nombre)
	{
		mostrarMensaje("email_pwd_name_null");
		return;
	}
	
	if (!acceptConditions)
	{
		mostrarMensaje("register_should_accept_conditions");
		return;
	}

	try
	{
		await FirebaseService.registrarUsuario(email, password, nombre);	
		
		try
		{
			await registerUserConfigFirebase(LANG, acceptConditions, allowComunications);
			await verifyEmail();
		}
		catch (er)
		{
			console.log("Error: " + er);
		}
		
		cerrarModal();
	}
	catch (error)
	{
      mostrarMensaje(error.code);
	}
}

async function verifyEmail(ev)
{
	if (ev) ev.preventDefault();
	
  	try
	{
  		await FirebaseService.enviarVerificacionEmail();
		cerrarModal();
	}
	catch(error)
	{
      	mostrarMensaje(error.code);
	}
}

function showRecoverPassword(e)
{
    e.preventDefault();

    $('#authTabs').addClass('d-none');
    $('#authTabsContent').addClass('d-none');
    $('#forgotPasswordSection').removeClass('d-none');
}

async function recoverPwd()
{
  	try
	{
	    const email = $('#recovery-email').val();
	    
	    if (!email)
	    {
			 mostrarMensaje('Debe informar email');
			 return;	
		}
  		await FirebaseService.recuperarContrasena(email);
		cerrarModal(); // TODO Hacer algo mejor...
	}
	catch(error)
	{
      	mostrarMensaje(error.code);
	}
}

function showDeleteUser()
{
	$("#deleteUserSection").removeClass("d-none");	
	$("#disconnectUserSection").addClass("d-none");
	$("#verifyPasswordSection").addClass("d-none");
}

function showChangePassword()
{
	$("#changePassordSection").removeClass("d-none");	
	$("#disconnectUserSection").addClass("d-none");
	$("#verifyPasswordSection").addClass("d-none");
}

async function deleteUser()
{
	try
	{
	    const password = $('#delete-user-pwd').val();
		const email = USER.email;
		
	    if (!password)
		{
			mostrarMensaje("pwd_null_delete_user");
			return;
		} 
		
		try
		{
   			await FirebaseService.iniciarSesion(email, password);
		}
		catch (error)
		{
			mostrarMensaje(error.code);
			return;
		}
		
		await FirebaseService.eliminarUsuario();
		cerrarModal();
   		updateInfoUser(null);
	}
	catch (error)
	{
        mostrarMensaje(error.code);
	}
}

async function changePassword()
{
	try
	{
		mostrarMensaje("");
		mostrarMensajeInfo("");
		
		const currentPwd = $("#change-pwd-actual").val();
		const pwd1 = $("#change-pwd-new-1").val();
		const pwd2 = $("#change-pwd-new-2").val();
		const email = USER.email;
		
		if (!currentPwd)
		{
			mostrarMensaje("pwd_actual_null_change_pwd");
			return;
		}
		
		if (!pwd1 || !pwd2)
		{
			mostrarMensaje("pwd_new_null_change_pwd");
			return;
		}
		
		if (pwd1 != pwd2)
		{
			mostrarMensaje("pwd_not_equals_change_pwd");
			return;
		}
		
		try
		{
   			await FirebaseService.iniciarSesion(email, currentPwd);
		}
		catch (error)
		{
			mostrarMensaje(error.code);
			return;
		}
		
		await FirebaseService.cambiarContrasena(pwd1);
		mostrarMensajeInfo("pwd_changed_ok")
		$("#change-pwd-actual").val("");
		$("#change-pwd-new-1").val("");
		$("#change-pwd-new-2").val("");
		$("#changePassordSection").addClass("d-none");
		
	}
	catch (error)
	{
        mostrarMensaje(error.code);
	}
}
