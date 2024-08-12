const cron = require("node-cron");
const { exec } = require("child_process");

// Función que ejecuta el script de Python
function runPythonScript() {
  console.log("Iniciando tarea diaria de publicación de post...");

  // Ejecuta el script de Python usando el comando 'exec'
  exec(
    "python3 src/automate_blog.py",
    (err, stdout, stderr) => {
      if (err) {
        console.error(`Error ejecutando el script de Python: ${stderr}`);
        return;
      }
      console.log(stdout); // Imprime la salida del script de Python
    }
  );
}

// Configuración de la tarea cron para que se ejecute todos los días a las 9:00 AM
// minutos, horas, dias, meses, dias de la semana
cron.schedule("* * * * *", () => {
  runPythonScript(); // Llama a la función que ejecuta el script de Python
});

// Para pruebas: configuración de la tarea cron para que se ejecute cada minuto
// cron.schedule("* * * * *", () => {
//   runPythonScript(); // Llama a la función que ejecuta el script de Python
// });
