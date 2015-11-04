var fs = require('fs');
var readline = require('readline');

var dir = "./static-files/";
var YEAR_PATTERN = "^[12][0-9]{3}$";

var arableland_collection = [];
var arableland_hect_collection = [];
var arableland_hect_person_collection = [];


//read all the files in the directory and process it.
fs.readdir(dir,function(err,files) {
  if(err) {
    console.error("Error reading the directory.");
  } else {
        //console.log("Inside the static files");
        files.forEach(function(file) {
            var linenum = 0;
            var fields = [];
            //console.log(file);
            //console.log("Start reading the file.");
            //create an interface for the readline
            var rd = readline.createInterface({
              input:fs.createReadStream(dir+file),
              output:process.stdout,
              terminal:false
            });

            rd.on('close',function() {
              fs.writeFile("arableland.json",JSON.stringify(arableland_collection),null);
              fs.writeFile("arableland_hect.json",JSON.stringify(arableland_hect_collection),null);
              fs.writeFile("arableland_hect_person.json",JSON.stringify(arableland_hect_person_collection),null);
            });

            rd.on('line',function(line) {
              if(linenum === 0) {
                fields = line.split(",");
                //console.log(fields);
            } else {
              var fieldnum = 0;
              var data = line.split(",");
              if(data[2] === "Arable land (% of land area)") {
                //console.log(data);
                var arableland = {};
                fields.forEach(function(field) {
                  if(field === "Country Name" || field.match(YEAR_PATTERN)) {
                    if(data[fields.indexOf(field)] === "")
                      arableland[field] = null;
                    else
                    arableland[field] = data[fields.indexOf(field)];
                  }});
                arableland_collection.push(arableland);
              } else if(data[2] === "Arable land (hectares)") {
                var arableland_hect = { };
                fields.forEach(function(field){
                  if(field === "Country Name" || field.match(YEAR_PATTERN)) {
                    arableland_hect[field] = data[fields.indexOf(field)];
                  }
                });
                arableland_hect_collection.push(arableland_hect);
              } else if(data[2] === "Arable land (hectares per person)") {
                var arableland_hect_person = {};
                fields.forEach(function(field) {
                  if(field === "Country Name" || field.match(YEAR_PATTERN)) {
                    arableland_hect_person[field] = data[fields.indexOf(field)];
                  }
                });
                arableland_hect_person_collection.push(arableland_hect_person);
              }
            }
            linenum++;
            });
          });
        }
});
