---
title: "¿Qué es SSR y sus Similares en Next.js? Ejemplos Prácticos"
summary: "Explora Server-Side Rendering (SSR) y sus derivados como SSG, ISR y CSR, con ejemplos prácticos en Next.js para entender cómo y cuándo usarlos."
date: "Aug 29 2024"
draft: false
tags:
- Nextjs
---

# ¿Qué es SSR y sus Similares en Next.js? Ejemplos Prácticos

En el mundo del desarrollo web moderno, **SSR (Server-Side Rendering)** se ha convertido en un concepto clave, especialmente con la popularidad de frameworks como Next.js. Además del SSR, existen otras técnicas similares o derivadas como **SSG (Static Site Generation)**, **ISR (Incremental Static Regeneration)** y **CSR (Client-Side Rendering)**. En este post, exploraremos cada uno de estos conceptos y cómo se aplican en Next.js, con ejemplos prácticos para que puedas entender mejor cuándo y cómo utilizarlos en tus proyectos.

## 1. **Server-Side Rendering (SSR)**

### ¿Qué es SSR?

SSR, o Server-Side Rendering, es una técnica en la que las páginas se renderizan en el servidor en lugar del cliente. Esto significa que el servidor genera el HTML completo para la página y lo envía al cliente. Este enfoque puede mejorar el rendimiento percibido, especialmente en aplicaciones que necesitan ser indexadas por motores de búsqueda o donde el tiempo hasta el primer byte es crucial.

### Ejemplo de SSR en Next.js

En Next.js, puedes implementar SSR utilizando la función `getServerSideProps`. Aquí te dejo un ejemplo:

```javascript
import React from 'react';

export async function getServerSideProps() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  const post = await res.json();

  return {
    props: {
      post,
    },
  };
}

const Post = ({ post }) => {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
};

export default Post;
```

En este ejemplo, los datos del post se obtienen del servidor en tiempo de ejecución y se pasan a la página como props.

## 2. **Static Site Generation (SSG)**

### ¿Qué es SSG?

SSG, o Static Site Generation, genera las páginas HTML en tiempo de compilación en lugar de en tiempo de ejecución. Esto significa que las páginas se generan una vez y se reutilizan para cada solicitud, lo que puede resultar en un tiempo de carga extremadamente rápido.

### Ejemplo de SSG en Next.js

Para implementar SSG en Next.js, puedes usar la función `getStaticProps`:

```javascript
import React from 'react';

export async function getStaticProps() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  const post = await res.json();

  return {
    props: {
      post,
    },
  };
}

const Post = ({ post }) => {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
};

export default Post;
```

Con `getStaticProps`, la página se genera en el momento de la construcción del proyecto y luego se sirve de manera estática.

## 3. **Incremental Static Regeneration (ISR)**

### ¿Qué es ISR?

ISR, o Incremental Static Regeneration, combina lo mejor de SSR y SSG. Permite generar páginas estáticas en tiempo de compilación, pero también las actualiza en el servidor después de un tiempo específico, lo que permite que los datos se mantengan frescos sin la necesidad de una regeneración completa del sitio.

### Ejemplo de ISR en Next.js

ISR se implementa en Next.js usando `revalidate` en `getStaticProps`:

```javascript
import React from 'react';

export async function getStaticProps() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  const post = await res.json();

  return {
    props: {
      post,
    },
    revalidate: 10, // La página se regenerará cada 10 segundos
  };
}

const Post = ({ post }) => {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
};

export default Post;
```

Aquí, la página se regenera cada 10 segundos, asegurando que los datos estén relativamente actualizados sin la necesidad de una reconstrucción completa.

## 4. **Client-Side Rendering (CSR)**

### ¿Qué es CSR?

CSR, o Client-Side Rendering, es la técnica en la que el HTML básico se envía al cliente, y el JavaScript en el navegador se encarga de renderizar la página. Es el enfoque tradicional en aplicaciones SPA (Single Page Application), pero puede resultar en tiempos de carga iniciales más lentos.

### Ejemplo de CSR en Next.js

Aunque Next.js está diseñado para SSR y SSG, también puedes implementar CSR utilizando React Hooks como `useEffect`:

```javascript
import React, { useEffect, useState } from 'react';

const Post = () => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      const data = await res.json();
      setPost(data);
    };

    fetchPost();
  }, []);

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
};

export default Post;
```

En este caso, los datos se obtienen y renderizan completamente en el lado del cliente.

## 5. **Conclusión**

Cada técnica de renderizado tiene sus propias ventajas y casos de uso. **SSR** es ideal para aplicaciones donde el SEO y la velocidad son críticos. **SSG** es perfecto para sitios que no cambian con frecuencia y necesitan tiempos de carga rápidos. **ISR** ofrece un equilibrio entre rendimiento y frescura de los datos, mientras que **CSR** sigue siendo útil para aplicaciones SPA complejas. Next.js te permite aprovechar todas estas técnicas en función de las necesidades de tu proyecto. ¡Explora estas opciones y elige la mejor para tus proyectos web! 🚀
```
