# Cronómetro de Debate Académico - ADUMA

Este proyecto es una aplicación web que proporciona un cronómetro para debates académicos. Permite crear, gestionar y controlar múltiples temporizadores, cada uno con características personalizables, como título, tiempo, avisos y faltas.

## Estructura del Proyecto

El proyecto consta de tres archivos principales:

1. **index.html**: Define la estructura básica de la página web.
2. **styles.css**: Contiene los estilos CSS para la interfaz de usuario.
3. **cronometer.js**: Maneja la lógica y funcionalidad de la aplicación.

## Funcionalidades Principales

- **Temporizadores Predefinidos**: Al cargar la página, se crean temporizadores basados en una lista de intervenciones predefinidas.
- **Añadir Temporizadores**: Los usuarios pueden añadir nuevos temporizadores personalizados mediante un formulario desplegable.
- **Iniciar/Pausar Temporizadores**: Cada temporizador tiene un botón para iniciar o pausar el conteo del tiempo.
- **Reiniciar Temporizadores**: Posibilidad de reiniciar temporizadores individualmente o todos a la vez.
- **Editar Título y Tiempo**: Los usuarios pueden modificar el título y el tiempo de cada temporizador.
- **Avisos y Faltas**: Cada temporizador permite marcar hasta 2 avisos, 2 faltas leves y 2 faltas graves.
- **Eliminar Temporizadores**: Los temporizadores pueden ser eliminados individualmente.

## Cómo Funciona el Código

### index.html

- Estructura la página con un contenedor principal.
- Incluye un botón para mostrar/ocultar el formulario de creación de temporizadores.
- Contiene el contenedor donde se generarán los temporizadores dinámicamente.
- Incluye el botón para reiniciar todos los temporizadores.

### styles.css

- Aplica estilos globales y establece `box-sizing: border-box`.
- Estiliza el formulario, botones, temporizadores y elementos interactivos.
- Utiliza flexbox y transiciones para mejorar la experiencia del usuario.

### cronometer.js

#### Lista de Intervenciones Predefinidas

Define los temporizadores iniciales:

```js
const interventions = [
  { name: "Introducción A Favor", time: 4 * 60 * 100, group: "A Favor" },
  { name: "Introducción En Contra", time: 4 * 60 * 100, group: "En Contra" },
  { name: "Refutación A Favor", time: 5 * 60 * 100, group: "A Favor" },
  { name: "Refutación En Contra", time: 5 * 60 * 100, group: "En Contra" },
  { name: "Contra Refutación A Favor", time: 5 * 60 * 100, group: "A Favor" },
  { name: "Contra Refutación En Contra", time: 5 * 60 * 100, group: "En Contra" },
  { name: "Conclusión En Contra", time: 3 * 60 * 100, group: "En Contra" },
  { name: "Conclusión A Favor", time: 3 * 60 * 100, group: "A Favor" },
];
```

#### Función `createTimer`

Esta función crea y configura cada temporizador individualmente.

**Pasos Principales:**

1. **Crear Elementos HTML**: Construye la estructura del temporizador, incluyendo título, display de tiempo, botones y secciones de opciones.

2. **Inicializar Estado del Temporizador**: Crea un objeto `timer` que almacena el estado actual, como el tiempo total y restante.

3. **Definir Funciones Internas**:

   - `updateDisplay()`: Actualiza la visualización del tiempo.
   - `tick()`: Disminuye el tiempo restante y actualiza la pantalla.

4. **Asignar Eventos**:
   - **Iniciar/Pausar**: Controla el inicio y pausa del temporizador con un solo botón que alterna su estado.
   - **Reiniciar**: Restablece el temporizador al tiempo inicial.
   - **Establecer Nuevo Tiempo**: Permite cambiar el tiempo total del temporizador.
   - **Editar Título**: Actualiza el nombre del temporizador.
   - **Eliminar**: Remueve el temporizador de la interfaz y detiene su ejecución.
   - **Mostrar/Ocultar Opciones**: Controla la visibilidad de las opciones adicionales.

**Código de la Función:**

<details>
<summary>Abrir código</summary>

```js
function createTimer(intervention) {
  const timerDiv = document.createElement("div");
  timerDiv.className = "timer";

// Encabezado del temporizador
const timerHeader = document.createElement("div");
timerHeader.className = "timer-header";

// Campo editable para el título
const titleInput = document.createElement("input");
titleInput.type = "text";
titleInput.value = intervention.name;
titleInput.className = "timer-title";

timerHeader.appendChild(titleInput);
timerDiv.appendChild(timerHeader);

// Contenido del temporizador
const timerContent = document.createElement("div");
timerContent.className = "timer-content";

// Mostrar el grupo si existe
if (intervention.group) {
const groupLabel = document.createElement("div");
groupLabel.className = "timer-group";
groupLabel.textContent = "Grupo: " + intervention.group;
timerContent.appendChild(groupLabel);
}

// Display del tiempo
const timeDisplay = document.createElement("div");
timeDisplay.className = "time-display";
timeDisplay.textContent = formatTime(intervention.time);
timerContent.appendChild(timeDisplay);

// Botón de iniciar/pausar
const startPauseButton = document.createElement("button");
startPauseButton.textContent = "Iniciar";
startPauseButton.className = "btn btn-primary start-pause-button";
timerContent.appendChild(startPauseButton);

// Sección desplegable para opciones
const collapsibleContent = document.createElement("div");
collapsibleContent.className = "collapsible-content collapsed";

// Controles para modificar el tiempo
const timeControls = document.createElement("div");
timeControls.className = "time-controls";

const timeInput = document.createElement("input");
timeInput.type = "number";
timeInput.value = intervention.time / 100;
timeInput.min = 0;
timeInput.style.width = "80px";
timeControls.appendChild(timeInput);

const setTimeButton = document.createElement("button");
setTimeButton.textContent = "Establecer Tiempo";
setTimeButton.className = "btn btn-secondary";
timeControls.appendChild(setTimeButton);

collapsibleContent.appendChild(timeControls);

// Botón de reinicio
const controlsDiv = document.createElement("div");
controlsDiv.className = "controls";

const resetButton = document.createElement("button");
resetButton.textContent = "Reiniciar";
resetButton.className = "btn btn-secondary";
controlsDiv.appendChild(resetButton);

collapsibleContent.appendChild(controlsDiv);

// Sección de avisos y faltas
const checkboxSection = document.createElement("div");
checkboxSection.className = "checkbox-section";

// Función para crear grupos de checkboxes
function createCheckboxGroup(labelText, maxCount) {
const groupDiv = document.createElement("div");
groupDiv.className = "checkbox-group";

    const groupLabel = document.createElement("span");
    groupLabel.textContent = labelText + ": ";
    groupDiv.appendChild(groupLabel);

    for (let i = 0; i < maxCount; i++) {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      groupDiv.appendChild(checkbox);
    }

    return groupDiv;

}

checkboxSection.appendChild(createCheckboxGroup("Avisos", 2));
checkboxSection.appendChild(createCheckboxGroup("Falta Leve", 2));
checkboxSection.appendChild(createCheckboxGroup("Falta Grave", 2));

collapsibleContent.appendChild(checkboxSection);

timerContent.appendChild(collapsibleContent);

// Botón para mostrar/ocultar opciones
const toggleContentButton = document.createElement("button");
toggleContentButton.textContent = "Mostrar/Ocultar Opciones";
toggleContentButton.className = "toggle-content-button";

timerContent.appendChild(toggleContentButton);

timerDiv.appendChild(timerContent);

// Botón de eliminar
const deleteButton = document.createElement("button");
deleteButton.className = "delete-button";
timerDiv.appendChild(deleteButton);

container.appendChild(timerDiv);

// Estado del temporizador
const timer = {
totalTime: intervention.time,
remainingTime: intervention.time,
intervalId: null,
isRunning: false,
timeDisplay: timeDisplay,
};

// Funciones internas
function updateDisplay() {
timer.timeDisplay.textContent = formatTime(timer.remainingTime);
if (timer.remainingTime < 0) {
timer.timeDisplay.classList.add("negative");
} else {
timer.timeDisplay.classList.remove("negative");
}
}

function tick() {
timer.remainingTime--;
updateDisplay();
}

// Eventos
startPauseButton.addEventListener("click", () => {
if (!timer.isRunning) {
timer.intervalId = setInterval(tick, 10);
timer.isRunning = true;
startPauseButton.textContent = "Pausar";
startPauseButton.classList.replace("btn-primary", "btn-secondary");
} else {
clearInterval(timer.intervalId);
timer.isRunning = false;
startPauseButton.textContent = "Iniciar";
startPauseButton.classList.replace("btn-secondary", "btn-primary");
}
});

resetButton.addEventListener("click", () => {
if (timer.isRunning) {
clearInterval(timer.intervalId);
timer.isRunning = false;
startPauseButton.textContent = "Iniciar";
startPauseButton.classList.replace("btn-secondary", "btn-primary");
}
timer.remainingTime = timer.totalTime;
updateDisplay();
});

setTimeButton.addEventListener("click", () => {
const newTime = parseFloat(timeInput.value);
if (!isNaN(newTime) && newTime >= 0) {
timer.totalTime = newTime \* 100;
timer.remainingTime = timer.totalTime;
updateDisplay();
}
});

titleInput.addEventListener("change", () => {
intervention.name = titleInput.value;
});

deleteButton.addEventListener("click", () => {
if (timer.isRunning) {
clearInterval(timer.intervalId);
}
container.removeChild(timerDiv);
timers.splice(timers.indexOf(timer), 1);
});

toggleContentButton.addEventListener("click", () => {
collapsibleContent.classList.toggle("collapsed");
});

timers.push(timer);
}

```

</details>

#### Formateo del Tiempo

<details>
<summary>La función `formatTime` convierte el tiempo en centésimas de segundo a un formato `mm:ss:cc`.</summary>

```

function formatTime(centiseconds) {
const absCentiseconds = Math.abs(centiseconds);
const totalSeconds = Math.floor(absCentiseconds / 100);
const cs = absCentiseconds % 100;
const m = Math.floor(totalSeconds / 60);
const s = totalSeconds % 60;
return (
(centiseconds < 0 ? "-" : "") +
(m < 10 ? "0" : "") + m +
":" +
(s < 10 ? "0" : "") + s +
":" +
(cs < 10 ? "0" : "") + cs
);
}

```

</details>

## Cómo Utilizar el Proyecto

1. **Descargar los Archivos**: Asegúrate de tener `index.html`, `styles.css` y `cronometer.js` en el mismo directorio.

2. **Abrir el Archivo HTML**: Abre `index.html` en un navegador web moderno.

3. **Interacción con la Aplicación**:
   - Los temporizadores predefinidos aparecerán automáticamente.
   - Usa el botón "Añadir Nuevo Temporizador" para crear temporizadores personalizados.
   - Controla cada temporizador con los botones de iniciar/pausar y reiniciar.
   - Marca avisos y faltas según sea necesario.
   - Edita el título y el tiempo de los temporizadores a través de las opciones desplegables.
   - Elimina temporizadores con el botón de la papelera.

## Notas

- **Precisión del Temporizador**: La precisión llega hasta la centésima de segundo.

- **Compatibilidad**: Asegúrate de utilizar navegadores modernos para una mejor compatibilidad y rendimiento.

- **Estilos y Personalización**: Puedes ajustar los estilos en `styles.css` para personalizar la apariencia según tus preferencias.

---

Created By [Jarko]()
