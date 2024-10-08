const chatLog = document.getElementById('chat-log'),
    userInput = document.getElementById('user-input'),
    sendButton = document.getElementById('send-button'),
    buttonIcon = document.getElementById('button-icon'),
    info = document.querySelector('.info');

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const message = userInput.value.trim();
    // If message is empty, do nothing
    if (message === '') {
        return;
    }

    // Append user's message to screen
    appendMessage('user', message);
    userInput.value = '';

    const url = 'https://open-ai21.p.rapidapi.com/claude3'; // Correct API endpoint
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': 'a607a74606mshc9f9a6aa6746856p12f92bjsnaecca50516d9', // Your API key
            'x-rapidapi-host': 'open-ai21.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ],
            web_access: false // Use as needed
        })
    };

    try {
        const response = await fetch(url, options);

        // Check if the response is OK (status 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json(); // Parse JSON response
        
        // Log the entire response for debugging
        console.log(result);

        // Adjust the following line to match the new response structure
        if (result && result.status === true) {
            appendMessage('bot', result.result || "No content available."); // Get result from the response
        } else {
            appendMessage('bot', 'Unexpected response structure.'); // Fallback message
            console.log('Received response:', result); // Log the unexpected structure
        }
        
        resetButtonIcon();
    } catch (error) {
        console.error(error); // Log the error for debugging
        appendMessage('bot', 'An error occurred. Please try again later.'); // Show user-friendly error
        resetButtonIcon();
    }
}

function appendMessage(sender, message) {
    info.style.display = "none";
    changeButtonIconToLoading();

    const messageElement = document.createElement('div');
    const iconElement = document.createElement('div');
    const chatElement = document.createElement('div');
    const icon = document.createElement('i');

    chatElement.classList.add("chat-box");
    iconElement.classList.add("icon");
    messageElement.classList.add(sender);
    messageElement.innerText = message;

    // Add icons depending on who sent the message (user or bot)
    if (sender === 'user') {
        icon.classList.add('fa-regular', 'fa-user');
        iconElement.setAttribute('id', 'user-icon');
    } else {
        icon.classList.add('fa-solid', 'fa-robot');
        iconElement.setAttribute('id', 'bot-icon');
    }

    iconElement.appendChild(icon);
    chatElement.appendChild(iconElement);
    chatElement.appendChild(messageElement);
    chatLog.appendChild(chatElement);
    chatLog.scrollTop = chatLog.scrollHeight;  // Correctly scroll to the bottom
}

function changeButtonIconToLoading() {
    buttonIcon.classList.remove('fa-solid', 'fa-paper-plane');
    buttonIcon.classList.add('fas', 'fa-spinner', 'fa-pulse');
}

function resetButtonIcon() {
    buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
    buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
}
