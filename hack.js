const cheerio = require('cheerio');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

console.warn = () => {};
/* const getMain = async () => {
	const response = await fetch('https://conexo.ws/');
	const body = await response.text();
	console.log(body); // prints a chock full of HTML richness
    //body.split('\n')
	return body;
}; */

//console.log(getMain())



const array4 = fetch('https://conexo.ws/')
    .then(function(response) {
        // When the page is loaded convert it to text
        return response.text()
    })
    .then(function(html) {
        var doc = cheerio.load(html).html() //string

        const doc1 = doc.split(' ') //array
        console.log(doc1)
        const array1 = doc1.filter((word) => word.match('src="/static/js/'))
        const array2 = array1.map(function (string){
            return string.split('">')[0];
        })
        return array2
    })
    .then(function(array2){
        const array3 = array2.map(function (string){
            return string.split('src="')[1];
        })
        return array3
    })
    .then(function(array3){
        fetch('https://conexo.ws'+array3[0])
    })
    .then(function(response) {
        return response.text()
    })
    .then(function(html) {
        var doc = cheerio.load(html).html() //string

        const doc1 = doc.split(' ') //array
        console.log(doc1)
        const array1 = doc1.filter((word) => word.match("ir=JSON.parse('"))
        const array2 = array1.map(function (string){
            return string.split("'),ur={")[0];
        })
        return array2
    })
    .then(function(array2){
        const array4 = array2.map(function (string){
            return string.split("ir=JSON.parse('")[1];
        })
        console.log(array4)
        return array4
    })
    .catch(function(err) {  
        console.log('Failed to fetch page: ', err);  
    });


