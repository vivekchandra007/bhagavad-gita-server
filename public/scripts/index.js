const app = new Vue({
  //this targets the div id app
  el: "#app",
  data: {
    name: "Bhagavad Gita Website & APIs",
    bhagavan: "Shri Krishna",
    token: "",
  },
});

function login() {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: "602ac6711be930a2233d8921!",
      client_secret: "602ac7263e915c5ec230bec6!",
    }),
  };
  fetch("/auth/oauth/v1/token", requestOptions)
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("token", data.token);
    });
}
