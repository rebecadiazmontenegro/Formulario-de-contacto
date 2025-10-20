const firebaseConfig = {
    apiKey: "AIzaSyCxDmYsOau4FBT0PfobJ_1jevkQPVk1XQ8",
    authDomain: "fir-web-589d4.firebaseapp.com",
    projectId: "fir-web-589d4",
    storageBucket: "fir-web-589d4.firebasestorage.app",
    messagingSenderId: "674609037037",
    appId: "1:674609037037:web:f1a54da2f2f49de812d6e4"
  }; // Son los datos de conexion, con esto accedes al firebase

firebase.initializeApp(firebaseConfig);// Inicializaar app Firebase

const db = firebase.firestore();// db representa mi base de datos //inicia Firestore

//---------------------------------------------------------------------------------------------------------

// 2. - Guardar en Firebase Firestore los datos de contacto enviados de cada usuario

const createUser = (usuario) => {
  db.collection("personas")
    .add(usuario)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id)
      readAll();
    })
    .catch((error) => console.error("Error adding document: ", error));
};

const readAll = () => {
  // Limpia el album para mostrar el resultado
  cleanAlbum();
}

//---------------------------------------------------------------------------------------------------------

// 3. Mostrar los datos de los contactos guardados en el DOM

const personas = document.getElementById("personas");

const printUser = (nombre, email, mensaje, url = false, docId) => {

    let card = document.createElement('article');
    card.setAttribute('id', 'card');

    let nombreCard = document.createElement("h3");
    nombreCard.textContent = nombre;

    let emailCard = document.createElement("p");
    emailCard.textContent = email;

    let mensajeCard = document.createElement("p");
    mensajeCard.textContent = mensaje;

    let imagenCard= document.createElement('img');
    imagenCard.setAttribute('src', url);
    
    let idCard = document.createElement('p');
    idCard.textContent = `ID: ${docId}`;

    let botonBorrar = document.createElement("button");
        botonBorrar.setAttribute('class', 'botonBorrar');
        botonBorrar.innerHTML = "Borrar usurario"  

    let botonEditar = document.createElement("button");
        botonEditar.setAttribute('class', 'botonEditar');
        botonEditar.innerHTML = "Editar usurario"
        
    //Ejercicio 5

    
        
    //Ejercicio 6
    botonBorrar.addEventListener("click", () => {
    const confirmDelete = confirm("¿Seguro que quieres borrar todos los contactos?");
    if (!confirmDelete) return;
        db.collection('personas').doc(docId).delete()
        .then(() => {
            alert(`Documento ${docId} ha sido borrado`);
            personas.innerHTML = ""; // Limpiar DOM
            readAll(); // Volver a leer todos los contactos
        })
        .catch((error) => console.log('Error borrando documento:', error));
    });

    card.appendChild(nombreCard);
    card.appendChild(emailCard);
    card.appendChild(mensajeCard);
    card.appendChild(imagenCard);
    card.appendChild(idCard);
    card.appendChild(botonBorrar)
    card.appendChild(botonEditar);

  personas.appendChild(card);
};

  //Petición a Firestore para leer todos los documentos de la colección album
  db.collection("personas")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        printUser(data.nombre, data.email, data.mensaje, data.url, doc.id) //Lo pinta en el 
      });

    })
    .catch(() => console.log('Error reading documents'));

//---------------------------------------------------------------------------------------------------------

// 4. Crea botón para borrar todos los contactos guardados en Firebase Firestore

//Primero mandamos mensaje para confirmar que se quiere borrar
const deleteAllContacts = () => {
  const confirmDelete = confirm("¿Seguro que quieres borrar todos los contactos?");
  if (!confirmDelete) return;

    // Obtenemos todos los documentos de la colección "personas"
    db.collection('personas')
        .get()
        .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            db.collection('personas').doc(doc.id).delete() // Accedes al ID para localizarlo y borrarlo
            .then(() => console.log(`Documento ${doc.nombre} borrado`))
            .catch((error) => console.error("Error borrando documento:", error));
        });

        // Para que no siga apareciendo en el DOM
        document.getElementById('personas').innerHTML = ""; //Vacías el contenedor de los contactos en el HTML (personas) para que las tarjetas desaparezcan visualmente.
        })
        .catch((error) => console.error("Error obteniendo documentos:", error));
    };

document.getElementById("borrarTodo").addEventListener("click", deleteAllContacts); // Le agregamos la función al botón de borrar

//---------------------------------------------------------------------------------------------------------

// 7. Validar los campos del formulario

document.getElementById("formContacto").addEventListener("submit", (event) => {
    event.preventDefault();
    // Obtener los valores de los campos del formulario
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const mensaje = document.getElementById("mensaje").value;
    const url = document.getElementById("imagen").value;

    // Validación de nombre
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-\:\,\.\!\?\(\)\"\']+$/;
    if (!nombreRegex.test(nombre)) {
        alert("Por favor, introduce un nombre válido");
        return;
    }
    // Validación de email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        alert("Por favor, introduce un email válido");
        return;
    }
    // Validación de url
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlRegex.test(url)) {
        alert("Por favor, introduce una url válida");
        return;
    }
    // Si pasas todas las validaciones se procesa el formulario
    alert("Formulario enviado correctamente");
    // Crea el usuario
    createUser({
        nombre: nombre,
        email: email,
        mensaje: mensaje,
        url: url
    });
    // Limpiar formulario después de enviar
    document.getElementById("formContacto").reset();
});

//---------------------------------------------------------------------------------------------------------

