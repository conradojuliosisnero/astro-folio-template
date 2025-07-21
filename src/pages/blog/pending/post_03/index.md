---
title: "Cómo usar Git de manera eficiente: comandos y flujos básicos para proyectos personales"
summary: "Post sobre cómo usar git de manera eficiente: comandos y flujos básicos para proyectos personales con ejemplos y explicación completa"
date: "Jun 20 2024"
draft: false
tags:
- Programación
- Tutorial
---

# Cómo usar Git de manera eficiente: comandos y flujos básicos para proyectos personales

Git es una herramienta esencial para versionar proyectos.

## Comandos básicos

```bash
git init
git add .
git commit -m "primer commit"
git branch -M main
git remote add origin <url>
git push -u origin main
```

## Flujo sugerido para proyectos personales

1. Crear rama de desarrollo
2. Trabajar y hacer commits
3. Hacer merge a `main` al terminar

```bash
git checkout -b develop
# trabajar...
git add .
git commit -m "feature completa"
git checkout main
git merge develop
```

Evita trabajar directamente sobre `main`.

## Ignorar archivos

Crea un archivo `.gitignore`

```
node_modules/
.env
dist/
```

Así evitas subir carpetas y archivos innecesarios al repositorio.

