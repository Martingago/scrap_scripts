# Instalación

Para poder ejecutar estos scripts es necesario un entorno de node. Para el desarrollo se ha empleado la versión `V20.17.0` de `Node`
Es necesario realizar un ```npm install``` para añadir todas las dependencias necesarias de los scripts.

Funcionalidades de los scripts existentes en el código:

```node readlinks https://www.google.com/ google.csv``` Requiere como primer parámetro la URL de la web de la que se quieren obtener los enlaces (tanto internos como externos), el segundo parámetro indica el nombre de salida del fichero (opcional) en caso de no añadirse la salida por defecto será output.csv
Este script generará un fichero csv con las url encontradas en la url pasada como parámetro

```node convertLLM ``` Convierte un conjunto de string (urls) en un documento formato .md adaptado a LLM. Este script emplea la api de `https://jina.ai/`, es necesaria una API_KEY original de Jina para ejecutar este script.
