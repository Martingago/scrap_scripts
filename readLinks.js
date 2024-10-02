import { URL } from 'url';
import https from 'https';
import fs from 'fs';


const args = process.argv.slice(2);

if (args.length === 0) {
    console.error("Error, debes pasar como parámetro la url a analizar");
    process.exit(1);
}


const urlToScrape = args[0]; //url a scrapear
let outputFileName = args[1]; //nombre de salida del fichero
if(outputFileName == null){
    outputFileName = 'output.csv'
}

getLinksFromPath(urlToScrape)

async function getLinksFromPath(path) {
    return new Promise((resolve, reject) => {

        const baseUrl = new URL(path); //url base de la que realizar la extracción de paths

        // Opciones de solicitud
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        };


        //Solicitud get a la web 
        https.get(baseUrl, options, (res) => {
            let data = '';

            //Recibe datos en chunks de la web
            res.on('data', (chunk) => {
                data += chunk;
            })

            //Termina de recibir los datos
            res.on('end', () => {
                const links = extractLinks(data, baseUrl);
                writeLinksToCsv(links,outputFileName)
                resolve(links);
                console.log(links)
            })

            //captura los errores que se pudieran generar en la solicitud
            res.on('error', (error) => {
                reject(`Error getting data: ${error.message}`)
            })

        })
    })
}

/**
 * Funcion que sobre el RAW de datos obtenidos de la web extrae las URL internas y externas
 * @param {*} html RAW de datos recibidos de la web
 * @param {*} baseUrl base inicial de la url (Se utiliza para generar los enlaces externos)
 */
function extractLinks(html, baseUrl) {
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/g;  // Expresión regular para encontrar enlaces
    let match;
    const links = {
        internal: [],
        external: [],
    }

    //Recorre todo el documento en busca de los enlaces:
    while ((match = linkRegex.exec(html)) !== null) {
        let link = match[1]; //Se obtiene el valor del path
        const absoluteLink = new URL(link, baseUrl);

        //Comprueba si es un enlace interno o externo de la web
        if (baseUrl.origin == absoluteLink.origin) {
            links.internal.push(absoluteLink.href);
        } else {
            links.external.push(absoluteLink.href);
        }
    }
    return links;
}

/**
 * Escribe las salidas de links en formato csv
 * @param {*} links Object que contiene la información de los enlaces a añadir en el fichero CSV
 * @param {*} filename nombre que se le va a poner al fichero
 */
function writeLinksToCsv(links, filename){
    let csvContent = '';
    links.internal.forEach(element => {
        csvContent += `${element},\n`
    });
    links.external.forEach(element => {
        csvContent += `${element},\n`
    })

    fs.writeFileSync(filename, csvContent,'utf8');
    console.log("Los enlaces se han guardado con éxito en: " + filename);
}

