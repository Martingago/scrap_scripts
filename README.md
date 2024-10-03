# Instalación

Para poder ejecutar estos scripts es necesario un entorno de node. Para el desarrollo se ha empleado la versión `V20.17.0` de `Node`
Es necesario realizar una instalación de dependencias para añadir todas las dependencias necesarias de los scripts. Puedes hacerlo a través del siguiente comando:  
```bash 
npm install
```

# Funcionalidades incluidas

Los scripts disponibles se encentran en la carpeta **scripts** puedes acceder desde la raíz del repositorio mediante:
```bash
cd ./scripts
```

A continuación se detallan listados los `scripts` existentes en el repositorio, sus funcionalidades, y parámetros:


## readLinks
Este script generará un fichero **.csv** con las url encontradas en la url pasada como parámetro 

**_Uso_**: `node readLinks <url> output`  
Requiere como primer parámetro la URL de la web de la que se quieren obtener los enlaces (tanto internos como externos), el segundo parámetro indica el nombre de salida del fichero (opcional) en caso de no añadirse la salida por defecto será output.csv.

## convertLLM
Convierte los datos de un documento recibido (.csv) en ficheros formato **.md** adaptado a `LLM`. Este script emplea la api de [https://jina.ai/](https://jina.ai/), es necesaria una API_KEY original de Jina para ejecutar este script.  

**_Uso_**: `node convertLLM <file> [options] output`
- `internal` Extrae las url que apuntan dentro de la propia web
- `external` Extrae las url que tienen un enlace a páginas externas
- `all` : Extrae todas las URL existentes en la web  


> NOTA  
Es importante configurar la **API KEY** de jina en el script para poder generar con éxito los documentos  




