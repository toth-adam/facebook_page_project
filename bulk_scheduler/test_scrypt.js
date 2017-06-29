var scrypt = require("scrypt");
var scryptParameters = scrypt.paramsSync(0.5);
var key = new Buffer("this is a key"); //could also be a string
var fs = require("fs")

console.log(scryptParameters);

// //Synchronous example that will output in hexidecimal encoding
var kdfResult = scrypt.kdfSync(key, scryptParameters); //should be wrapped in try catch, but leaving it out for brevity
// var kdfResult = scrypt.kdfSync(key, scryptParameters); //should be wrapped in try catch, but leaving it out for brevity
console.log("Synchronous result: "+ kdfResult.toString("base64"));

fs.writeFileSync("temp.json", kdfResult.toString("base64"))


// //Asynchronous example that expects key to be ascii encoded
// scrypt.kdf("ascii encoded key", {"N": 1000, "r": 8, "p": 1}, function(err, result){
//   //Note how scrypt parameters was passed as a JSON object
//   console.log("Asynchronous result: " + result);
// });

// scrypt.hash(key, {"N":16384,"r":8,"p":1}, 64, new Buffer("this is my salt"), function(err, result) {
//   console.log(result.toString("hex"));
// });

// //Asynchronous with promise
// scrypt.kdf("ascii encoded key", {N: 1, r:1, p:1}).then(function(result){
//   console.log("Asynchronous result: "+result.toString("base64"));
// }, function(err){
// });
