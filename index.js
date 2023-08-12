const fs = require("fs");
var http = require("http");
var url = require("url");
var convertTemplate = require("./modules/convertHTML");
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  //console.log(req.url);
  const { query, pathname } = url.parse(req.url, true);
  console.log("after url parse");

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });

    const cardsHTML = dataObj
      .map((el) => convertTemplate(tempCard, el))
      .join("");
    const displayOutput = tempOverview.replace("{%PRODUCTS_CARDS%}", cardsHTML);
    //console.log(displayOutput);

    res.end(displayOutput);
    //product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const product = dataObj[query.id];
    const output = convertTemplate(tempProduct, product);
    res.end(output);

    //api page
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h2>page not found</h2>");
  }
  //res.end("server called");
});

server.listen(3000, "127.0.0.1", (error) => {
  if (error) {
    return console.log("error occured : ", error);
  }
  console.log("server is listening on " + ":");
});
