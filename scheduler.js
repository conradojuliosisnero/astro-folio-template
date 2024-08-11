const cron = require("node-cron");
const { exec } = require("child_process");

// Programa la tarea para que se ejecute todos los días a las 9:00 AM
cron.schedule("0 9 * * *", () => {
  console.log("Ejecutando tarea diaria de publicación de post...");
  exec(
    "python3 /ruta/a/tu/proyecto/automate_blog.py",
    (err, stdout, stderr) => {
      if (err) {
        console.error(`Error ejecutando el script de Python: ${stderr}`);
        return;
      }
      console.log(stdout);
    }
  );
});
