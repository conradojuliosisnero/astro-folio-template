import os
import shutil

# Configuración de directorios
PENDING_DIR = 'src/pages/blog/pending'
BLOG_DIR = 'src/content/blog'

def move_folder(src, dst):
    """ Mueve una carpeta de src a dst """
    if os.path.exists(dst):
        shutil.rmtree(dst)  # Elimina la carpeta de destino si ya existe
    shutil.move(src, dst)

def main():
    # Crear el directorio pending si no existe
    if not os.path.exists(PENDING_DIR):
        os.makedirs(PENDING_DIR)
        print(f'Directorio creado: {PENDING_DIR}')
    
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
    else:
        print("No hay carpetas pendientes para publicar.")

if __name__ == "__main__":
    main()
