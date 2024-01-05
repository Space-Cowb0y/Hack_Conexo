const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
console.warn = () => {};

// Função para extrair a substring ir=JSON.parse('...') e converter em um objeto JSON
function extractSub(htmlCont) {
    const startPattern = 'ir=JSON.parse(\'';
    const startIndex = htmlCont.indexOf(startPattern);
    if (startIndex !== -1) {
        const endIndex = htmlCont.indexOf('\'),ur={', startIndex);
        if (endIndex !== -1) {
            const jsonString = htmlCont.substring(startIndex + startPattern.length, endIndex);
            // Trate os caracteres de escape
            const sanitizedJsonString = jsonString
                .replace(/\\n/g, '\n')  // Substitua \n por nova linha
                .replace(/\\r/g, '\r')  // Substitua \r por retorno de carro
                .replace(/\\t/g, '\t')  // Substitua \t por tabulação
                // Adicione outras substituições conforme necessário
                .replace(/\\\\/g, '\\');  // Substitua \\ por \
            
            try {
                const jsonObject = JSON.parse(sanitizedJsonString);
                console.log(jsonObject); // Imprime o objeto JavaScript no console
            } catch (error) {
                console.log('Error parsing JSON:', error);
            }
        } else {
            console.log('End pattern not found.');
        }
    } else {
        console.log('Start pattern not found.');
    }
}

// Solicitação inicial para obter o conteúdo HTML
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
