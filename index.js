
//File System module to read files
const fs = require("fs");
//Create Server
const http = require("http");
//Routing
const url = require("url");

//Read Laptops Data from  data,json file
const json = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
// save, parse the data to JS object
const laptopData = JSON.parse(json);


//Server Request
const server = http.createServer((req, res) => {
        
       //Get the URL
       const pathName = url.parse(req.url, true).pathname;
       //Get the URL QUERY
       const id = url.parse(req.url, true).query.id
       

       //Products Page
       if(pathName === "/products" || pathName === "/" ){
          res.writeHead(200, {"Content-type": "text/html"});
          
          //Read the file file to be displayed, Laptops Page template (landing page)
       fs.readFile(`${__dirname}/templates/template-overview.html`, "utf-8", (err, data) =>{
        
        let overviewOutput = data;
        
        //Read the file to be displayed, loop through laptop array and produce html template for each laptop
        fs.readFile(`${__dirname}/templates/template-card.html`, "utf-8", (err, data) =>{
           
           const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join("");
           overviewOutput = overviewOutput.replace("{%CARDS%}", cardsOutput)

            //Send data to the browser
            res.end(overviewOutput);

            });  
        });

       }

       else if(pathName ==="/laptop" && id < laptopData.length){
          res.writeHead(200, {"Content-type": "text/html"});
        
       //Read the file file to be displayed, Laptop Detail
       fs.readFile(`${__dirname}/templates/template-laptop.html`, "utf-8", (err, data) =>{
           
              const laptop = laptopData[id];
              const output = replaceTemplate(data, laptop)
            
              //Send data to the browser
              res.end(output);
           });
       }

       //IMAGES ROUTE
          //handle image request, test request for file extension
       else if ((/\.(jpeg|jpg|png|gif)$/i).test(pathName)){
           //Locate the file 
           fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, {"Content-type": "image/jpg"});

            //Send the images
            res.end(data);

           });
       }
      
       //URL NOT FOUND (ERROR HANDLING)
       else{
        res.writeHead(404, {"Content-type": "text/html"});
        res.end("404 URL DOES NOT EXIST");
       }
       
});



//Server port
server.listen(1337, "127.0.0.1", () => {
     console.log("Now Listening for Requests");
});



//Function for templating the page
function replaceTemplate(originalHTML, laptop){

    let output = originalHTML.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);

    return output;
}