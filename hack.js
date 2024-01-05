const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

console.warn = () => {};

// Faz a primeira solicitação para obter o conteúdo HTML
fetch('https://conexo.ws/')
    .then(response => response.text())
    .then(html => {
        const doc = cheerio.load(html);
        const srcLinks = doc('script[src^="/static/js/"]').map((_, el) => doc(el).attr('src')).get();
        if (srcLinks.length > 0) {
            return fetch('https://conexo.ws' + srcLinks[0]);
        } else {
            throw new Error('Links em src não encontrados');
        }
    })
    .then(response => response.text())
    .then(html => {
        // Salva o conteúdo HTML no arquivo resposta.html
        fs.writeFileSync('resposta.html', html, 'utf-8');
        
        // Lê o conteúdo do arquivo resposta.html
        fs.readFile('resposta.html', 'utf-8', (err, data) => {
            if (err) {
                console.log('Error reading the file', err);
                return;
            }
            // Chama a função para extrair a substring desejada
            extractSub(data);
        });
    })
    .catch(err => {
        console.log('Failed to fetch page:', err);
    });

// Função para extrair a substring ir=JSON.parse('...') e converter em um objeto JSON
function extractSub(htmlCont) {
    const regex = /ir=JSON\.parse\('([^']+)'\)/;
    const match = htmlCont.match(regex);

    if (match && match[1]) {
        const jsonString = match[1];
        try {
            const jsonObject = JSON.parse(jsonString);
            console.log(jsonObject); // Imprime o objeto JavaScript no console
        } catch (error) {
            console.log('Error parsing JSON:', error);
        }
    } else {
        console.log("Substring not found.");
    }
}
