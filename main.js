(async () => {
const fs = require("fs");
const prompt = require('prompt')
prompt.start();

var PromptSettings = {
    properties: {
        ProxyDir:{
            description: "Directory to proxy file",
            required: true,
        },
        OutputFileDir:{
            description: "Output location (example: C:\\Users\\robin\\Documents\\Proxys)",
        },
        ProxysPerFile:{
            description: "How many proxys per file?",
            required: true
        },
        OutputFilePrefix:{
            description: "Prefix for output file (example: AMD-proxy1.txt, where AMD is the prefix.)",
        }
    }
};

var {ProxyDir, OutputFileDir, ProxysPerFile, OutputFilePrefix} = await prompt.get(PromptSettings);
var ProxyInput = fs.readFileSync(`${ProxyDir}`, `utf8`);
var ProxArray = ProxyInput.toString().replace(/\r\n/g,'\n').split('\n')
var NumberOfFiles = (ProxArray.length / ProxysPerFile)
var ProxyOutput = [];
var completed = 0

for (let filecount = 0; filecount < NumberOfFiles; filecount++){
    for (let count = 0; count < ProxysPerFile; count++){ 
        if(filecount == 0){
            if (ProxArray[count] != undefined){
                ProxyOutput.push(ProxArray[count])
            }
        } else {
            if (ProxArray[(count+(filecount*ProxysPerFile))] != undefined){
                ProxyOutput.push(ProxArray[(count+(filecount*ProxysPerFile))])
            }
        }
    }

    var file = fs.createWriteStream(`${OutputFileDir}${String.fromCharCode(92)}${OutputFilePrefix}-proxy${filecount+1}.txt`);
    file.on('error', function(err) { /* error handling */ });

    ProxyOutput.forEach(function(proxy) { 
        if (completed == (ProxyOutput.length-1)){
            file.write(proxy)
        } else {
            file.write(proxy+"\n")
        }        
        completed++
    });
    file.end();
    ProxyOutput = [];
    completed = 0
}
})();