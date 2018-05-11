const API_URL_MESSAGES = 'http://localhost:8080/api/messages';
const API_URL_USERS = 'http://localhost:8080/api/users';

const encodeHTML = (str) => {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

const getFormattedDate = (date) => {
  return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' +  date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}

const scrollToBottom = (node) => {
	node.scrollTop = node.scrollHeight;
}

const sendMessage = (content, onSuccess) => {
  var xhr = new XMLHttpRequest();
 
  xhr.onreadystatechange = function () {
    if (this.readyState != 4) {
    	return;
    }

    if (this.status == 200) {
      onSuccess(JSON.parse(this.responseText));
    }
  };

	xhr.open('POST', API_URL_MESSAGE, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    message: encodeHTML(String(content))
  }));
}

const getRequest = (API_ENDPOINT, onSuccess) => {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (this.readyState != 4) {
    	return;
    }

    if (this.status == 200) {
    	onSuccess(JSON.parse(this.responseText));
    }
  };

  xhr.open('GET', API_ENDPOINT, true);
  xhr.send();
}

const getMessages = (onSuccess) => {
  getRequest(API_URL_MESSAGES, onSuccess);
}

const getUsers = (onSuccess) => {
  getRequest(API_URL_USERS, onSuccess);
}


const initUsers = (node, users) => {
	for (let i = 0; i < users.length; i++) {
		appendUser(node, users[i])
	}
}

const appendUser = (node, content) => {
	const userNode = document.createElement('li');
	userNode.innerText = content.email;
	
	node.appendChild(userNode);
}

const initMessages = (node, messages) => {
	for (let i = 0; i < messages.length; i++) {
		appendMessage(node, messages[i])
	}
}

const appendMessage = (node, content) => {
	const msgNode = document.createElement('li');
	const authorNode = document.createElement('div');
	authorNode.classList.add('msg-author');

	// email
		const emailNode = document.createElement('span');
		emailNode.classList.add('msg-email');
		emailNode.innerText = content.author.email;
		authorNode.appendChild(emailNode);

	authorNode.appendChild(document.createTextNode('•'));

	// date
		const dateNode = document.createElement('span');
		dateNode.classList.add('msg-date');
		dateNode.innerText = getFormattedDate(new Date(content.createdAt));
		authorNode.appendChild(dateNode);

	msgNode.appendChild(authorNode);


	const contentNode = document.createElement('div');
	contentNode.classList.add('msg-content');
	contentNode.innerText = content.body;

	msgNode.appendChild(contentNode);

	msgNode.classList.add(content._id);
	node.appendChild(msgNode);
	scrollToBottom(node.parentElement);
}


// DOM related functionality
const onDOMReady = (cb) => {
	if (document.readyState != 'loading') {
		cb();
		return;
	} 
  document.addEventListener('DOMContentLoaded', (event) => { 
  	cb();
	});
}

onDOMReady(() => {
	const $msgInput = document.getElementById('chat-message');
	const $msgHistory = document.getElementById('chat-history');
	const $users = document.getElementById('chat-users');

	// Send message on Enter
	$msgInput.onkeypress = (event) => {
		if (!event) {
			event = window.event;
		}
    const keyCode = event.keyCode || event.which;
    if (keyCode == '13'){
      // Enter pressed
      sendMessage($msgInput.value, () => {
      	// clear the input
      	$msgInput.value = '';
      });
      return false;
    }
  }

  getMessages((messages) => {
  	console.log('[GET] Initial messages:', messages);
  	initMessages($msgHistory, messages)
  });

  getUsers((users) => {
  	console.log('[GET] Initial users:', users);
  	initUsers($users, users)
  });


  // Listen to Socket IO Events
  const socket = io();
  socket.on('message', (msg) => {
  	console.log('[Socket] New message:', msg);
  	appendMessage($msgHistory, msg);
  });
});

