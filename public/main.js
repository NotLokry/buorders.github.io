const socket = io()
socket.on("connect",()=>{
    socket.emit("hello")
})
const orderForm = document.getElementById("order-form")
orderForm.addEventListener("submit", order)
async function order(event){
    event.preventDefault()
    const who = document.getElementById("who").value
    const order = document.getElementById("order").value
    var courier = null
    var i = 0
    while(courier == null){
        if(document.getElementsByClassName("kurjeriai")[i].children[0].checked == true) courier = document.getElementsByClassName("kurjeriai")[i].children[1].textContent
        i++
    }
    const metal = document.getElementById("metal").checked
    const result = await fetch("/api/order", {
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            who,order,courier,metal
        })
    }).then(res => res)
    if(result.ok){
        return alert("Užsakymas nusiūstas")
    }else{
        return alert("Įvyko nesklandumas. Prašau susisiekite su tinklalapio kurėju")
    }   
}