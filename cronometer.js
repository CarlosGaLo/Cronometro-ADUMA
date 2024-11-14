// Datos iniciales de las intervenciones
const interventions = [
  { name: "Introducción A Favor", time: 4 * 60 * 100, group: "A Favor" },
  { name: "Introducción En Contra", time: 4 * 60 * 100, group: "En Contra" },
  { name: "Refutación A Favor", time: 5 * 60 * 100, group: "A Favor" },
  { name: "Refutación En Contra", time: 5 * 60 * 100, group: "En Contra" },
  { name: "Contra Refutación A Favor", time: 5 * 60 * 100, group: "A Favor" },
  {
    name: "Contra Refutación En Contra",
    time: 5 * 60 * 100,
    group: "En Contra",
  },
  { name: "Conclusión En Contra", time: 3 * 60 * 100, group: "En Contra" },
  { name: "Conclusión A Favor", time: 3 * 60 * 100, group: "A Favor" },
];

// Array para almacenar los temporizadores
const timers = [];

// Función para formatear el tiempo en mm:ss:cc
function formatTime(centiseconds) {
  const absCentiseconds = Math.abs(centiseconds);
  const totalSeconds = Math.floor(absCentiseconds / 100);
  const cs = absCentiseconds % 100;
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return (
    (centiseconds < 0 ? "-" : "") +
    (m < 10 ? "0" + m : m) +
    ":" +
    (s < 10 ? "0" + s : s) +
    ":" +
    (cs < 10 ? "0" + cs : cs)
  );
}

// Generar los temporizadores existentes
const container = document.getElementById("timers-container");

// Botón para mostrar/ocultar el formulario
const toggleFormButton = document.getElementById("toggle-form-button");
const addTimerFormContainer = document.getElementById(
  "add-timer-form-container"
);

toggleFormButton.addEventListener("click", () => {
  addTimerFormContainer.classList.toggle("collapsed");
});

// Función para crear un temporizador
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

  // Mostrar el grupo si es necesario
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

  // Botón de iniciar/pausar ubicado debajo del tiempo
  const startPauseButton = document.createElement("button");
  startPauseButton.textContent = "Iniciar";
  startPauseButton.className = "btn btn-primary start-pause-button";
  timerContent.appendChild(startPauseButton);

  // Sección desplegable para controles y checkboxes
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

  // Controles adicionales
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

  // Función para crear un grupo de checkboxes
  function createCheckboxGroup(labelText, maxCount) {
    const groupDiv = document.createElement("div");
    groupDiv.className = "checkbox-group";

    const groupLabel = document.createElement("span");
    groupLabel.textContent = labelText + ": ";
    groupDiv.appendChild(groupLabel);

    for (let i = 0; i < maxCount; i++) {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `${labelText}-${i}-${Date.now()}`;
      groupDiv.appendChild(checkbox);
    }

    return groupDiv;
  }

  checkboxSection.appendChild(createCheckboxGroup("Avisos", 2));
  checkboxSection.appendChild(createCheckboxGroup("Falta Leve", 2));
  checkboxSection.appendChild(createCheckboxGroup("Falta Grave", 2));

  collapsibleContent.appendChild(checkboxSection);

  timerContent.appendChild(collapsibleContent);

  // Botón para mostrar/ocultar el contenido desplegable
  const toggleContentButton = document.createElement("button");
  toggleContentButton.textContent = "Mostrar/Ocultar Opciones";
  toggleContentButton.className = "toggle-content-button";

  timerContent.appendChild(toggleContentButton);

  timerDiv.appendChild(timerContent);

  // Botón de eliminar en la parte inferior derecha
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

  // Funciones para controlar el temporizador
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

  // Evento para iniciar/pausar el temporizador
  startPauseButton.addEventListener("click", () => {
    if (!timer.isRunning) {
      timer.intervalId = setInterval(tick, 10);
      timer.isRunning = true;
      startPauseButton.textContent = "Pausar";
      startPauseButton.classList.remove("btn-primary");
      startPauseButton.classList.add("btn-secondary");
    } else {
      clearInterval(timer.intervalId);
      timer.isRunning = false;
      startPauseButton.textContent = "Iniciar";
      startPauseButton.classList.remove("btn-secondary");
      startPauseButton.classList.add("btn-primary");
    }
  });

  resetButton.addEventListener("click", () => {
    if (timer.isRunning) {
      clearInterval(timer.intervalId);
      timer.isRunning = false;
      startPauseButton.textContent = "Iniciar";
      startPauseButton.classList.remove("btn-secondary");
      startPauseButton.classList.add("btn-primary");
    }
    timer.remainingTime = timer.totalTime;
    updateDisplay();
  });

  // Evento para establecer un nuevo tiempo
  setTimeButton.addEventListener("click", () => {
    const newTime = parseFloat(timeInput.value);
    if (!isNaN(newTime) && newTime >= 0) {
      timer.totalTime = newTime * 100;
      timer.remainingTime = timer.totalTime;
      updateDisplay();
    }
  });

  // Evento para actualizar el título
  titleInput.addEventListener("change", () => {
    intervention.name = titleInput.value;
  });

  // Evento para eliminar el temporizador
  deleteButton.addEventListener("click", () => {
    if (timer.isRunning) {
      clearInterval(timer.intervalId);
    }
    container.removeChild(timerDiv);
    timers.splice(timers.indexOf(timer), 1);
  });

  // Evento para mostrar/ocultar el contenido desplegable
  toggleContentButton.addEventListener("click", () => {
    collapsibleContent.classList.toggle("collapsed");
  });

  timers.push(timer);
}

// Crear los temporizadores iniciales
interventions.forEach(createTimer);

// Evento para añadir un nuevo temporizador
const addTimerForm = document.getElementById("add-timer-form");
addTimerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("new-timer-title").value;
  const timeInSeconds = parseFloat(
    document.getElementById("new-timer-time").value
  );
  const group = document.getElementById("new-timer-group").value;

  if (title && !isNaN(timeInSeconds) && timeInSeconds > 0) {
    const newIntervention = {
      name: title,
      time: timeInSeconds * 100, // Convertimos a centésimas de segundo
      group: group || undefined,
    };
    createTimer(newIntervention);
    // Limpiar el formulario
    addTimerForm.reset();
  }
});

// Botón para reiniciar todos los temporizadores
const resetAllButton = document.getElementById("reset-all");
resetAllButton.addEventListener("click", () => {
  timers.forEach((timer) => {
    if (timer.isRunning) {
      clearInterval(timer.intervalId);
      timer.isRunning = false;
      // Actualizar el botón a "Iniciar"
      const startPauseButton =
        timer.timeDisplay.parentElement.parentElement.querySelector(
          ".start-pause-button"
        );
      startPauseButton.textContent = "Iniciar";
      startPauseButton.classList.remove("btn-secondary");
      startPauseButton.classList.add("btn-primary");
    }
    timer.remainingTime = timer.totalTime;
    timer.timeDisplay.classList.remove("negative");
    timer.timeDisplay.textContent = formatTime(timer.remainingTime);
  });
});
