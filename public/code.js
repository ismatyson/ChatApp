// credits to https://www.youtube.com/watch?v=kOJEWNPYBUo&t=978s
(function () {
  const app = document.querySelector(".app");
  const socket = io();
  const storage = window.localStorage;

  let uname;
  let user;

  app
    .querySelector(".join-screen #join-user")
    .addEventListener("click", function () {
      let username = app.querySelector(".join-screen #username").value;
      let password = app.querySelector(".join-screen #password").value;
      if (username.length == 0 && password.length == 0) {
        return;
      }

      postAuth({
        username,
        password,
      });

      uname = username;
    });

  app
    .querySelector(".join-screen #register-user")
    .addEventListener("click", function () {
      let username = app.querySelector(".join-screen #username").value;
      let password = app.querySelector(".join-screen #password").value;
      if (username.length == 0 && password.length == 0) {
        return;
      }

      postUser({
        username,
        password,
      });

      uname = username;
    });

  app
    .querySelector(".chat-screen #send-message")
    .addEventListener("click", function (event) {
      let message = app.querySelector(".chat-screen #message-input").value;
      if (message.length == 0) {
        return;
      }

      postMessage({
        userId: user._id,
        text: message,
      });

      app.querySelector(".chat-screen #message-input").value = "";
    });

  app
    .querySelector(".chat-screen #exit-chat")
    .addEventListener("click", function () {
      socket.emit("exituser", uname);
      window.location.href = window.location.href;
    });

  socket.on("update", function (update) {
    renderMessage("update", update);
  });
  socket.on("chat", function (message) {
    renderMessage("other", message);
  });

  function decodeJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }

  function renderMessage(type, message) {
    let messageContainer = app.querySelector(".chat-screen .messages");
    if (type == "my") {
      let el = document.createElement("div");
      el.setAttribute("class", "message my-message");
      el.innerHTML = `
        <div>
          <div class="name">You</div>
          <div>${message.text}</div>
          <div class="time">${message.timestamp}</div>
        </div>
      `;
      messageContainer.appendChild(el);
    } else if (type == "other") {
      let el = document.createElement("div");
      el.setAttribute("class", "message other-message");
      el.innerHTML = `
        <div>
          <div class="name">${message.username}</div>
          <div>${message.text}</div>
          <div class="time">${message.timestamp}</div>
        </div>
      `;
      messageContainer.appendChild(el);
    } else if (type == "update") {
      let el = document.createElement("div");
      el.setAttribute("class", "update");
      el.innerText = message;
      messageContainer.appendChild(el);
    }
    messageContainer.scrollTop =
      messageContainer.scrollHeight - messageContainer.clientHeight;
  }

  const postUser = (payload) => {
    axios
      .post("http://localhost:5000/chatroom/users", payload)
      .then((res) => {
        if (res.data != null || res.data != undefined) {
          user = decodeJwt(res.data);
          fetchMessages();
          app.querySelector(".join-screen").classList.remove("active");
          app.querySelector(".chat-screen").classList.add("active");
          socket.emit("newUser", uname);
        }
      })
      .catch((error) => console.log(error.message));
  };

  const postAuth = (payload) => {
    axios
      .post("http://localhost:5000/chatroom/auth", payload)
      .then((res) => {
        if (res.data != null || res.data != undefined) {
          user = decodeJwt(res.data);
          fetchMessages();
          app.querySelector(".join-screen").classList.remove("active");
          app.querySelector(".chat-screen").classList.add("active");
          socket.emit("newUser", uname);
        }
      })
      .catch((error) => console.log(error.message));
  };

  const postMessage = (payload) => {
    axios
      .post("http://localhost:5000/chatroom/chats", payload)
      .then((res) => {
        console.log(res.data);
        renderMessage("my", {
          username: res.data.user.username,
          text: res.data.message,
          timestamp: res.data.dateWritten,
        });
        socket.emit("chat", {
          username: res.data.user.username,
          text: res.data.message,
          timestamp: res.data.dateWritten,
        });
      })
      .catch((error) => console.log(error.message));
  };
  async function fetchMessages() {
    fetch("http://localhost:5000/chatroom/chats", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log("Success:", result);
        res.forEach((chat) => {
          if (chat.user._id == user._id) {
            renderMessage("my", {
              username: chat.user.username,
              text: chat.message,
              timestamp: chat.dateWritten,
            });
          } else {
            renderMessage("other", {
              username: chat.user.username,
              text: chat.message,
              timestamp: chat.dateWritten,
            });
          }
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // const getMessages = () => {
  //   axios
  //     .get("http://localhost:5000/chatroom/chats")
  //     .then((res) => {
  //       res.data.forEach((chat) => {
  //         if (chat.user._id == user._id) {
  //           renderMessage("my", {
  //             username: chat.user.username,
  //             text: chat.message,
  //             timestamp: chat.dateWritten,
  //           });
  //         } else {
  //           renderMessage("other", {
  //             username: chat.user.username,
  //             text: chat.message,
  //             timestamp: chat.dateWritten,
  //           });
  //         }
  //       });
  //     })
  //     .catch((error) => console.log(error.message));
  // };
})();
