---
title: "Cómo Implementar Animaciones y Transiciones en React con Framer Motion"
summary: "Aprende a agregar animaciones y transiciones a tus aplicaciones React utilizando Framer Motion, un potente y fácil de usar librería para animaciones."
date: "Sep 9 2024"
draft: false
tags:
- React
- Framer Motion
---

## 🎨 Introducción a Framer Motion

Framer Motion es una librería de animación para React que ofrece una API intuitiva y potente para crear animaciones fluidas y transiciones. Con Framer Motion, puedes animar componentes con facilidad y añadir interactividad a tus aplicaciones.

## 🛠️ Instalación

Para empezar a usar Framer Motion, primero necesitas instalarlo en tu proyecto:

```bash
npm install framer-motion
```

O si usas Yarn:

```bash
yarn add framer-motion
```

## 🚀 Animaciones Básicas

### Animar un Componente con `motion.div`

El componente `motion.div` es un contenedor animado que puedes usar para agregar animaciones a un `div` u otros elementos HTML.

```javascript
import { motion } from 'framer-motion';

function ComponenteAnimado() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h1>¡Hola, Framer Motion!</h1>
    </motion.div>
  );
}
```

En este ejemplo, el componente se desvanece desde la opacidad 0 hasta 1 durante 1 segundo.

## 🔄 Transiciones entre Estados

Framer Motion facilita la creación de transiciones entre diferentes estados de tus componentes.

### Transición entre Estados con `animate`

```javascript
import { motion, useState } from 'framer-motion';

function Caja() {
  const [expandido, setExpandido] = useState(false);

  return (
    <motion.div
      animate={{ scale: expandido ? 1.5 : 1 }}
      transition={{ duration: 0.5 }}
      onClick={() => setExpandido(!expandido)}
      style={{ width: 100, height: 100, background: 'tomato' }}
    >
      <p>Haz clic para expandir</p>
    </motion.div>
  );
}
```

Aquí, la caja se expande o contrae cuando se hace clic en ella, con una transición suave.

## 🧩 Animaciones de Entrada y Salida

Puedes crear animaciones cuando los componentes entran o salen de la vista utilizando las propiedades `initial`, `animate`, y `exit`.

```javascript
import { motion } from 'framer-motion';

function ListaDeElementos({ elementos }) {
  return (
    <motion.ul>
      {elementos.map(item => (
        <motion.li
          key={item.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {item.texto}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

En este ejemplo, los elementos de la lista aparecen y desaparecen con una transición de opacidad.

## ✨ Animaciones Avanzadas

### Uso de `variants` para Animaciones Complejas

Los `variants` permiten definir múltiples estados de animación y transiciones complejas entre ellos.

```javascript
import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

function ComponenteConVariants() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.5 }}
      style={{ width: 150, height: 150, background: 'skyblue' }}
    >
      <h2>¡Animación Avanzada!</h2>
    </motion.div>
  );
}
```

### Animaciones en el Scroll con `useScroll` y `useTransform`

Framer Motion también ofrece hooks para animaciones basadas en el scroll.

```javascript
import { motion, useScroll, useTransform } from 'framer-motion';

function AnimacionEnScroll() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 100]);

  return <motion.div style={{ y, width: 100, height: 100, background: 'lightcoral' }} />;
}
```

En este ejemplo, el componente se mueve verticalmente a medida que el usuario desplaza la página.

## 🎯 Recomendaciones

- **Mantén la Sencillez:** No sobrecargues la interfaz con demasiadas animaciones. Utilízalas para mejorar la experiencia del usuario.
- **Optimiza el Rendimiento:** Aunque Framer Motion es eficiente, asegúrate de probar el rendimiento en dispositivos de diferentes especificaciones.
- **Usa Animaciones para la Interactividad:** Las animaciones deben mejorar la interactividad y no solo ser decorativas.

Con Framer Motion, puedes crear animaciones ricas y fluidas que hagan que tus aplicaciones React sean más atractivas y dinámicas. ¡Comienza a experimentar y lleva tus aplicaciones al siguiente nivel! 🚀✨
```