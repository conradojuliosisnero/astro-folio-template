import os
import shutil
import random
from datetime import datetime, timedelta
import json

# Configuración de directorios
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PENDING_DIR = os.path.join(SCRIPT_DIR, 'src', 'pages', 'blog', 'pending')
BLOG_DIR = os.path.join(SCRIPT_DIR, 'src', 'content', 'blog')

# Configuración para limpieza automática
MAX_POSTS = 50  # Máximo número de posts a mantener
DAYS_TO_KEEP = 90  # Días a mantener los posts

# Templates para generar contenido automático
TOPICS = [
    "Astro", "JavaScript", "Python", "React", "Vue.js", "CSS", "HTML",
    "TypeScript", "Node.js", "Git", "VSCode", "Performance Web", 
    "SEO", "Testing", "API REST", "GraphQL", "Tailwind CSS", "Docker"
]

POST_TYPES = {
    "tutorial": {
        "title": "Como {action} en {topic}",
        "template": """---
title: "{title}"
summary: "{summary}"
date: "{formatted_date}"
draft: false
tags:
- Tutorial
- {topic}
---

# {title}

{introduction}

## Preparación del Entorno

{preparation_content}

## Paso a Paso

### Paso 1: {step_1_title}

{step_1_content}

### Paso 2: {step_2_title}

{step_2_content}

### Paso 3: {step_3_title}

{step_3_content}

## Configuración Adicional

{additional_config}

## Verificación del Resultado

{verification_content}

## Consejos y Mejores Prácticas

{tips_content}

## Resolución de Problemas Comunes

{troubleshooting_content}

## Conclusión

{conclusion}
"""
    },
    "guia": {
        "title": "Guía completa de {topic}",
        "template": """---
title: "{title}"
summary: "{summary}"
date: "{formatted_date}"
draft: false
tags:
- Guía
- {topic}
---

# {title}

Esta guía te ayudará a dominar los aspectos fundamentales de **{topic}** desde cero hasta un nivel avanzado.

## ¿Qué es {topic}?

{topic_definition}

## Características Principales

{main_features}

## Ventajas de usar {topic}

{advantages_content}

## Instalación y Configuración

{installation_content}

## Conceptos Fundamentales

### {concept_1}
{concept_1_explanation}

### {concept_2}
{concept_2_explanation}

### {concept_3}
{concept_3_explanation}

## Ejemplos Prácticos

{practical_examples}

## Herramientas Recomendadas

{recommended_tools}

## Recursos de Aprendizaje

{learning_resources}

## Resumen

{summary_content}
"""
    },
    "tips": {
        "title": "Tips esenciales para {topic}",
        "template": """---
title: "{title}"
summary: "{summary}"
date: "{formatted_date}"
draft: false
tags:
- Tips
- {topic}
---

# {title}

Descubre los consejos más útiles para mejorar tu productividad y eficiencia trabajando con **{topic}**.

## Tip #1: {tip_1_title}

{tip_1_content}

## Tip #2: {tip_2_title}

{tip_2_content}

## Tip #3: {tip_3_title}

{tip_3_content}

## Tip #4: {tip_4_title}

{tip_4_content}

## Tip #5: {tip_5_title}

{tip_5_content}

## Herramientas Útiles

{useful_tools}

## Comandos Esenciales

{essential_commands}

## Recursos Adicionales

{additional_resources}

## Conclusión

{tips_conclusion}
"""
    }
}

# Contenido dinámico para los posts
ACTIONS = {
    "Astro": ["crear un proyecto", "configurar rutas", "añadir componentes", "optimizar el build", "implementar SSG"],
    "JavaScript": ["manejar arrays", "usar async/await", "crear funciones", "manipular el DOM", "trabajar con APIs"],
    "Python": ["crear un entorno virtual", "manejar excepciones", "usar decoradores", "trabajar con archivos", "crear clases"],
    "React": ["crear componentes", "manejar estado", "usar hooks", "implementar routing", "optimizar rendimiento"],
    "Vue.js": ["configurar un proyecto", "crear componentes reactivos", "manejar directivas", "usar Vuex", "implementar routing"],
    "CSS": ["crear layouts responsivos", "usar flexbox", "implementar animaciones", "optimizar estilos", "usar variables CSS"],
    "HTML": ["estructurar páginas", "usar elementos semánticos", "optimizar SEO", "implementar formularios", "mejorar accesibilidad"],
    "TypeScript": ["configurar tipos", "usar interfaces", "implementar generics", "manejar módulos", "crear decoradores"],
    "Node.js": ["crear servidores", "manejar rutas", "conectar bases de datos", "implementar middleware", "manejar archivos"],
    "Git": ["manejar ramas", "resolver conflictos", "usar hooks", "configurar workflows", "colaborar en equipo"],
    "VSCode": ["configurar extensiones", "usar atajos", "personalizar el editor", "debuggear código", "usar snippets"],
    "Performance Web": ["optimizar imágenes", "reducir bundle size", "implementar lazy loading", "usar service workers", "mejorar Core Web Vitals"],
    "SEO": ["optimizar meta tags", "mejorar estructura", "implementar schema markup", "optimizar velocidad", "crear sitemaps"],
    "Testing": ["escribir unit tests", "implementar integration tests", "usar mocks", "configurar CI/CD", "hacer testing E2E"],
    "API REST": ["diseñar endpoints", "manejar autenticación", "implementar CRUD", "validar datos", "documentar APIs"],
    "GraphQL": ["crear schemas", "resolver queries", "manejar mutations", "implementar subscriptions", "optimizar queries"],
    "Tailwind CSS": ["configurar el framework", "crear componentes", "usar utilidades", "customizar colores", "optimizar producción"],
    "Docker": ["crear contenedores", "usar docker-compose", "optimizar imágenes", "manejar volúmenes", "desplegar aplicaciones"]
}

CONTENT_PIECES = {
    "introduction": [
        "En este tutorial aprenderás todo lo necesario para dominar esta tecnología.",
        "Esta guía te llevará paso a paso desde los conceptos básicos hasta técnicas avanzadas.",
        "Descubre cómo aprovechar al máximo esta herramienta en tus proyectos.",
        "Una guía completa que te ahorrará horas de investigación y pruebas."
    ],
    "preparation": [
        "Antes de comenzar, asegúrate de tener todas las herramientas necesarias instaladas en tu sistema.",
        "Para seguir este tutorial necesitarás tener conocimientos básicos de desarrollo web.",
        "Verificar que tu entorno de desarrollo esté correctamente configurado es fundamental.",
        "Prepara tu workspace con las extensiones y herramientas recomendadas."
    ],
    "tips": [
        "Siempre mantén tu código organizado y bien documentado",
        "Usa herramientas de linting para mantener la consistencia",
        "Configura atajos de teclado para mejorar tu productividad",
        "Implementa testing desde el inicio del proyecto",
        "Mantén actualizadas tus dependencias regularmente"
    ],
    "troubleshooting": [
        "Si encuentras errores, revisa primero la consola del navegador para obtener más información.",
        "Verifica que todas las dependencias estén correctamente instaladas y actualizadas.",
        "Consulta la documentación oficial si tienes dudas sobre la sintaxis o configuración.",
        "La comunidad en Stack Overflow y GitHub suele tener soluciones a problemas comunes."
    ]
}

def create_directories():
    """Crea los directorios necesarios si no existen."""
    for directory in [PENDING_DIR, BLOG_DIR]:
        if not os.path.exists(directory):
            os.makedirs(directory, exist_ok=True)
            print(f'Directorio creado: {directory}')

def generate_automatic_post():
    """Genera un post automático si no hay posts pendientes."""
    today = datetime.now()
    # Formato de fecha como en tu ejemplo: "Aug 11 2024"
    formatted_date = today.strftime("%b %d %Y")
    
    # Seleccionar tema y tipo de post aleatorio
    topic = random.choice(TOPICS)
    post_type = random.choice(list(POST_TYPES.keys()))
    post_config = POST_TYPES[post_type]
    
    # Seleccionar acción específica para el tema
    action = random.choice(ACTIONS.get(topic, ["trabajar con", "implementar", "configurar"]))
    
    # Generar contenido específico
    title = post_config["title"].format(action=action, topic=topic)
    summary = f"Tutorial para {action} {topic} paso a paso"
    
    if post_type == "guia":
        title = post_config["title"].format(topic=topic)
        summary = f"Guía completa para dominar {topic} desde cero"
    elif post_type == "tips":
        title = post_config["title"].format(topic=topic)
        summary = f"Consejos y trucos esenciales para trabajar con {topic}"
    
    # Generar slug para la carpeta
    topic_slug = topic.lower().replace(" ", "-").replace(".", "")
    date_slug = today.strftime("%Y-%m-%d")
    folder_name = f"{date_slug}-{post_type}-{topic_slug}"
    
    # Crear carpeta del post
    post_folder = os.path.join(PENDING_DIR, folder_name)
    os.makedirs(post_folder, exist_ok=True)
    
    # Generar contenido específico por tipo
    content_data = generate_content_for_type(post_type, topic, action)
    
    # Generar contenido del post
    content = post_config["template"].format(
        title=title,
        summary=summary,
        formatted_date=formatted_date,
        topic=topic,
        action=action,
        **content_data
    )
    
    # Escribir archivo markdown
    md_file = os.path.join(post_folder, "index.md")
    with open(md_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'Post automático generado: {folder_name}')
    return folder_name

def generate_content_for_type(post_type, topic, action):
    """Genera contenido específico basado en el tipo de post."""
    
    if post_type == "tutorial":
        return {
            "introduction": f"En este tutorial aprenderás como {action} en {topic} de manera profesional. Te guiaremos paso a paso desde la configuración inicial hasta la implementación completa.",
            "preparation_content": f"Antes de comenzar con {topic}, necesitarás tener instalado Node.js y un editor de código como VSCode. También es recomendable tener conocimientos básicos de desarrollo web.",
            "step_1_title": "Configuración Inicial",
            "step_1_content": f"El primer paso es configurar correctamente el entorno de desarrollo para {topic}. Esto incluye la instalación de dependencias y la configuración de archivos necesarios.",
            "step_2_title": "Implementación Base",
            "step_2_content": f"Una vez configurado el entorno, procedemos a implementar la funcionalidad básica. En {topic}, esto implica crear la estructura fundamental del proyecto.",
            "step_3_title": "Configuración Avanzada",
            "step_3_content": f"Para aprovechar al máximo {topic}, es importante configurar las opciones avanzadas que nos permitirán optimizar nuestro proyecto.",
            "additional_config": f"Existen configuraciones adicionales que pueden mejorar significativamente la experiencia de desarrollo con {topic}. Estas incluyen herramientas de linting, formateo y testing.",
            "verification_content": f"Para verificar que todo funciona correctamente, ejecuta los comandos de prueba y revisa que no haya errores en la consola.",
            "tips_content": "\n".join([f"- {tip}" for tip in random.sample(CONTENT_PIECES["tips"], 3)]),
            "troubleshooting_content": random.choice(CONTENT_PIECES["troubleshooting"]),
            "conclusion": f"Siguiendo estos pasos has aprendido exitosamente como {action} en {topic}. Ahora tienes las bases para crear proyectos más complejos y eficientes."
        }
    
    elif post_type == "guia":
        return {
            "topic_definition": f"{topic} es una herramienta/tecnología moderna que permite a los desarrolladores crear aplicaciones eficientes y escalables.",
            "main_features": f"- **Rendimiento optimizado**: {topic} está diseñado para ofrecer el máximo rendimiento\n- **Facilidad de uso**: Sintaxis intuitiva y documentación completa\n- **Flexibilidad**: Adaptable a diferentes tipos de proyectos\n- **Comunidad activa**: Gran soporte de la comunidad de desarrolladores",
            "advantages_content": f"Usar {topic} en tus proyectos te proporcionará ventajas como mejor rendimiento, código más limpio, facilidad de mantenimiento y mejor experiencia de desarrollador.",
            "installation_content": f"Para instalar {topic}, necesitarás tener Node.js instalado en tu sistema. Luego podrás usar npm o yarn para añadir {topic} a tu proyecto.",
            "concept_1": "Configuración Básica",
            "concept_1_explanation": f"La configuración básica de {topic} incluye la instalación de dependencias y la configuración de archivos de configuración principales.",
            "concept_2": "Estructura de Proyecto",
            "concept_2_explanation": f"Un proyecto bien estructurado en {topic} sigue convenciones específicas que facilitan el mantenimiento y la escalabilidad.",
            "concept_3": "Optimización",
            "concept_3_explanation": f"Las técnicas de optimización en {topic} permiten obtener el máximo rendimiento de tus aplicaciones.",
            "practical_examples": f"Algunos ejemplos prácticos de uso de {topic} incluyen la creación de sitios web estáticos, aplicaciones de una sola página, y APIs REST.",
            "recommended_tools": f"Para trabajar con {topic}, recomendamos usar VSCode con las extensiones oficiales, junto con herramientas como ESLint y Prettier.",
            "learning_resources": "- Documentación oficial\n- Tutoriales en línea\n- Cursos especializados\n- Comunidades de desarrolladores",
            "summary_content": f"Esta guía te ha proporcionado una base sólida para comenzar a trabajar con {topic}. Con práctica y experiencia, podrás aprovechar todo su potencial."
        }
    
    elif post_type == "tips":
        tips_list = [
            f"Optimización de Configuración - Configura {topic} correctamente desde el inicio para evitar problemas futuros",
            f"Uso de Herramientas - Aprovecha las herramientas de desarrollo disponibles para {topic}",
            f"Mejores Prácticas - Sigue las convenciones establecidas por la comunidad de {topic}",
            f"Debugging Eficiente - Aprende a debuggear efectivamente tus proyectos de {topic}",
            f"Performance - Implementa técnicas de optimización para mejorar el rendimiento"
        ]
        
        return {
            "tip_1_title": tips_list[0].split(" - ")[0],
            "tip_1_content": tips_list[0].split(" - ")[1],
            "tip_2_title": tips_list[1].split(" - ")[0],
            "tip_2_content": tips_list[1].split(" - ")[1],
            "tip_3_title": tips_list[2].split(" - ")[0],
            "tip_3_content": tips_list[2].split(" - ")[1],
            "tip_4_title": tips_list[3].split(" - ")[0],
            "tip_4_content": tips_list[3].split(" - ")[1],
            "tip_5_title": tips_list[4].split(" - ")[0],
            "tip_5_content": tips_list[4].split(" - ")[1],
            "useful_tools": f"Algunas herramientas útiles para trabajar con {topic} incluyen editores especializados, plugins de VSCode, y herramientas de línea de comandos.",
            "essential_commands": f"Los comandos esenciales que debes conocer para {topic} incluyen comandos de instalación, construcción, y despliegue.",
            "additional_resources": "- Blog posts de la comunidad\n- Videos tutoriales\n- Repositorios de ejemplos\n- Foros de discusión",
            "tips_conclusion": f"Estos tips te ayudarán a ser más productivo y eficiente trabajando con {topic}. La práctica constante es clave para dominar cualquier tecnología."
        }
    
    return {}

def cleanup_old_posts():
    """Limpia posts antiguos para mantener el repositorio ligero."""
    if not os.path.exists(BLOG_DIR):
        return
    
    # Obtener lista de posts con fechas
    posts = []
    for item in os.listdir(BLOG_DIR):
        item_path = os.path.join(BLOG_DIR, item)
        if os.path.isdir(item_path):
            # Intentar extraer fecha del nombre de la carpeta
            try:
                date_part = item.split('-')[:3]  # YYYY-MM-DD
                if len(date_part) == 3:
                    post_date = datetime.strptime('-'.join(date_part), "%Y-%m-%d")
                    posts.append((item, item_path, post_date))
            except ValueError:
                # Si no puede parsear la fecha, usar fecha de modificación
                mod_time = datetime.fromtimestamp(os.path.getmtime(item_path))
                posts.append((item, item_path, mod_time))
    
    # Ordenar por fecha (más recientes primero)
    posts.sort(key=lambda x: x[2], reverse=True)
    
    # Calcular fecha límite
    cutoff_date = datetime.now() - timedelta(days=DAYS_TO_KEEP)
    
    deleted_count = 0
    
    # Eliminar posts antiguos
    for post_name, post_path, post_date in posts[MAX_POSTS:]:
        shutil.rmtree(post_path)
        print(f'Post eliminado por límite de cantidad: {post_name}')
        deleted_count += 1
    
    # Eliminar posts por antigüedad (solo los que quedan)
    remaining_posts = posts[:MAX_POSTS]
    for post_name, post_path, post_date in remaining_posts:
        if post_date < cutoff_date:
            shutil.rmtree(post_path)
            print(f'Post eliminado por antigüedad: {post_name}')
            deleted_count += 1
    
    if deleted_count > 0:
        print(f'Limpieza completada: {deleted_count} posts eliminados')
    else:
        print('No se necesitó limpieza')

def move_folder(src, dst):
    """Mueve una carpeta de src a dst."""
    if os.path.exists(dst):
        shutil.rmtree(dst)
    shutil.move(src, dst)

def publish_pending_post():
    """Publica un post pendiente."""
    if not os.path.exists(PENDING_DIR):
        return None
    
    folders = sorted([f for f in os.listdir(PENDING_DIR) 
                     if os.path.isdir(os.path.join(PENDING_DIR, f))])
    
    if folders:
        folder_to_publish = folders[0]
        old_path = os.path.join(PENDING_DIR, folder_to_publish)
        new_path = os.path.join(BLOG_DIR, folder_to_publish)
        
        move_folder(old_path, new_path)
        print(f'Post publicado: {folder_to_publish}')
        return folder_to_publish
    
    return None

def get_repository_stats():
    """Obtiene estadísticas del repositorio."""
    stats = {
        "total_posts": 0,
        "pending_posts": 0,
        "repo_size": "N/A"
    }
    
    if os.path.exists(BLOG_DIR):
        stats["total_posts"] = len([d for d in os.listdir(BLOG_DIR) 
                                   if os.path.isdir(os.path.join(BLOG_DIR, d))])
    
    if os.path.exists(PENDING_DIR):
        stats["pending_posts"] = len([d for d in os.listdir(PENDING_DIR) 
                                     if os.path.isdir(os.path.join(PENDING_DIR, d))])
    
    return stats

def main():
    print("=== AUTOMATIZACIÓN DEL BLOG ===")
    print(f"Directorio del script: {SCRIPT_DIR}")
    print(f"Directorio pending: {PENDING_DIR}")
    print(f"Directorio blog: {BLOG_DIR}")
    
    # Crear directorios necesarios
    create_directories()
    
    # Mostrar estadísticas iniciales
    initial_stats = get_repository_stats()
    print(f"Posts publicados: {initial_stats['total_posts']}")
    print(f"Posts pendientes: {initial_stats['pending_posts']}")
    
    # Si no hay posts pendientes, generar uno automáticamente
    if initial_stats['pending_posts'] == 0:
        print("\nNo hay posts pendientes. Generando post automático...")
        generate_automatic_post()
    
    # Publicar un post pendiente
    published_post = publish_pending_post()
    if published_post:
        print(f"\n✅ Post publicado exitosamente: {published_post}")
    else:
        print("\n❌ No hay posts para publicar")
    
    # Ejecutar limpieza automática
    print("\n=== LIMPIEZA AUTOMÁTICA ===")
    cleanup_old_posts()
    
    # Mostrar estadísticas finales
    final_stats = get_repository_stats()
    print(f"\n=== ESTADÍSTICAS FINALES ===")
    print(f"Posts publicados: {final_stats['total_posts']}")
    print(f"Posts pendientes: {final_stats['pending_posts']}")
    
    print("\n🎉 Proceso completado exitosamente!")

if __name__ == "__main__":
    main()