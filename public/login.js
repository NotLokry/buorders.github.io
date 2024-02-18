const socket = io()
socket.on("connect",()=>{
    socket.emit("hello")
})
const loginForm = document.getElementById("login-form")
loginForm.addEventListener("submit", login)
async function login(event){
    event.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const result = await fetch("/api/login", {
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,password
        })
    }).then(res => res)
    if(result.ok){
        window.location.replace("/@me")
    }else if(result.status === 401){
        return alert("Username or Password is invalid")
    }   
}