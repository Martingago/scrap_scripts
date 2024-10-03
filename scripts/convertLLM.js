import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// API KEY DE JINA
const JINA_API_KEY = '';

const args = process.argv.slice(2);

let pathToFile = args[0]; //path recibido como parametro con la dirección del fichero
let linkType = args[1] || 'all';
let outputFolder = args[2] || 'Files_LLM';

// Función para realizar la petición a la API de Jina AI con la API key
async function fetchData(url) {
    const pathurl = 'https://r.jina.ai/'+url;
    try {
        const response = await fetch(pathurl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JINA_API_KEY}`, // Header con la API key
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`);

        const data = await response.text(); // Se utiliza .text() para manejar texto plano
        return data;
    } catch (error) {
        console.error(`Error al obtener datos de ${pathurl}: `, error);
        return null;
    }
}

/**
 * Obtiene los datos a partir de un documento CSV
 * @param {*} filepath path con la dirección del fichero del que extraer las URL
 * @param {*} linkType tipo de URL que se quieren extraer [internal, external, all]
 * @returns 
 */
async function readUrlsFromCsv(filepath, linkType = 'all') {
    return new Promise((resolve, reject) => {
        const filteredURLs = [];
        fs.createReadStream(path.resolve(filepath))
            .pipe(csv({headers: false}))
            .on('data', (row) => {
                const type = row[0]; // índice 0 para el tipo
                const url = row[1];  // índice 1 para la URL
                if (!url) return; // Si no hay URL, salta
                if (linkType === 'all' || type === linkType) {
                    filteredURLs.push(url); // Agrega la URL si cumple la condición
                }
            })
            .on('end', () => {
                console.log(filteredURLs); // Opcional: muestra las URLs filtradas
                resolve(filteredURLs); // Resuelve la promesa con las URLs filtradas
            })
            .on('error', (error) => {
                reject(`Error al leer el archivo CSV: ${error}`);
            });
    });
}


// Función para extraer y formatear el título para posteriormente establecerlo como titulo del doc generado
function formatTitle(data) {
    // Se extrae el tiulo del documento
    const titleMatch = data.match(/Title:\s*(.+)/);
    if (titleMatch) {
        // Reemplazar espacios por guiones bajos y devolver el resultado
        return titleMatch[1].trim().replace(/[^a-zA-Z0-9_.-]/g, '_'); // Sanitiza el títuloclea
    }
    return 'sin_titulo'; // Título por defecto si no se encuentra
}


// Función para guardar los resultados en un archivo .md
function saveAsMarkdown(data) {
    const title = formatTitle(data); // Obtener el título formateado
    const filename = `${title}.md`; // Usar el título como nombre de archivo
    const outputDir = path.join(__dirname, outputFolder); //Path del fichero dónde guardar los datos
    //Comprueba si existe o no esa carpeta, si no existe crea una
    if(!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir)
    }
    const filePath = path.join(outputDir,filename); //Genera el path de guardado de fichero en la carpeta creada

    // Guardamos el contenido tal como lo recibimos
    fs.writeFileSync(filePath, data, 'utf8');
    console.log(`Archivo creado: ${filePath}`);
}

// Función principal que recibe un array de URLs y ejecuta el proceso
async function processUrls(urls) {
    for (const url of urls) {
        console.log("analizando url")
        const data = await fetchData(url);
        if (data) {
            saveAsMarkdown(data);
        }
    }
}

// Array de URLs que se genera llamando a la funcion que analiza el fichero .csv
const urls = await readUrlsFromCsv(pathToFile, linkType);

// Ejecutar el script
processUrls(urls);