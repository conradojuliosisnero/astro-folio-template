import os
import shutil
import subprocess
from datetime import datetime

# Configuración de directorios
PENDING_DIR = 'src/pages/posts/pending'
BLOG_DIR = 'src/content/blog'

def move_folder(src, dst):
    """ Mueve una carpeta de src a dst """
    if os.path.exists(dst):
        shutil.rmtree(dst)  # Elimina la carpeta de destino si ya existe
    shutil.move(src, dst)

def main():
    # Obtener la lista de carpetas pendientes (no archivos)
    folders = sorted(os.listdir(PENDING_DIR))

    if folders:
        # Seleccionar la primera carpeta
        folder_to_publish = folders[0]
        old_path = os.path.join(PENDING_DIR, folder_to_publish)
        new_path = os.path.join(BLOG_DIR, folder_to_publish)

        # Mover la carpeta al directorio de blog
        move_folder(old_path, new_path)
        print(f'Carpeta publicada: {folder_to_publish}')

        # Cambiar a la rama develop y hacer commit
        subprocess.run(['git', 'checkout', 'develop'])
        subprocess.run(['git', 'add', '.'])
        subprocess.run(['git', 'commit', '-m', f'Publicar carpeta: {folder_to_publish}'])
        subprocess.run(['git', 'push', 'origin', 'develop'])

        # Cambiar a la rama main, hacer merge y push
        subprocess.run(['git', 'checkout', 'main'])
        subprocess.run(['git', 'merge', 'develop'])
        subprocess.run(['git', 'push', 'origin', 'main'])

        print('Carpeta subida y merge realizado con éxito.')
    else:
        print("No hay carpetas pendientes para publicar.")

if __name__ == "__main__":
    main()
