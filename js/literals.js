let literals = {};
let errores = {};

export function MSG(key)
{
	let result = literals[key];
	if (result) return result;
	
	result = errores[key];
	if (result) return result;
	
	return key;
}

if (LANG == "es") {
    errores = {
        "email_pwd_null": "Por favor, ingresa correo electrónico y contraseña.",
        "email_pwd_name_null": "Por favor, ingresa correo electrónico, contraseña y nombre.",
        "pwd_null_delete_user": "Debe informar el password para eliminar usuario",
		"pwd_actual_null_change_pwd": "Debe insertar el pwd actual para actualizar",
		"pwd_new_null_change_pwd": "Debe insertar el nuevo password",
		"pwd_not_equals_change_pwd": "Los passwords no coinciden",
		"pwd_changed_ok": "Contraseña cambiada correctamente",
		"register_should_accept_conditions":"Debe aceptar las condiciones para continuar",
		"error_generic_message_refresh": "Se ha producido un error. Por favor, pulsa el botón de refrescar página para intentar nuevamente.",
		"button_refresh": "Refrescar página"		
    };
} else if (LANG == "ca") {
    errores = {
        "email_pwd_null": "Si us plau, introdueix correu electrònic i contrasenya.",
        "email_pwd_name_null": "Si us plau, introdueix correu electrònic, contrasenya i nom.",
        "pwd_null_delete_user": "Has d'informar la contrasenya per eliminar l'usuari",
		"pwd_actual_null_change_pwd": "Ha d'introduir la contrasenya actual per actualitzar",
		"pwd_new_null_change_pwd": "Ha d'introduir la nova contrasenya",
		"pwd_not_equals_change_pwd": "Les contrasenyes no coincideixen",
		"pwd_changed_ok": "Contrasenya canviada correctament",
		"register_should_accept_conditions":"Ha d'acceptar les condicions per continuar'",
		"error_generic_message_refresh": "S'ha produït un error. Si us plau, prem el botó de refrescar pàgina per tornar-ho a intentar.",
		"button_refresh": "Refrescar pàgina"
    };
} else {
    errores = {
        "email_pwd_null": "Please enter email and password.",
        "email_pwd_name_null": "Please enter email, password, and name.",
        "pwd_null_delete_user": "You must provide the password to delete the user",
		"pwd_actual_null_change_pwd": "You must enter the current password to update",
		"pwd_new_null_change_pwd": "You must enter the new password",
		"pwd_not_equals_change_pwd": "Passwords do not match",
		"pwd_changed_ok": "Password changed successfully",
		"register_should_accept_conditions":"You must accept the terms to continue",
		"error_generic_message_refresh": "An error has occurred. Please press the refresh page button to try again.",
		"button_refresh": "Refresh page"		
    };
}

if (LANG == "es") {
    literals = {
        "auth/invalid-email": "Usuario/Password incorrecto",
        "auth/email-already-in-use": "El correo electrónico ya está en uso",
        "auth/user-not-found": "No se encontró ningún usuario con ese correo",
        "auth/wrong-password": "Contraseña incorrecta",
        "auth/weak-password": "La contraseña es demasiado débil",
        "auth/operation-not-allowed": "Operación no permitida",
        "auth/user-disabled": "El usuario ha sido deshabilitado",
        "auth/requires-recent-login": "Se requiere un inicio de sesión reciente para realizar esta acción",
        "auth/too-many-requests": "Demasiados intentos fallidos. Intenta de nuevo más tarde",
        "auth/network-request-failed": "Error de red. Por favor, revisa tu conexión",
        "auth/missing-email": "El campo de correo electrónico está vacío",
        "auth/invalid-action-code": "El código de acción es inválido o ha caducado",
        "auth/user-token-expired": "La sesión del usuario ha expirado. Inicia sesión nuevamente",
        "auth/invalid-verification-code": "Código de verificación inválido",
        "auth/account-exists-with-different-credential": "Ya existe una cuenta con una credencial diferente",
        "auth/invalid-credential": "Las credenciales proporcionadas no son válidas",
        "auth/invalid-api-key": "Clave API inválida",
        "auth/credential-already-in-use": "Las credenciales ya están en uso por otro usuario",
        "auth/invalid-password": "Contraseña inválida o no cumple con los requisitos",
        "auth/provider-already-linked": "El proveedor de autenticación ya está vinculado a otra cuenta",
        "auth/no-such-provider": "El proveedor de autenticación no está configurado para este proyecto",
        "auth/timeout": "La solicitud ha expirado por un problema de tiempo",
        "auth/captcha-check-failed": "Fallo al verificar el CAPTCHA",
        "auth/popup-closed-by-user": "El usuario cerró la ventana emergente antes de completar la autenticación",
        "auth/quota-exceeded": "Se ha alcanzado el límite de solicitudes a la API",
        "auth/unauthorized-domain": "El dominio no está autorizado en las configuraciones del proyecto",
        "auth/session-cookie-expired": "La cookie de sesión ha caducado. Inicia sesión nuevamente",
        "auth/invalid-tenant-id": "El ID del inquilino no es válido",
        "auth/multi-factor-auth-required": "Se requiere autenticación multifactor",
        "auth/invalid-phone-number": "El número de teléfono proporcionado no es válido",
        "auth/missing-phone-number": "Falta el número de teléfono en la solicitud"
    };
} else if (LANG == "ca") {
    literals = {
        "auth/invalid-email": "Usuari/Password incorrecte",
        "auth/email-already-in-use": "El correu electrònic ja està en ús",
        "auth/user-not-found": "No s'ha trobat cap usuari amb aquest correu",
        "auth/wrong-password": "Contrasenya incorrecta",
        "auth/weak-password": "La contrasenya és massa dèbil",
        "auth/operation-not-allowed": "Operació no permesa",
        "auth/user-disabled": "L'usuari ha estat deshabilitat",
        "auth/requires-recent-login": "Es requereix un inici de sessió recent per realitzar aquesta acció",
        "auth/too-many-requests": "Massa intents fallits. Torna-ho a provar més tard",
        "auth/network-request-failed": "Error de xarxa. Si us plau, revisa la teva connexió",
        "auth/missing-email": "El camp de correu electrònic està buit",
        "auth/invalid-action-code": "El codi d'acció és invàlid o ha caducat",
        "auth/user-token-expired": "La sessió de l'usuari ha caducat. Torna a iniciar sessió",
        "auth/invalid-verification-code": "Codi de verificació invàlid",
        "auth/account-exists-with-different-credential": "Ja existeix un compte amb una credencial diferent",
        "auth/invalid-credential": "Les credencials proporcionades no són vàlides",
        "auth/invalid-api-key": "Clau API invàlida",
        "auth/credential-already-in-use": "Les credencials ja estan en ús per un altre usuari",
        "auth/invalid-password": "Contrasenya invàlida o no compleix amb els requisits",
        "auth/provider-already-linked": "El proveïdor d'autenticació ja està vinculat a un altre compte",
        "auth/no-such-provider": "El proveïdor d'autenticació no està configurat per aquest projecte",
        "auth/timeout": "La sol·licitud ha caducat per un problema de temps",
        "auth/captcha-check-failed": "Error en verificar el CAPTCHA",
        "auth/popup-closed-by-user": "L'usuari va tancar la finestra emergent abans de completar l'autenticació",
        "auth/quota-exceeded": "S'ha arribat al límit de sol·licituds de l'API",
        "auth/unauthorized-domain": "El domini no està autoritzat en les configuracions del projecte",
        "auth/session-cookie-expired": "La cookie de sessió ha caducat. Torna a iniciar sessió",
        "auth/invalid-tenant-id": "L'ID de l'inquilí no és vàlid",
        "auth/multi-factor-auth-required": "Es requereix autenticació multifactor",
        "auth/invalid-phone-number": "El número de telèfon proporcionat no és vàlid",
        "auth/missing-phone-number": "Falta el número de telèfon a la sol·licitud"
    };
} else {
    literals = {
        "auth/invalid-email": "User/Password not valid",
        "auth/email-already-in-use": "The email address is already in use",
        "auth/user-not-found": "No user found with this email",
        "auth/wrong-password": "Incorrect password",
        "auth/weak-password": "The password is too weak",
        "auth/operation-not-allowed": "Operation not allowed",
        "auth/user-disabled": "The user has been disabled",
        "auth/requires-recent-login": "Recent login is required to perform this action",
        "auth/too-many-requests": "Too many failed attempts. Try again later",
        "auth/network-request-failed": "Network error. Please check your connection",
        "auth/missing-email": "The email field is empty",
        "auth/invalid-action-code": "The action code is invalid or has expired",
        "auth/user-token-expired": "User session has expired. Please log in again",
        "auth/invalid-verification-code": "Invalid verification code",
        "auth/account-exists-with-different-credential": "An account already exists with a different credential",
        "auth/invalid-credential": "The provided credentials are not valid",
        "auth/invalid-api-key": "Invalid API key",
        "auth/credential-already-in-use": "The credentials are already in use by another user",
        "auth/invalid-password": "Invalid password or does not meet requirements",
        "auth/provider-already-linked": "The authentication provider is already linked to another account",
        "auth/no-such-provider": "The authentication provider is not configured for this project",
        "auth/timeout": "The request has timed out",
        "auth/captcha-check-failed": "Failed to verify CAPTCHA",
        "auth/popup-closed-by-user": "The user closed the popup before completing authentication",
        "auth/quota-exceeded": "API request quota exceeded",
        "auth/unauthorized-domain": "The domain is not authorized in the project settings",
        "auth/session-cookie-expired": "The session cookie has expired. Please log in again",
        "auth/invalid-tenant-id": "The tenant ID is invalid",
        "auth/multi-factor-auth-required": "Multi-factor authentication is required",
        "auth/invalid-phone-number": "The provided phone number is invalid",
        "auth/missing-phone-number": "The phone number is missing from the request"
    };
}
