---
title: "Como crear un proyecto Astro"
summary: "Tutorial para crear un proyecto Astro en VsCode"
date: "Aug 11 2024"
draft: false
tags:
- Tutorial
- Astro
---

# Crear un Proyecto de Astro en VSCode

Para crear un proyecto de Astro en Visual Studio Code (VSCode), sigue estos pasos detallados:

## Preparación del Entorno de Desarrollo

Antes de comenzar, asegúrate de tener instalado Node.js en tu sistema. Astro requiere una versión de Node.js que sea al menos la 14.x para funcionar correctamente.

## Instalación de Astro

Primero, necesitas instalar Astro globalmente en tu sistema para poder usar el comando `create-astro`. Abre una terminal y ejecuta el siguiente comando:

```bash
npm install -g create-astro
```

## Creación del Proyecto

Una vez instalado Astro, puedes crear un nuevo proyecto utilizando el comando `create-astro`. En tu terminal, navega al directorio donde deseas crear tu proyecto y ejecuta:

```bash
npx create-astro mi-proyecto-astro
```

Reemplaza `mi-proyecto-astro` con el nombre que desees para tu proyecto. Este comando iniciará el asistente de configuración de Astro, donde podrás elegir las opciones de configuración para tu proyecto, como el framework CSS y si quieres incluir TypeScript.

## Abrir el Proyecto en VSCode

Después de crear el proyecto, navega al directorio del proyecto usando la terminal:

```bash
cd mi-proyecto-astro
```

Ahora, abre este directorio en VSCode. Puedes hacerlo ejecutando el siguiente comando en la terminal mientras estás dentro del directorio del proyecto:

```bash
code .
```

Al abrir el proyecto por primera vez, VSCode te pedirá si deseas instalar las extensiones recomendadas para Astro. Es altamente recomendable instalar estas extensiones para mejorar la experiencia de desarrollo con Astro, incluyendo resaltado de sintaxis y autocompletado.

## Ejecución del Servidor de Desarrollo

Para ver tu sitio Astro en acción, necesitas iniciar el servidor de desarrollo. En la terminal integrada de VSCode (puedes abrirla con `Ctrl+J` o `Cmd+J` en macOS), ejecuta:

```bash
npm install
npm run dev
```

Esto iniciará el servidor de desarrollo de Astro. Por defecto, tu sitio estará disponible en `http://localhost:4321`. Abre este URL en tu navegador para ver una vista previa de tu sitio Astro.

## Vista Previa del Sitio

Con el servidor de desarrollo ejecutándose, puedes navegar a `http://localhost:4321` en tu navegador para ver una vista previa de tu sitio. Cualquier cambio que realices en los archivos del proyecto se reflejará automáticamente en la vista previa gracias al recargado en caliente proporcionado por Astro.

## Resumen

Siguiendo estos pasos, has creado un nuevo proyecto de Astro utilizando VSCode como tu editor de código. Has configurado tu entorno de desarrollo, instalado las extensiones recomendadas para Astro en VSCode, iniciado el servidor de desarrollo y visto una vista previa de tu sitio. Ahora estás listo para comenzar a desarrollar tu sitio web con Astro.