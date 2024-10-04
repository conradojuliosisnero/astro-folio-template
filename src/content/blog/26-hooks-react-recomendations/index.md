---
title: "Hooks de React que debes dominar para trabajar mejor en React"
summary: "Aprende sobre los hooks esenciales de React con ejemplos prácticos y recomendaciones para mejorar tu flujo de trabajo."
date: "Sep 4 2024"
draft: false
tags:
- React
---

## 🧠 ¿Qué son los Hooks en React?

Los hooks son funciones especiales en React que te permiten "enganchar" (hook into) el estado y el ciclo de vida de componentes funcionales. Antes de que los hooks existieran, las funciones en React no podían manejar estado, lo cual limitaba su capacidad.

## 🛠️ Hooks Esenciales

### useState
El hook `useState` te permite añadir estado a un componente funcional. Es uno de los más utilizados y fundamentales.

```javascript
import React, { useState } from 'react';

function Contador() {
  const [cuenta, setCuenta] = useState(0);

  return (
    <div>
      <p>Clics: {cuenta}</p>
      <button onClick={() => setCuenta(cuenta + 1)}>
        Incrementar
      </button>
    </div>
  );
}
```

### useEffect
El hook `useEffect` se utiliza para realizar efectos secundarios en componentes funcionales, como llamadas a APIs, suscripciones a eventos, y actualizaciones de DOM.

```javascript
import React, { useEffect } from 'react';

function Ejemplo() {
  useEffect(() => {
    document.title = 'El componente se ha montado';

    return () => {
      document.title = 'El componente se ha desmontado';
    };
  }, []);

  return <p>Mira el título de la página 👀</p>;
}
```

### useContext
`useContext` te permite acceder a un contexto sin necesidad de pasar `props` manualmente a través de cada nivel del árbol de componentes.

```javascript
import React, { useContext } from 'react';

const TemaContexto = React.createContext('light');

function Boton() {
  const tema = useContext(TemaContexto);
  return <button className={tema}>Botón con contexto</button>;
}
```

## 📈 Recomendaciones para un Mejor Uso de Hooks

- **Organiza tu código:** Mantén tus hooks bien organizados y evita anidar hooks dentro de condicionales o bucles.
- **Crea hooks personalizados:** Si ves que repites lógica similar en varios componentes, considera crear un hook personalizado para reutilizar el código.
- **Evita demasiados efectos secundarios:** Ten cuidado de no sobrecargar tus componentes con efectos secundarios complejos dentro de `useEffect`.

¡Dominar estos hooks te permitirá escribir código más limpio y eficiente en React! 🚀
```
