import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously, signOut, onAuthStateChanged, 
		 updateProfile, deleteUser, sendPasswordResetEmail, sendEmailVerification, updatePassword } 
			from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove, deleteField } 
			from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

// Configuración de Firebase de tu proyecto
const firebaseConfig = {
    apiKey: "AIzaSyAcGdiZxHzBq5rVn1boUa-0RAhyBpkuGN0",
    authDomain: "enterprise-campus-925a3.firebaseapp.com",
    projectId: "enterprise-campus-925a3",
    storageBucket: "enterprise-campus-925a3.appspot.com",
    messagingSenderId: "256906158886",
    appId: "1:256906158886:web:c2776937626b6dad9517e7",
    measurementId: "G-VVPMPJSR3P"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicialización servicios
const auth = getAuth(app);
const db = getFirestore(app);

// ------------------
// Funciones firebase
// ------------------

export function onChangeAuth(callback) 
{
    onAuthStateChanged(auth, callback);
}

export async function cerrarSesion() 
{
    return await signOut(auth);
}

export async function iniciarSesion(email, password) 
{
	return await signInWithEmailAndPassword(auth, email, password);
}

export async function iniciarSesionAnonimamente() 
{
    return await signInAnonymously(auth);
}

export async function registrarUsuario(email, password, nombre) 
{
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (nombre) await updateProfile(user, { displayName: nombre });
    return user;
}

export async function cambiarContrasena(nuevaContrasena) 
{
    const user = auth.currentUser;
	await updatePassword(user, nuevaContrasena);
}

export async function eliminarUsuario() 
{
    const user = auth.currentUser;
    await deleteDoc(doc(db, 'usuarios', user.uid));
    await deleteUser(user);
}

//FirebaseService.actualizarPerfil({ displayName: 'Nuevo Nombre', photoURL: 'url_de_foto' });
export async function actualizarPerfil(datosPerfil) 
{
    const user = auth.currentUser;
    await updateProfile(user, datosPerfil);
}

export async function recuperarContrasena(email, lang) 
{
	if (!lang) lang = "ca";
	auth.languageCode = lang;
	
    await sendPasswordResetEmail(auth, email);
}

export async function enviarVerificacionEmail() 
{
    const user = auth.currentUser;
	auth.languageCode = LANG;
			
    await sendEmailVerification(user);
}

export function esEmailVerificado() 
{
    const user = auth.currentUser;
    return user.emailVerified;
}

export function obtenerPerfilUsuario() 
{
    const user = auth.currentUser;
        return {
            uid: user.uid,
            nombre: user.displayName,
            email: user.email,
            emailVerificado: user.emailVerified,
            fotoPerfil: user.photoURL
        };
}

export async function cerrarTodasLasSesiones(password) 
{
    const user = auth.currentUser;
    await updatePassword(user, password);
}

// ---------------
// Métodos de BBDD
// ---------------

export async function guardarDatos(contenido)
{
    const user = auth.currentUser;
    return setDoc(doc(db, 'usuarios', user.uid), contenido);
}

export async function eliminarDatos() 
{
    const user = auth.currentUser;
    await deleteDoc(doc(db, 'usuarios', user.uid));
}

export async function cargarDatos() 
{
    const user = auth.currentUser;
    return getDoc(doc(db, 'usuarios', user.uid));
}

// Función para crear un documento con una propiedad de tipo array
export async function crearDocumentoConArray(nombrePropiedad, valoresIniciales) {
    const user = auth.currentUser;
    const docRef = doc(db, 'usuarios', user.uid);

    // Crea el documento con la propiedad especificada y un array de valores iniciales
    await setDoc(docRef, {
        [nombrePropiedad]: valoresIniciales
    });
}

// Función para agregar un valor a una propiedad de tipo array
/*
export async function agregarValorAlArray(nombrePropiedad, valorNuevo) {
    const user = auth.currentUser;
    const docRef = doc(db, 'usuarios', user.uid);

    // Agrega un valor al array en la propiedad especificada
    await updateDoc(docRef, {
        [nombrePropiedad]: arrayUnion(valorNuevo)
    });
}
*/

export async function agregarValorAlArray(nombrePropiedad, valorNuevo) {
    const user = auth.currentUser;
    const docRef = doc(db, `usuarios/${user.uid}`);

    // Utilizamos setDoc con merge: true para crear el documento si no existe
    await setDoc(docRef, {
        [nombrePropiedad]: arrayUnion(valorNuevo)
    }, { merge: true });
}


// Función para eliminar un valor de una propiedad de tipo array
export async function eliminarValorDelArray(nombrePropiedad, valorAEliminar) {
    const user = auth.currentUser;
    const docRef = doc(db, 'usuarios', user.uid);

    // Elimina un valor del array en la propiedad especificada
    await updateDoc(docRef, {
        [nombrePropiedad]: arrayRemove(valorAEliminar)
    });
}

export async function existeDocumento() {
    const user = auth.currentUser;
    const docRef = doc(db, 'usuarios', user.uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
}

export async function actualizarDatos(parteDelDocumento) {
    const user = auth.currentUser;
    const docRef = doc(db, 'usuarios', user.uid);
    return updateDoc(docRef, parteDelDocumento);
}

export async function eliminarCampoDelDocumento(nombreCampo) {
    const user = auth.currentUser;
    const docRef = doc(db, 'usuarios', user.uid);
    await updateDoc(docRef, {
        [nombreCampo]: deleteField()
    });
}

export async function agregarCampoNuevo(nombreCampo, valorNuevo) {
    const user = auth.currentUser;
    const docRef = doc(db, 'usuarios', user.uid);

    // Añadir un nuevo campo o actualizar el valor si ya existe
    await updateDoc(docRef, {
        [nombreCampo]: valorNuevo
    });
}

// -----------
// Campos json
// -----------

export async function agregarClaveValorAlObjeto(nombreObjeto, claveNueva, valorNuevo) {
    const user = auth.currentUser;
    const docRef = doc(db, 'usuarios', user.uid);

    // Utilizamos la notación de puntos para especificar el campo anidado
    await updateDoc(docRef, {
        [`${nombreObjeto}.${claveNueva}`]: valorNuevo
    });
}

//await agregarClaveValorAlObjeto('configuraciones', 'tema', 'oscuro');
//await agregarClaveValorAlObjeto('configuraciones', 'tema.title', 'Mi título');
//await agregarClaveValorAlObjeto('configuraciones', 'tema.colores.0', 'Color 0');
//await agregarClaveValorAlObjeto('configuraciones', 'tema.colores.1', 'Color 1');

export async function eliminarClaveDeObjeto(nombreObjeto, claveAEliminar) {
    const user = auth.currentUser;
    const docRef = doc(db, 'usuarios', user.uid);

    await updateDoc(docRef, {
        [`${nombreObjeto}.${claveAEliminar}`]: deleteField()
    });
}
// await eliminarClaveDeObjeto('configuraciones', 'tema');

export async function actualizarClavesDelObjeto(nombreObjeto, nuevasClavesYValores) {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('El usuario no está autenticado.');
    }
    const docRef = doc(db, 'usuarios', user.uid);

    // Preparamos un objeto para las actualizaciones
    const updates = {};
    for (const [clave, valor] of Object.entries(nuevasClavesYValores)) {
        updates[`${nombreObjeto}.${clave}`] = valor;
    }

    await updateDoc(docRef, updates);
}

/*
await actualizarClavesDelObjeto('configuraciones', {
    tema: 'claro',
    notificaciones: true,
    idioma: 'es'
});
*/

// ----------------------
// Actualización de token
// ----------------------

async function verificarEstadoEmailEnToken() {
    const user = auth.currentUser;

    if (user) {
        try {
            // Obtiene el token de ID actual del usuario sin forzar actualización
            const token = await user.getIdTokenResult();
            
            // Verifica si el email está verificado en el token
            const emailVerificadoEnToken = token.claims.email_verified;

            console.log('¿Email verificado en el token?', emailVerificadoEnToken);
            return emailVerificadoEnToken;
        } catch (error) {
            console.error('Error al obtener el token:', error);
            return false;
        }
    } else {
        console.log('No hay usuario autenticado.');
        return false;
    }
}

export async function actualizarTokenSiEsNecesario() {
    const emailVerificadoEnToken = await verificarEstadoEmailEnToken();

    if (!emailVerificadoEnToken) {
        try {
            // Forzar actualización del token para obtener los últimos claims
            const user = auth.currentUser;
            await user.getIdToken(true); // Actualiza el token de ID
            console.log('Token actualizado.');
        } catch (error) {
            console.error('Error al actualizar el token:', error);
        }
    } else {
        console.log('El token ya está actualizado con el email verificado.');
    }
}

