import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// API KEY DE JINA
const JINA_API_KEY = '';

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

function readUrlsFromCsv(filepath, linkType = 'all'){
    const csvFile = fs.readFileSync(path.resolve(filepath), 'utf8')

    // Parsea el contenido del csv
    const records = parse(csvFile,{
        skip_empty_lines: true
    })

    const filteredURL = records.filter(record => {
        const type = record[0] //columna 1 asociada al tipo de url
        const url = record[1] //columna 2 asociada a las url 
        if(!url) return false;
        if(linkType == 'all') return true;

        //Filtrar por internal/external
        return type === linkType;
    }).map(record => record[1]);

    return filteredURL;
}


// Función para extraer y formatear el título para posteriormente establecerlo como titulo del doc generado
function formatTitle(data) {
    // Se extrae el tiulo del documento
    const titleMatch = data.match(/Title:\s*(.+)/);
    if (titleMatch) {
        // Reemplazar espacios por guiones bajos y devolver el resultado
        return titleMatch[1].trim().replace(/ /g, '_');
    }
    return 'sin_titulo'; // Título por defecto si no se encuentra
}


// Función para guardar los resultados en un archivo .md
function saveAsMarkdown(data) {
    const title = formatTitle(data); // Obtener el título formateado
    const filename = `${title}.md`; // Usar el título como nombre de archivo
    const filePath = path.join(__dirname, `${filename}`);

    // Guardamos el contenido tal como lo recibimos
    fs.writeFileSync(filePath, data, 'utf8');
    console.log(`Archivo creado: ${filePath}`);
}

// Función principal que recibe un array de URLs y ejecuta el proceso
async function processUrls(urls) {
    for (const url of urls) {
        const data = await fetchData(url);
        if (data) {
            saveAsMarkdown(data);
        }
    }
}

// Array de URLs de ejemplo
const urls = [
    'https://cesga-docs.gitlab.io/ft3-user-guide/batch_memory.html', 
    'https://cesga-docs.gitlab.io/ft3-user-guide/batch_partitions.html',
    'https://cesga-docs.gitlab.io/ft3-user-guide/batch_qos.html',
    'https://cesga-docs.gitlab.io/ft3-user-guide/batch_examples.html',
    'https://cesga-docs.gitlab.io/ft3-user-guide/batch_job_array.html',
    'https://cesga-docs.gitlab.io/ft3-user-guide/batch_multiple_tasks.html',
    'https://cesga-docs.gitlab.io/ft3-user-guide/batch_binding_tasks_specifics_cores.html',
    'https://cesga-docs.gitlab.io/ft3-user-guide/batch_jobs_states.html',
    'https://cesga-docs.gitlab.io/ft3-user-guide/batch_stdout_err.html',
    'https://cesga-docs.gitlab.io/ft3-user-guide/batch_email_warning.html'

];

// Ejecutar el script
processUrls(urls);