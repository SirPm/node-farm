const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceVariableWithContent = require("./modules/replaceTemplate");

// const textInputVal = fs.readFileSync("./txt/input.txt", "utf-8");

// const output = `This is what we know on avocados: ${textInputVal}\nThis was created: ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", output);
// console.log("File Written!");

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log(err, "the error");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile(
//         "./txt/final.txt",
//         `${data1}\n${data2}\n${data3}`,
//         "utf-8",
//         (err) => {
//           err && console.log(err);
//           console.log("Your file has been written");
//         }
//       );
//     });
//   });
// });

// console.log("File will be written now");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempProductDetail = fs.readFileSync(
  `${__dirname}/templates/template-product-detail.html`,
  "utf-8"
);
const tempProductCard = fs.readFileSync(
  `${__dirname}/templates/template-product-card.html`,
  "utf-8"
);

const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // OVERVIEW ROUTE
  if (pathname === "/" || pathname === "/overview") {
    const templateCardsHtml = dataObj
      .map((data) => replaceVariableWithContent(tempProductCard, data))
      .join("");
    const templateOverviewHtml = tempOverview.replace(
      /{%PRODUCT_CARD%}/g,
      templateCardsHtml
    );
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    res.end(templateOverviewHtml);
  }

  // PRODUCT ROUTE
  else if (pathname === "/product") {
    const product = dataObj[query.id];
    const productDetail = replaceVariableWithContent(
      tempProductDetail,
      product
    );
    const productPage = replaceVariableWithContent(tempProduct, product);
    const output = productPage.replace(/{%PRODUCT_DETAIL%}/g, productDetail);

    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    res.end(output);
  }

  // API
  else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  }

  // NOT FOUND ROUTE
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-custom-header": "nothing-hehe",
    });
    res.end("Page not found!");
  }
});

server.listen("8000", "127.0.0.1", () => {
  console.log("Listening to server at port 8000");
});
