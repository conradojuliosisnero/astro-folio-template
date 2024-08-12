---
title: "Como crear un proyecto con Next.js"
summary: "Pasos para crear un proyecto con Next.js en VSCode y no morir en el proceso"
date: "Aug 12 2024"
draft: false
tags:
- Nextjs
- VSCode
- Tutorial

---

Para crear un proyecto con Next.js siguiendo una estructura de Markdown más detallada y organizada, puedes seguir estos pasos. Este enfoque te permitirá entender cada paso de manera clara y concisa, facilitando la creación y configuración de tu proyecto.

### Paso 1: Preparación

- **Instala Node.js**: Asegúrate de tener Node.js instalado en tu sistema. Next.js requiere Node.js versión 12.0 o superior. Puedes descargarlo desde [Node.js official website](https://nodejs.org/).

### Paso 2: Crear el Proyecto

- **Usa `create-next-app`**: Abre tu terminal y ejecuta el siguiente comando para crear un nuevo proyecto Next.js. Reemplaza `nombre-de-tu-proyecto` con el nombre que desees para tu proyecto.

  ```bash
  npx create-next-app@latest nombre-de-tu-proyecto
  ```

### Paso 3: Navegación y Configuración

- **Navega al Directorio del Proyecto**: Una vez creado el proyecto, navega dentro del directorio del proyecto usando el comando:

  ```bash
  cd nombre-de-tu-proyecto
  ```

### Paso 4: Ejecución del Servidor de Desarrollo

- **Inicia el Servidor de Desarrollo**: Para ver tu aplicación en acción, ejecuta el siguiente comando en el directorio del proyecto:

  ```bash
  npm run dev
  ```

  Esto iniciará el servidor de desarrollo en `http://localhost:3000`.

### Paso 5: Integración de MDX

- **Instala `@next/mdx` y Dependencias Necesarias**: Para trabajar con MDX (Markdown + JSX), necesitas instalar `@next/mdx` junto con algunas otras dependencias. Ejecuta:

  ```bash
  npm install @next/mdx remark remark-html
  ```

- **Configura `next.config.js`**: Crea o modifica el archivo `next.config.js` en la raíz de tu proyecto para incluir la configuración de MDX. Aquí hay un ejemplo básico de cómo hacerlo:

  ```javascript
  module.exports = {
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
    webpack(config, { isServer }) {
      config.module.rules.push({
        test: /\.mdx?$/,
        use: ['babel-loader', '@next/mdx'],
      });

      return config;
    },
  };
  ```

### Paso 6: Crear Contenido MDX

- **Crea Archivos MDX**: Dentro de tu proyecto, crea archivos `.mdx` en el directorio `/pages` o `/app` para comenzar a escribir contenido con JSX. Por ejemplo, puedes crear un archivo `about.mdx` con el siguiente contenido:

  ```mdx
  # Acerca de Nosotros

  Somos una empresa innovadora en tecnología.
  ```

### Paso 7: Renderizar Contenido MDX

- **Utiliza `getStaticProps` o `getServerSideProps`**: Para renderizar contenido dinámico basado en archivos MDX, puedes usar `getStaticProps` o `getServerSideProps` en tus páginas. Aquí hay un ejemplo básico de cómo hacerlo:

  ```javascript
  import { getPostData } from '../lib/posts';

  export async function getStaticProps(context) {
    const postData = await getPostData(context.params.id);
    return {
      props: {
        postData,
      },
    };
  }

  export default function Post({ postData }) {
    return (
      <div>
        <h1>{postData.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </div>
    );
  }
  ```

Este enfoque te proporciona una estructura clara y detallada para crear y configurar un proyecto Next.js, incluyendo la integración de MDX para trabajar con contenido Markdown y JSX.


