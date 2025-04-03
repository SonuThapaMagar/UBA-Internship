//Importing http module
const http = require("http");

//Creating http server
const server = http.createServer(function (req, res) {
  //Response content
  res.write("Hello");

  //Ending Response
  res.end();
});

server.listen(8080, () => {
  console.log("Server running at http://localhost:8080/");
});
