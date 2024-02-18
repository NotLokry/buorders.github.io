const regForm = document.getElementById("reg-form")
regForm.addEventListener("submit", register)
function encode( str ) {
    return window.btoa(unescape(encodeURIComponent( str )));
}
function decode( str ) {
    return decodeURIComponent(escape(window.atob( str )));
}
async function register(event){
    event.preventDefault()
    const email = document.getElementById("email").value
    const name = document.getElementById("name").value
    const password = document.getElementById("password").value
    const result = await fetch("/api/register", {
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,email,password
        })
    }).then(res => res.json())
    console.log(result)
    if(result.status === "ok"){
        window.location.replace("/")
    }else{
        if(result.error === "Username is already in use")return alert("Username is already in use")
        console.log(result)
    }
}