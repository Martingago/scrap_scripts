import puppeteer from 'puppeteer';

async function getLinksFromPath(path) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navega a la URL proporcionada
    await page.goto(path, { waitUntil: 'networkidle0' }); // Espera hasta que la red esté inactiva (se cargó todo el contenido)
    
    // Extrae el HTML completo de la página
    const html = await page.content();

    // Extrae los enlaces con una función que evalúa en el navegador
    const links = await page.evaluate(() => {
        const linkElements = document.querySelectorAll('a');
        const links = Array.from(linkElements).map(link => link.href);
        return links;
    });

    await browser.close();
    return links;
}

// Usar el script con una URL de ejemplo
getLinksFromPath('https://slurm.schedmd.com/archive/slurm-21.08.2/').then(links => {
    console.log("Enlaces extraídos:", links);
});
