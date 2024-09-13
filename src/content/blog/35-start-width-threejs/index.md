---
title: "🌟 Primeros Pasos con Three.js: Crea Gráficos 3D Asombrosos"
summary: "Descubre cómo iniciar tu viaje en el mundo de los gráficos 3D con Three.js. Aprende los conceptos básicos y crea tu primera escena interactiva. ¡Es más fácil de lo que piensas! 🚀"
date: "Sep 13 2024"
draft: false
tags:
  - Three.js
  - JavaScript
  - 3D Graphics
  - WebGL
---

# 🌟 Primeros Pasos con Three.js: Crea Gráficos 3D Asombrosos

¡Hola, futuros magos de los gráficos 3D! 🧙‍♂️✨ ¿Estás listo para sumergirte en el fascinante mundo de Three.js y crear experiencias web en 3D que dejarán a todos boquiabiertos? ¡Vamos allá!

## ¿Qué es Three.js? 🤔

Three.js es una biblioteca de JavaScript que te permite crear y mostrar gráficos 3D animados en un navegador web. Es como tener un pequeño estudio de Pixar en tu ordenador, ¡pero mucho más accesible! 🎬

## Configurando tu Primer Proyecto Three.js 🛠️

1. Primero, crea un nuevo directorio para tu proyecto:

```bash
mkdir mi-proyecto-threejs
cd mi-proyecto-threejs
```

2. Inicializa un proyecto npm e instala Three.js:

```bash
npm init -y
npm install three
```

3. Crea un archivo HTML básico (`index.html`):

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Primera Escena Three.js</title>
    <style>
        body { margin: 0; }
    </style>
</head>
<body>
    <script type="module" src="./main.js"></script>
</body>
</html>
```

4. Ahora, crea tu archivo JavaScript principal (`main.js`):

```javascript
import * as THREE from 'three';

// Crea la escena
const scene = new THREE.Scene();

// Crea la cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Crea el renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crea un cubo
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();
```

## ¡Hora de la Magia! ✨

Ejecuta un servidor local (puedes usar `npx serve` si tienes Node.js instalado) y abre tu navegador. ¡Voilà! Deberías ver un hermoso cubo verde girando en tu pantalla. 🟩

## Conceptos Básicos de Three.js 📚

1. **Escena**: Es como el escenario de un teatro, donde colocas todos tus objetos 3D.
2. **Cámara**: Define lo que el espectador ve. ¡Es como ser el director de tu propia película!
3. **Renderizador**: Dibuja todo en la pantalla. Piensa en él como el proyector de cine.
4. **Geometría**: Define la forma de tus objetos 3D.
5. **Material**: Decide cómo se ven tus objetos (color, textura, etc.).
6. **Mesh**: Combina geometría y material para crear un objeto 3D completo.

## ¿Y Ahora Qué? 🚀

Ahora que tienes las bases, el cielo (o más bien, el universo 3D) es el límite. Puedes:

- Añadir luces para crear sombras y profundidad 💡
- Importar modelos 3D para crear escenas más complejas 🏰
- Implementar controles para interactuar con tu escena 🎮
- Experimentar con diferentes geometrías y materiales 🔮

## Conclusión 🌈

¡Felicidades! Has dado tus primeros pasos en el mundo mágico de Three.js. Recuerda, cada gran viaje comienza con un pequeño paso (o en este caso, con un pequeño cubo giratorio). 😉

¿Listo para crear el próximo gran juego o experiencia web en 3D? ¡El único límite es tu imaginación!

Happy coding, y que la fuerza de los gráficos 3D te acompañe! 🚀👨‍💻👩‍💻