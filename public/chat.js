const socket = io()
document.getElementById("friends").click();
const addForm = document.getElementById("addForm")
addForm.addEventListener("submit", add)
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    console.log(document.location.pathname.slice(5))
    socket.emit('send-chat-message', document.location.pathname.slice(5), id, name, message)
    messageInput.value = ''
})
async function add(event){
    event.preventDefault()
    const name = document.getElementById("friend-name").value
    const result = await fetch("/api/add", {
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name
        })
    }).then(res => res.json())
}
function openTab(evt, name) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(name).style.display = "block";
    evt.currentTarget.className += " active";
}
async function accept(event, name){
    event.preventDefault()
    
    const result = await fetch("/api/accept", {
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name
        })
    }).then(res => res.json())
    window.location.reload()
} 
async function decline(event, name){
    event.preventDefault()
    const result = await fetch("/api/decline", {
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name
        })
    }).then(res => res.json())
    window.location.reload()
} 
socket.on('chat-message', (data) => {
    console.log(data)
    appendMessage(`${data.name}: ${data.message}`)
})
function appendMessage(message) {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)
}