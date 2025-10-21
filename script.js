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

let editingUserId = null;

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
  personas.innerHTML = ""; // Limpia el contenedor, hace que vuelva a imprimirse todo
  db.collection("personas")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        printUser(data.nombre, data.email, data.mensaje, data.url, doc.id);
      });
    })
    .catch((error) => console.error("Error reading documents:", error));
};


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
  
    botonEditar.addEventListener("click", () => { //Llamamos a la función creada en el ejercicio 5
        console.log("Botón editar pulsado para ID:", docId);
        editUser(docId);
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

  //Petición a Firestore para leer todos los documentos de la colección personas
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

// 5. Crea botón para editar un contacto en concreto de Firebase Firestore

function editUser(userId) {
    console.log("editUser llamado con ID:", userId);

    // Obtener las colección personas
    db.collection("personas").doc(userId).get()
    .then((doc) => {
        console.log("Documento obtenido:", doc.exists);

        if (doc.exists) { //Si existe pasa lo siguiente
            const user = doc.data();
            console.log("Datos del usuario:", user);

            // Mostrar datos actuales en el formulario o vacio si no hay nada
            document.getElementById("nombre").value = user.nombre || "";
            document.getElementById("email").value = user.email || "";
            document.getElementById("mensaje").value = user.mensaje || "";
            document.getElementById("imagen").value = user.url || "";

            // Guardar el ID del usuario que se está editando
            editingUserId = userId;
    
            // Cambiar el texto del botón de enviar a "Guardar cambios"
            const submitButton = document.querySelector('.botonAñadir');
            submitButton.textContent = "Guardar cambios";
      
        // Si no existe...
        } else {
            console.log("El documento no existe");
            alert("No se encontró el usuario para editar");
        }
    })
    .catch((error) => {
        console.error("Error cargando usuario:", error);
        alert("Error al cargar usuario para editar");
    });
}

//---------------------------------------------------------------------------------------------------------

// 7. Validar los campos del formulario

document.getElementById("formContacto").addEventListener("submit", (event) => {
    event.preventDefault();

    // Obtener los valores de los campos del formulario
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const mensaje = document.getElementById("mensaje").value;
    const url = document.getElementById("imagen").value;

    // --- Tus validaciones, sin tocar nada ---
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-\:\,\.\!\?\(\)\"\']+$/;
    if (!nombreRegex.test(nombre)) {
        alert("Por favor, introduce un nombre válido");
        return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        alert("Por favor, introduce un email válido");
        return;
    }
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlRegex.test(url)) {
        alert("Por favor, introduce una url válida");
        return;
    }

    const usuario = { nombre, email, mensaje, url };

    // Si hay un usuario en edición se actualiza
    if (editingUserId) {
        db.collection("personas").doc(editingUserId).update(usuario)
            .then(() => {
                alert("Usuario actualizado correctamente");
                editingUserId = null; // Salir del modo edición
                document.querySelector(".botonAñadir").textContent = "Enviar";
                document.getElementById("formContacto").reset();
                personas.innerHTML = ""; // Limpiar DOM
                readAll(); 
            })
            .catch((error) => {
                console.error("Error actualizando usuario:", error);
                alert("Error al actualizar usuario");
            });

    // Si no hay edición entonces se crear nuevo
    } else {
        createUser(usuario);
        alert("Formulario enviado correctamente");
        document.getElementById("formContacto").reset();
    }
});

//---------------------------------------------------------------------------------------------------------

// 8.Guardar datos del formulario que no haya sido rellenado/enviado del todo en local storage

  const form = document.getElementById('formContacto');
  const inputs = form.querySelectorAll('input, textarea');

  // Cargar datos guardados al iniciar
  window.addEventListener('DOMContentLoaded', () => {
    const savedData = JSON.parse(localStorage.getItem('formContacto')) || {};
    inputs.forEach(input => { //Recorre cada uno de los campos y va guardando los datos
      if (savedData[input.id]) {
        input.value = savedData[input.id];
      }
    });
  });

  inputs.forEach(input => {
    input.addEventListener('input', () => { //Cada vez que se cambia el contenido interior se dispara el addEventListenner
      const formData = {};
      inputs.forEach(i => formData[i.id] = i.value);
      localStorage.setItem('formContacto', JSON.stringify(formData));
    });
  });

  form.addEventListener('submit', (e) => { //Elimina los datos guardados
    e.preventDefault(); 
    localStorage.removeItem('formContacto');
    alert('Formulario enviado correctamente.');
    form.reset();
  });

  document.getElementById('borrarTodo').addEventListener('click', () => { //Cuando se pulsa borrar todo se borran los datos del local tambien
    localStorage.removeItem('formContacto');
    form.reset();
  });

//------------------------------------------------------------------------------------------------------

//9.Crea botón para limpiar el formulario cacheado en Local storage

const form2 = document.getElementById("formContacto");
document.getElementById("limpiarFormulario").addEventListener("click", () => {
    form2.reset(); // Limpia los input 
    localStorage.removeItem("formContacto"); // Elimina los datos del Local Storage
});

