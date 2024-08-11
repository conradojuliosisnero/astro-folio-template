---
title: "Como crear un proyecto con Vite"
summary: "Pasos para crear un proyecto con Vite en vscode y no morir en el proceso"
date: "Agust 12 2024"
draft: false
tags:
- Tutorial
- React
- VSCode 

---

# Crear un Proyecto de Vite en VSCode

Para crear un proyecto de Vite en Visual Studio Code (VSCode), sigue estos pasos detallados:

## Preparación del Entorno de Desarrollo

Antes de comenzar, asegúrate de tener instalado Node.js en tu sistema. Vite requiere una versión de Node.js que sea al menos la 12.0.0 para funcionar correctamente.

## Instalación de Create-Vite

Primero, necesitas instalar `create-vite`, que es una herramienta de línea de comandos para inicializar proyectos Vite. Abre una terminal y ejecuta el siguiente comando:

```bash
npm init vite@latest mi-proyecto-vite --template vanilla
```

Reemplaza `mi-proyecto-vite` con el nombre que desees para tu proyecto. El flag `--template` especifica el tipo de proyecto que deseas crear. En este caso, estamos creando un proyecto básico de JavaScript con el template `vanilla`. También puedes usar otros templates como `vue`, `react`, `svelte`, etc., dependiendo del framework que prefieras.

## Abrir el Proyecto en VSCode

Después de crear el proyecto, navega al directorio del proyecto usando la terminal:

```bash
cd mi-proyecto-vite
```

Ahora, abre este directorio en VSCode. Puedes hacerlo ejecutando el siguiente comando en la terminal mientras estás dentro del directorio del proyecto:

```bash
code .
```

## Instalación de Dependencias

Antes de ejecutar el proyecto, necesitas instalar las dependencias. En la terminal integrada de VSCode (puedes abrirla con `Ctrl+J` o `Cmd+J` en macOS), ejecuta:

```bash
npm install
```

## Ejecución del Servidor de Desarrollo

Para ver tu sitio Vite en acción, necesitas iniciar el servidor de desarrollo. En la terminal integrada de VSCode, ejecuta:

```bash
npm run dev
```

Esto iniciará el servidor de desarrollo de Vite. Por defecto, tu sitio estará disponible en `http://localhost:3000`. Abre este URL en tu navegador para ver una vista previa de tu sitio Vite.

## Vista Previa del Sitio

Con el servidor de desarrollo ejecutándose, puedes navegar a `http://localhost:3000` en tu navegador para ver una vista previa de tu sitio. Cualquier cambio que realices en los archivos del proyecto se reflejará automáticamente en la vista previa gracias al recargado en caliente proporcionado por Vite.

## Resumen

Siguiendo estos pasos, has creado un nuevo proyecto de Vite utilizando VSCode como tu editor de código. Has configurado tu entorno de desarrollo, instalado las dependencias necesarias y visto una vista previa de tu sitio. Ahora estás listo para comenzar a desarrollar tu aplicación web con Vite.
