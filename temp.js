const data = new Promise((resolve, reject) => { 
    setTimeout(() => {
        console.log("im eating!");
        reject();
    }, 3000);
 })

console.log(data);


 data
 .then((data)=>{
    console.log("promise complete");
})
.catch(()=>{
    console.log("promise Incomplete");
 })
 