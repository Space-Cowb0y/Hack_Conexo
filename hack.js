const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
console.warn = () => {};

fetch('https://conexo.ws/')
    .then(response => response.text())
    .then(html => {
        const doc = cheerio.load(html);
        const srcLinks = doc('script[src^="/static/js/"]').map((_, el) => doc(el).attr('src')).get();
        if (srcLinks.length > 0) {
            return fetch('https://conexo.ws' + srcLinks[0]);
        } else {
            throw new Error('links em src não encontrados');
        }
    })
    .then(response => response.text())
    .then(html => {
        fs.writeFileSync('resposta.html', html, 'utf-8');
        fs.readFile('resposta.html', 'utf-8', (err, data) => {
            if (err) {
                console.log('Error reading the file', err);
                return;
            }
            extractSub(data);
        });
    })
    .catch(err => {
        console.log('Failed to fetch page:', err);
    });

function extractSub(htmlCont) {
    const regex = /ir=JSON\.parse\('([^']+)'\),ur={/;
    const match = htmlCont.match(regex);
    
    if (match && match[1]) {
        const desiredPart = match[1];
        console.log(desiredPart);
    } else {
        console.log("Nada encontrado");
    }
}
