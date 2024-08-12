import subprocess

def run_git_command(command):
    """Ejecuta un comando de Git y muestra su salida."""
    try:
        output = subprocess.check_output(command, stderr=subprocess.STDOUT, shell=True, universal_newlines=True)
        print(output)
    except subprocess.CalledProcessError as e:
        print(f"Error al ejecutar el comando: {e.output}")

def switch_to_main_branch():
    """Cambia al branch 'main'."""
    run_git_command('git checkout main')

def stage_all_changes():
    """Agrega todos los cambios al staging area."""
    run_git_command('git add .')

def commit_changes(commit_message):
    """Confirma los cambios con un mensaje específico."""
    run_git_command(f'git commit -m "{commit_message}"')

def push_changes_to_main():
    """Empuja los cambios a la rama 'main' en el repositorio remoto."""
    run_git_command('git push origin main')

def main():
    # Cambiar a la rama main
    switch_to_main_branch()
    print("Cambiamos al branch 'main'.")

    # Agregar todos los cambios
    stage_all_changes()
    print("Todos los cambios están siendo agregados al staging area.")

    # Confirmar los cambios con un mensaje de commit
    commit_message = "Descripción de los cambios realizados"
    commit_changes(commit_message)
    print(f"Confirmamos los cambios con el mensaje: '{commit_message}'")

    # Empujar los cambios a la rama main
    push_changes_to_main()
    print("Los cambios han sido empujados a la rama 'main'.")

if __name__ == "__main__":
    main()
