---
title: "Códigos de Estado HTTP que Todo Desarrollador Debe Conocer para Conexiones con APIs"
summary: "Conoce los códigos de estado HTTP más importantes para manejar respuestas al trabajar con APIs y cómo utilizarlos correctamente en tus aplicaciones."
date: "Aug 26 2024"
draft: false
tags:
- APIs
- Desarrollo Web

---

# Códigos de Estado HTTP que Todo Desarrollador Debe Conocer para Conexiones con APIs

Cuando trabajas con APIs, es crucial entender los códigos de estado HTTP que las APIs devuelven. Estos códigos indican el resultado de la solicitud realizada y te ayudan a manejar las respuestas de manera adecuada en tus aplicaciones. Aquí te presento algunos de los códigos de estado más importantes y cómo usarlos correctamente.

## 1. **200 OK ✅**

Este es uno de los códigos más comunes y significa que la solicitud se completó con éxito. Si tu API devuelve un `200 OK`, todo va bien.

### ¿Cuándo se usa?
- Cuando la solicitud GET, POST, PUT o DELETE se realizó con éxito.

### Ejemplo:
```javascript
fetch('https://api.example.com/data')
  .then(response => {
    if (response.status === 200) {
      return response.json();
    }
    throw new Error('Algo salió mal');
  })
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

## 2. **201 Created 🎉**

Este código se devuelve cuando una solicitud POST ha creado un nuevo recurso con éxito. Es un buen indicador de que una nueva entrada en la base de datos o un nuevo objeto ha sido creado.

### ¿Cuándo se usa?
- Cuando se crea un recurso nuevo, como un usuario o una entrada en un blog.

### Ejemplo:
```javascript
fetch('https://api.example.com/users', {
  method: 'POST',
  body: JSON.stringify({ name: 'Julio', age: 20 }),
  headers: { 'Content-Type': 'application/json' }
})
  .then(response => {
    if (response.status === 201) {
      console.log('Usuario creado con éxito');
    }
  });
```

## 3. **204 No Content 🚫**

Este código indica que la solicitud se procesó con éxito, pero no se devolvió contenido. Es útil cuando, por ejemplo, se elimina un recurso.

### ¿Cuándo se usa?
- Después de una solicitud DELETE o PUT que no requiere devolver datos al cliente.

### Ejemplo:
```javascript
fetch('https://api.example.com/users/123', {
  method: 'DELETE'
})
  .then(response => {
    if (response.status === 204) {
      console.log('Usuario eliminado con éxito');
    }
  });
```

## 4. **400 Bad Request ❌**

Este código se devuelve cuando el servidor no puede procesar la solicitud debido a un error del cliente, como datos mal formateados o parámetros faltantes.

### ¿Cuándo se usa?
- Cuando la solicitud no cumple con las reglas del servidor, como parámetros incorrectos o datos incompletos.

### Ejemplo:
```javascript
fetch('https://api.example.com/users', {
  method: 'POST',
  body: JSON.stringify({ name: '', age: 'invalid' }),
  headers: { 'Content-Type': 'application/json' }
})
  .then(response => {
    if (response.status === 400) {
      console.error('Solicitud incorrecta');
    }
  });
```

## 5. **401 Unauthorized 🔐**

Este código indica que el cliente debe autenticarse antes de que la solicitud pueda ser procesada. Es común en APIs protegidas por autenticación.

### ¿Cuándo se usa?
- Cuando el usuario intenta acceder a recursos sin credenciales válidas.

### Ejemplo:
```javascript
fetch('https://api.example.com/secure-data', {
  headers: { 'Authorization': 'Bearer token_incorrecto' }
})
  .then(response => {
    if (response.status === 401) {
      console.error('No autorizado. Inicie sesión.');
    }
  });
```

## 6. **403 Forbidden 🚫**

Este código indica que el servidor comprendió la solicitud, pero se niega a autorizarla. A diferencia del 401, aquí la autenticación puede haber ocurrido, pero el usuario no tiene permisos para realizar la acción.

### ¿Cuándo se usa?
- Cuando el usuario autenticado no tiene permisos para acceder a un recurso.

### Ejemplo:
```javascript
fetch('https://api.example.com/admin-data', {
  headers: { 'Authorization': 'Bearer token_correcto' }
})
  .then(response => {
    if (response.status === 403) {
      console.error('Acceso denegado. No tienes permisos para ver esto.');
    }
  });
```

## 7. **404 Not Found 🕵️‍♂️**

Este es uno de los códigos más conocidos y significa que el recurso solicitado no fue encontrado en el servidor.

### ¿Cuándo se usa?
- Cuando un recurso no existe en el servidor o se accede a una URL incorrecta.

### Ejemplo:
```javascript
fetch('https://api.example.com/unknown-resource')
  .then(response => {
    if (response.status === 404) {
      console.error('Recurso no encontrado');
    }
  });
```

## 8. **500 Internal Server Error ⚠️**

Este código indica que algo salió mal en el servidor. No es culpa del cliente, y generalmente significa que el servidor encontró un problema inesperado.

### ¿Cuándo se usa?
- Cuando ocurre un error interno en el servidor, como una excepción no controlada.

### Ejemplo:
```javascript
fetch('https://api.example.com/may-fail')
  .then(response => {
    if (response.status === 500) {
      console.error('Error en el servidor. Inténtalo más tarde.');
    }
  });
```

## Conclusión

Conocer y manejar correctamente estos códigos de estado HTTP es crucial para desarrollar aplicaciones web robustas y fáciles de depurar. Al trabajar con APIs, estos códigos te ayudarán a entender qué está pasando en cada etapa de la comunicación entre tu aplicación y el servidor. ¡Mantén esta guía a mano para mejorar tus conexiones con APIs! 🚀
```
