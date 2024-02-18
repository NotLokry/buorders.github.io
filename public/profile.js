// Utils
const socket = io()
socket.emit("userOnline",{id})

fetch("/api/getOrders", {}).then(res => res.json()).then(json => {
    json.forEach(order => {
        var str = `
        <div id="${order._id}" class="order_box">
            <h2 class="who">${order.kieno}</h2>
            <h4 class="order">${order.uzsakymas}</h4>
            <button class="atlikta">Baigti</button>
            `
        if(order.grynais)str+=`<h2 class="grynais">Grynais</h2></div>`
        else str+=`<h2 class="grynais">Grynais</h2></div>`
        document.body.innerHTML += str
    });
})

// Events
socket.on('chat-message', async (data) => {
    console.log(data)
    appendMessage(data.name,data.message,data.to,data.fileURL,data.type)
})