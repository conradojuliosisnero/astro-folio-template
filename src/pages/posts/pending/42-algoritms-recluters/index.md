---
title: "Algoritmos Más Comunes en Entrevistas Técnicas con JavaScript 🧠"
summary: "Explora los algoritmos más comunes que se piden en entrevistas técnicas, aprende cómo funcionan y cómo resolverlos con JavaScript para estar mejor preparado para tu próxima entrevista."
date: "Sep 20 2024"
draft: false
tags:
- Algoritmos
- Entrevistas Técnicas
- JavaScript
---

# Algoritmos Más Comunes en Entrevistas Técnicas con JavaScript 🧠

¡Hola, desarrolladores! En las entrevistas técnicas, a menudo te pedirán que resuelvas problemas de algoritmos para evaluar tus habilidades de resolución de problemas y tu conocimiento de JavaScript. Hoy vamos a explorar algunos de los algoritmos más comunes que podrías encontrar en entrevistas, cómo funcionan y cómo puedes resolverlos utilizando JavaScript. 🚀

## 1. Búsqueda Binaria 🔍

### ¿Qué es?

La búsqueda binaria es un algoritmo eficiente para encontrar un elemento en una lista ordenada. Divide la lista en dos mitades y descarta una mitad en cada iteración, reduciendo significativamente el número de comparaciones.

### Cómo Funciona

1. Comienza con los índices `izquierdo` y `derecho` que abarcan toda la lista.
2. Calcula el índice del elemento central.
3. Compara el valor del elemento central con el valor buscado.
4. Si el valor buscado es menor que el valor central, ajusta el índice `derecho`.
5. Si es mayor, ajusta el índice `izquierdo`.
6. Repite hasta encontrar el valor o hasta que los índices se crucen.

### Cómo Resolverlo en JavaScript

```javascript
function busquedaBinaria(arr, objetivo) {
    let izquierdo = 0;
    let derecho = arr.length - 1;

    while (izquierdo <= derecho) {
        const medio = Math.floor((izquierdo + derecho) / 2);
        if (arr[medio] === objetivo) return medio;
        if (arr[medio] < objetivo) izquierdo = medio + 1;
        else derecho = medio - 1;
    }

    return -1; // No encontrado
}
```

## 2. Ordenamiento por Burbuja (Bubble Sort) 🧮

### ¿Qué es?

El ordenamiento por burbuja es un algoritmo simple de clasificación que compara elementos adyacentes y los intercambia si están en el orden incorrecto. El proceso se repite hasta que toda la lista está ordenada.

### Cómo Funciona

1. Recorre la lista y compara elementos adyacentes.
2. Si el elemento actual es mayor que el siguiente, intercámbialos.
3. Repite el proceso para cada elemento de la lista, disminuyendo el rango de comparación en cada iteración.

### Cómo Resolverlo en JavaScript

```javascript
function burbuja(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}
```

## 3. Algoritmo de Dijkstra para el Camino Más Corto 🛣️

### ¿Qué es?

El algoritmo de Dijkstra encuentra el camino más corto desde un nodo de inicio a todos los demás nodos en un gráfico ponderado con pesos no negativos.

### Cómo Funciona

1. Inicializa las distancias desde el nodo de inicio a infinito, excepto el nodo de inicio mismo, que se establece en 0.
2. Usa una cola de prioridad para explorar el nodo con la distancia más corta conocida.
3. Actualiza las distancias a los nodos vecinos.
4. Repite hasta que todos los nodos hayan sido procesados.

### Cómo Resolverlo en JavaScript

```javascript
function dijkstra(graph, start) {
    const dist = {};
    const prev = {};
    const queue = new PriorityQueue();

    graph.forEach(node => {
        dist[node] = Infinity;
        prev[node] = null;
        queue.enqueue(node, dist[node]);
    });

    dist[start] = 0;
    queue.enqueue(start, dist[start]);

    while (!queue.isEmpty()) {
        const { node } = queue.dequeue();
        graph[node].forEach(neighbor => {
            const alt = dist[node] + neighbor.weight;
            if (alt < dist[neighbor.node]) {
                dist[neighbor.node] = alt;
                prev[neighbor.node] = node;
                queue.enqueue(neighbor.node, dist[neighbor.node]);
            }
        });
    }

    return { dist, prev };
}
```

## 4. Algoritmo de Fibonacci (Recursivo y Dinámico) 🧮

### ¿Qué es?

El algoritmo de Fibonacci calcula la secuencia de Fibonacci, donde cada número es la suma de los dos anteriores. Es un clásico en la programación que se puede resolver de manera recursiva o dinámica.

### Cómo Funciona

1. **Recursivo**: Calcula el valor de Fibonacci de manera recursiva. Puede ser ineficiente para números grandes debido a la repetición de cálculos.
2. **Dinámico**: Utiliza una tabla para almacenar los valores de Fibonacci ya calculados y evitar cálculos redundantes.

### Cómo Resolverlo en JavaScript

**Recursivo:**

```javascript
function fibonacciRecursivo(n) {
    if (n <= 1) return n;
    return fibonacciRecursivo(n - 1) + fibonacciRecursivo(n - 2);
}
```

**Dinámico:**

```javascript
function fibonacciDinamico(n) {
    const fib = [0, 1];
    for (let i = 2; i <= n; i++) {
        fib[i] = fib[i - 1] + fib[i - 2];
    }
    return fib[n];
}
```

## 5. Algoritmo de Búsqueda de Subcadena (Knuth-Morris-Pratt - KMP) 🔎

### ¿Qué es?

El algoritmo KMP busca una subcadena dentro de una cadena de texto de manera eficiente al evitar comparaciones redundantes.

### Cómo Funciona

1. **Preprocesamiento**: Construye una tabla de prefijos que indica cómo avanzar al buscar coincidencias.
2. **Búsqueda**: Utiliza la tabla para realizar la búsqueda de manera eficiente.

### Cómo Resolverlo en JavaScript

```javascript
function kmpBuscar(texto, patron) {
    const lps = [];
    let i = 0;
    let j = 0;

    // Construye la tabla de prefijos
    function construirLPS(patron) {
        let len = 0;
        lps[0] = 0;
        i = 1;

        while (i < patron.length) {
            if (patron[i] === patron[len]) {
                len++;
                lps[i] = len;
                i++;
            } else {
                if (len !== 0) {
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }
    }

    construirLPS(patron);

    // Busca el patrón en el texto
    while (i < texto.length) {
        if (patron[j] === texto[i]) {
            i++;
            j++;
        }

        if (j === patron.length) {
            console.log(`Patrón encontrado en índice ${i - j}`);
            j = lps[j - 1];
        } else if (i < texto.length && patron[j] !== texto[i]) {
            if (j !== 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
}
```

## Conclusión 🎉

Estos algoritmos son fundamentales para muchas entrevistas técnicas y te ayudarán a resolver problemas complejos con JavaScript. Practica estos algoritmos y familiarízate con su implementación para estar mejor preparado para tu próxima entrevista técnica. 💻✨

Si tienes alguna pregunta o quieres compartir otros algoritmos que te han ayudado, ¡déjalos en los comentarios! ¡Feliz codificación y buena suerte en tus entrevistas! 🚀

