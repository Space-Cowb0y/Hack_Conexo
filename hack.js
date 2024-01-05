const cheerio = require('cheerio');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

console.warn = () => {};
.then(html => {
    const $ = cheerio.load(html);

    // Encontre o script que contém "ir=JSON.parse('"
    const scriptWithIrJSONParse = $('script').filter((_, el) => {
        const content = $(el).html();
        return content && content.includes("ir=JSON.parse('");
    }).first(); // Use first() para pegar o primeiro script que corresponde

    if (scriptWithIrJSONParse.length > 0) {
        // Extraia a parte do script que contém "ir=JSON.parse('"
        const scriptContent = scriptWithIrJSONParse.html();
        
        // Aqui você pode fazer mais manipulações no scriptContent, se necessário.
        console.log(scriptContent); // Isso mostrará todo o conteúdo do script.
        
        // Agora, se você quiser apenas a parte específica que vem depois de "ir=JSON.parse('"
        const startIndex = scriptContent.indexOf("ir=JSON.parse('") + 15; // 15 é o comprimento da string "ir=JSON.parse('"
        const endIndex = scriptContent.indexOf("'),ur={");
        
        if (startIndex !== -1 && endIndex !== -1) {
            const desiredPart = scriptContent.substring(startIndex, endIndex);
            console.log(desiredPart); // Isso mostrará apenas a parte desejada.
        } else {
            throw new Error('Failed to extract desired part from script content.');
        }
    } else {
        throw new Error('No script containing "ir=JSON.parse(\'" found.');
    }
})
.catch(err => {
    console.log('Failed to fetch page:', err);
});

