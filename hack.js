const cheerio = require('cheerio');
const fs = require('fs');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
console.warn = () => {};

// Função para extrair a substring ir=JSON.parse('...') e converter em um objeto JSON
function extractSub(htmlCont) {
    const startPattern = '"selo"]}],';
    const startIndex = htmlCont.indexOf(startPattern);
    if (startIndex !== -1) {
        const endIndex = htmlCont.indexOf('\'),ka=JSON', startIndex);
        if (endIndex !== -1) {
            const jsonString = htmlCont.substring(startIndex + startPattern.length, endIndex);
            var sanitizedJsonString = ''
            fs.writeFileSync('data.json', jsonString, 'utf-8')           
            // Sanitiza a string JSON para remover caracteres de escape
                sanitizedJsonString = jsonString

                    .replace(/\\xe7/g, 'ç')
                    .replace(/\\xe3/g, 'ã')
                    .replace(/\\xea/g, 'ê')
                    .replace(/\\xe9/g, 'é')
                    .replace(/\\xf3/g, 'ó')
                    .replace(/\\xed/g, 'í')
                    .replace(/\\xf4/g, 'ô')
                    .replace(/\\xe1/g, 'á')
                    .replace(/\\xf5/g, 'õ')
                    .replace(/\\xfa/g, 'ú')
                    .replace(/\\xe2/, 'â')

                    .replace(' ', '')
                    .replace(',\\"', '')
                    .replace(/\\n/g, '\n')  // Substitua \n por nova linha
                    .replace(/\\r/g, '\r')  // Substitua \r por retorno de carro
                    .replace(/\\t/g, '\t')  // Substitua \t por tabulação
                    // Adicione outras substituições conforme necessário
                    .replace(/\\\\/g, ' ')  // Substitua \\ por \

                    //.split(/(]},)/)
                    
            try {
                // Analisa a string JSON sanitizada
                //const jsonObject = JSON.parse(sanitizedJsonString || '{}');

                // Converte o objeto de volta para uma string JSON formatada com tabulação
                
                const formattedJsonString = JSON.stringify(sanitizedJsonString,'[',2);
                const jsonObject = JSON.parse(formattedJsonString || '{}');
                fs.writeFileSync('data.json', formattedJsonString);
                console.log(jsonObject)
                return jsonObject
                
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

function getResp(){
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
            fs.writeFileSync('resposta.html', html);
            
            // Lê o conteúdo do arquivo resposta.html
            fs.readFile('resposta.html', 'utf-8', (err, data) => {
                if (err) {
                    console.log('Error reading the file', err);
                    return;
                }
                // Chama a função para extrair a substring desejada
                const extract = extractSub(data);
                //aS = JSON.stringify(a)

                
            });
        })
        .catch(err => {
            console.log('Failed to fetch page:', err);
        });
}


getResp()
