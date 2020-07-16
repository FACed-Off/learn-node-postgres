const db = require("./database/connection");

function home(request, response) {
  db.query("SELECT * FROM users").then((result) => {
    const users = result.rows;
    // create a list item for each user in the array
    const userList = users.map((user) => `<li>${user.username}</li>`);
    response.writeHead(200, { "content-type": "text/html" });
    // use .join to turn the array into a string
    response.end(`<ul>${userList.join("")}</ul>`);
  });
}

function newUser(request, response) {
  response.writeHead(200, { "content-type": "text/html" });
  response.end(`
    <form action="create-user" method="POST">
      <label for="username">Username</label>
      <input id="username" name="username">
      <label for="age">Age</label>
      <input id="age" name="age" type="number">
      <label for="location">Location</label>
      <input id="location" name="location">
      <button type="submit">Create user</button>
    </form>
  `);
}

function createUser(request, response) {
  let body = "";
  request.on("data", (chunk) => (body += chunk));
  request.on("end", () => {
    const searchParams = new URLSearchParams(body);
    const data = Object.fromEntries(searchParams);
    console.log(data); // e.g. { username: "oli", ... }
    db.query(
      "INSERT INTO users(username, age, location) VALUES($1,$2,$3)",
      [data.username, data.age, data.location]
    ).then(() => {
      response.writeHead(200, { "content-type": "text/html" });
      response.end(`<h1>Thanks for submitting</h1>`);
    }).catch((error) => {
        console.log(error);
        response.writeHead(500, {"location": "/"});
        response.end(`<h1>SQL error</h1>`)
      }
    )
    db.query(
      "SELECT * FROM users"
    ).then((result) => {
      console.log(result);
    })
  });
}

module.exports = { home, newUser, createUser };
