const cheerio = require('cheerio');
const fs = require('fs')
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

fetch('https://conexo.ws/')
    .then(response =>response.text())
    .then(html => {
        var doc = cheerio.load(html) //string
        const srcLinks = doc('script[src^="/static/js/"]').map((_,el)=> doc(el).attr('src')).get();
        if (srcLinks.length > 0 ){
            return fetch('https://conexo.ws'+srcLinks[0]);
        }else{
            throw new Error('links em src não encontrados');
        }
    })
    .then(response => response.text())
    .then(html => {
        fs.writeFileSync('resposta.html', html, 'utf-8')
        const $ = cheerio.load(html);
        fs.readFile('resposta.html', 'utf-8', (err, data) => {
            if(err){
                console.log('error reading the file',err);
                return;
            }
        extractSub(data)
        })
    })
    .catch(err => {
        console.log('Failed to fetch page:', err);
    });


function extractSub(htmlCont){
    const regex = /ir=JSON\.parse\('([^']+)'\),ur={/;
    const match =htmlCont.match(regex);

    if (match && match[1]){
        const desireP = match[1]
        console.log(desireP)
    }else{
        console.log("nada enontrado")
    }
}


