//console.log("siii funciona");
//cramos una instancia del socket desde el laod del cliente

const socket = io()


//cramos una variable para guardar el usuario
let user;

const chatBox = document.getElementById("chatBox");

//usamos el swit alert para mensaje de bienvenida

Swal.fire({
    title: "identificate",
    input: "text",
    text: "ingresa un usuario para identificarte en el chat",
    inputValidator: (value) => {
        return !value && "necesitas escribir un nombre para continuar"
    },
    allowOutsideClick: false,
}).then(result => {
    user = result.value;
})

//envio de  mensajes
chatBox.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            socket.emit("message", { user: user, message: chatBox.value })
            console.log("emite mensaje"+chatBox.value);
            chatBox.value ="";
        }
    }
})

socket.on("messagesLogs", data =>{
    const log = document.getElementById("messagesLogs");
    let messages = "";
    data.forEach(message => {
        messages = messages +`${message.user} dice ${message.message} <br>`
    })
    log.innerHTML= messages
})