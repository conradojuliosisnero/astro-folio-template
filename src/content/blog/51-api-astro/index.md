---
title: "Cómo Consumir APIs Externas en Astro 🌐💡"  
summary: "Aprende a consumir APIs externas y mostrar datos dinámicos en tu proyecto Astro. Un paso a paso para integrar información externa de manera eficiente."  
date: "Sep 29 2024"  
draft: false  
tags:  
- Astro
- JavaScript  
---

Astro, con su enfoque en generar sitios estáticos rápidos y ligeros, ofrece una excelente manera de consumir y mostrar datos dinámicos mediante **APIs externas**. En este post, te mostraré cómo puedes integrar una API en tu proyecto Astro y mostrar los datos de manera eficiente.

## 1. ¿Por qué Consumir APIs en Astro? 🔍

Aunque Astro está diseñado para crear sitios estáticos, esto no significa que no puedas manejar datos dinámicos. Al integrar APIs externas, puedes mostrar información en tiempo real o mantener tu sitio actualizado sin la necesidad de actualizar todo el proyecto manualmente.

Por ejemplo, puedes usar APIs para:
- Mostrar el clima actual.
- Traer datos de una API de películas o libros.
- Mostrar noticias o contenido actualizado.

## 2. Configurando la Estructura Básica de Astro ⚙️

Si aún no tienes un proyecto Astro, puedes crearlo fácilmente siguiendo estos pasos:

```bash
npm create astro@latest
```

Una vez que tienes tu proyecto configurado, pasemos a la parte interesante: **consumir una API**.

## 3. Llamando a una API desde Astro 📡

Para este ejemplo, usaremos la API de OpenWeather para mostrar datos del clima en tiempo real.

### Paso 1: Crear un archivo de función para la API

En Astro, puedes crear una función separada para gestionar las llamadas a la API. Esto te ayuda a mantener el código limpio y organizado. Crea un archivo llamado `fetchWeather.js` en una carpeta `lib`:

```javascript
export async function fetchWeather(city) {
  const apiKey = 'YOUR_API_KEY';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching the weather data:', error);
    return null;
  }
}
```

### Paso 2: Usar la función en un componente de Astro

Ahora, usa esta función para traer datos de la API y renderizarlos en una página de Astro. Crea una página llamada `weather.astro`:

```astro
---
import { fetchWeather } from '../lib/fetchWeather.js';

const city = 'London';
const weatherData = await fetchWeather(city);
---

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Clima en {city}</title>
  </head>
  <body>
    <h1>Clima en {city}</h1>
    {weatherData ? (
      <div>
        <p>Temperatura: {(weatherData.main.temp - 273.15).toFixed(2)}°C</p>
        <p>Estado: {weatherData.weather[0].description}</p>
      </div>
    ) : (
      <p>No se pudo obtener el clima.</p>
    )}
  </body>
</html>
```

### Explicación del Código

- **fetchWeather**: Trae los datos del clima de la ciudad especificada usando la API de OpenWeather.
- **weather.astro**: Usa la función para obtener los datos y mostrarlos en la página. Si los datos están disponibles, muestra la temperatura y el estado del clima; de lo contrario, muestra un mensaje de error.

## 4. Gestión de Variables de Entorno 🔐

Es importante mantener tu clave API segura. Puedes utilizar variables de entorno en Astro agregando un archivo `.env` en la raíz del proyecto:

```bash
OPENWEATHER_API_KEY=your_api_key_here
```

Y luego, accediendo a esta clave dentro de tu función de llamada a la API:

```javascript
const apiKey = import.meta.env.OPENWEATHER_API_KEY;
```

## 5. Desplegando el Proyecto 🚀

Una vez que hayas integrado tu API y probado los datos en tu entorno de desarrollo local, puedes desplegar tu proyecto en plataformas como **Netlify** o **Vercel**. Ambas opciones permiten manejar variables de entorno y te facilitan el proceso de actualización y despliegue continuo.

## Conclusión 📝

Integrar APIs en Astro es un proceso sencillo que te permite agregar contenido dinámico a tus proyectos estáticos. Ya sea que estés creando un blog, un portafolio o cualquier otro sitio, consumir APIs puede llevar tu proyecto al siguiente nivel, permitiendo que se mantenga actualizado con datos en tiempo real.

¡Prueba integrar una API en tu próximo proyecto Astro y cuéntame cómo te fue! 🌟

---
