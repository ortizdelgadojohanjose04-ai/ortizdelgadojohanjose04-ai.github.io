function actualizarFechaHora() {
    const ahora = new Date();
    const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };
    const fechaStr = ahora.toLocaleDateString('es-ES', opcionesFecha);
    const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: true };
    const horaStr = ahora.toLocaleTimeString('es-ES', opcionesHora);
    document.getElementById('fecha-actual').textContent = `📅 ${fechaStr}`;
    document.getElementById('hora-actual').textContent = `⏰ ${horaStr}`;
    document.getElementById('ultima-actualizacion').textContent = `${fechaStr} - ${horaStr}`;
}

setInterval(actualizarFechaHora, 1000);
actualizarFechaHora();

const inputUni = document.getElementById('input-uni');
const btnUni = document.getElementById('btn-uni');
const listaUni = document.getElementById('lista-uni');

document.addEventListener('DOMContentLoaded', cargarTareas);

btnUni.addEventListener('click', function() {
    const texto = inputUni.value.trim();
    if (texto === '') {
        alert('Escribe el nombre del proyecto.');
        return;
    }
    agregarTarea(texto, 'uni');
    inputUni.value = '';
    inputUni.focus();
});

inputUni.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        btnUni.click();
    }
});

const inputDev = document.getElementById('input-dev');
const btnDev = document.getElementById('btn-dev');
const listaDev = document.getElementById('lista-dev');

btnDev.addEventListener('click', function() {
    const texto = inputDev.value.trim();
    if (texto === '') {
        alert('Escribe el nombre del proyecto.');
        return;
    }
    agregarTarea(texto, 'dev');
    inputDev.value = '';
    inputDev.focus();
});

inputDev.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        btnDev.click();
    }
});

function agregarTarea(texto, tipo) {
    const lista = (tipo === 'uni') ? listaUni : listaDev;
    const li = document.createElement('li');
    li.textContent = `📌 ${texto}`;
    const estado = document.createElement('span');
    estado.className = 'estado';
    estado.textContent = '⏳ Pendiente';
    li.addEventListener('click', function() {
        if (estado.textContent === '⏳ Pendiente') {
            estado.textContent = '✅ Completado';
            estado.className = 'estado completado';
        } else {
            estado.textContent = '⏳ Pendiente';
            estado.className = 'estado';
        }
        guardarTareas();
    });
    li.appendChild(estado);
    lista.appendChild(li);
    const ejemplo = lista.querySelector('.tarea-ejemplo');
    if (ejemplo) {
        ejemplo.remove();
    }
    guardarTareas();
}

function guardarTareas() {
    const tareasUni = [];
    const tareasDev = [];
    document.querySelectorAll('#lista-uni li:not(.tarea-ejemplo)').forEach(li => {
        const texto = li.textContent.replace('✅ Completado', '').replace('⏳ Pendiente', '').trim();
        const completado = li.querySelector('.estado').textContent === '✅ Completado';
        tareasUni.push({ texto, completado });
    });
    document.querySelectorAll('#lista-dev li:not(.tarea-ejemplo)').forEach(li => {
        const texto = li.textContent.replace('✅ Completado', '').replace('⏳ Pendiente', '').trim();
        const completado = li.querySelector('.estado').textContent === '✅ Completado';
        tareasDev.push({ texto, completado });
    });
    localStorage.setItem('tareasUni', JSON.stringify(tareasUni));
    localStorage.setItem('tareasDev', JSON.stringify(tareasDev));
}

function cargarTareas() {
    const tareasUni = JSON.parse(localStorage.getItem('tareasUni')) || [];
    const tareasDev = JSON.parse(localStorage.getItem('tareasDev')) || [];
    tareasUni.forEach(t => {
        const li = document.createElement('li');
        li.textContent = `📌 ${t.texto}`;
        const estado = document.createElement('span');
        estado.className = 'estado';
        estado.textContent = t.completado ? '✅ Completado' : '⏳ Pendiente';
        if (t.completado) estado.className += ' completado';
        li.addEventListener('click', function() {
            if (estado.textContent === '⏳ Pendiente') {
                estado.textContent = '✅ Completado';
                estado.className = 'estado completado';
            } else {
                estado.textContent = '⏳ Pendiente';
                estado.className = 'estado';
            }
            guardarTareas();
        });
        li.appendChild(estado);
        document.getElementById('lista-uni').appendChild(li);
    });
    tareasDev.forEach(t => {
        const li = document.createElement('li');
        li.textContent = `📌 ${t.texto}`;
        const estado = document.createElement('span');
        estado.className = 'estado';
        estado.textContent = t.completado ? '✅ Completado' : '⏳ Pendiente';
        if (t.completado) estado.className += ' completado';
        li.addEventListener('click', function() {
            if (estado.textContent === '⏳ Pendiente') {
                estado.textContent = '✅ Completado';
                estado.className = 'estado completado';
            } else {
                estado.textContent = '⏳ Pendiente';
                estado.className = 'estado';
            }
            guardarTareas();
        });
        li.appendChild(estado);
        document.getElementById('lista-dev').appendChild(li);
    });
}

let rachas = {
    gym: parseInt(localStorage.getItem('rachaGym')) || 0,
    estudio: parseInt(localStorage.getItem('rachaEstudio')) || 0,
    dev: parseInt(localStorage.getItem('rachaDev')) || 0
};

let ultimaFecha = {
    gym: localStorage.getItem('ultimaFechaGym') || null,
    estudio: localStorage.getItem('ultimaFechaEstudio') || null,
    dev: localStorage.getItem('ultimaFechaDev') || null
};

let marcadoHoy = {
    gym: localStorage.getItem('marcadoHoyGym') === 'true',
    estudio: localStorage.getItem('marcadoHoyEstudio') === 'true',
    dev: localStorage.getItem('marcadoHoyDev') === 'true'
};

function actualizarContadores() {
    document.getElementById('racha-gym').textContent = `${rachas.gym} días`;
    document.getElementById('racha-estudio').textContent = `${rachas.estudio} días`;
    document.getElementById('racha-dev').textContent = `${rachas.dev} días`;
}

function actualizarBotones() {
    document.querySelectorAll('.btn-racha').forEach(btn => {
        const habito = btn.dataset.habito;
        if (marcadoHoy[habito]) {
            btn.textContent = '✅ Ya cumplido hoy';
            btn.style.background = '#30363d';
            btn.style.cursor = 'not-allowed';
            btn.disabled = true;
        } else {
            btn.textContent = '✅ Cumplido';
            btn.style.background = '#238636';
            btn.style.cursor = 'pointer';
            btn.disabled = false;
        }
    });
}

function reiniciarRacha(habito) {
    rachas[habito] = 0;
    ultimaFecha[habito] = null;
    marcadoHoy[habito] = false;
    localStorage.setItem(`racha${capitalize(habito)}`, '0');
    localStorage.setItem(`ultimaFecha${capitalize(habito)}`, '');
    localStorage.setItem(`marcadoHoy${capitalize(habito)}`, 'false');
    actualizarContadores();
    actualizarBotones();
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

document.querySelectorAll('.btn-racha').forEach(btn => {
    btn.addEventListener('click', function() {
        const habito = this.dataset.habito;
        const hoy = new Date().toDateString();
        if (marcadoHoy[habito]) {
            alert(`Ya marcaste "${habito}" hoy. ¡Vuelve mañana!`);
            return;
        }
        if (ultimaFecha[habito] === null) {
            rachas[habito] = 1;
        } else {
            const fechaUltima = new Date(ultimaFecha[habito]);
            const fechaHoy = new Date(hoy);
            const diferencia = (fechaHoy - fechaUltima) / (1000 * 60 * 60 * 24);
            if (diferencia === 1) {
                rachas[habito] += 1;
            } else if (diferencia > 1) {
                rachas[habito] = 1;
            }
        }
        ultimaFecha[habito] = hoy;
        marcadoHoy[habito] = true;
        localStorage.setItem(`ultimaFecha${capitalize(habito)}`, hoy);
        localStorage.setItem(`racha${capitalize(habito)}`, String(rachas[habito]));
        localStorage.setItem(`marcadoHoy${capitalize(habito)}`, 'true');
        actualizarContadores();
        actualizarBotones();
    });
});

actualizarContadores();
actualizarBotones();

function verificarRachas() {
    const hoy = new Date().toDateString();
    ['gym', 'estudio', 'dev'].forEach(habito => {
        if (ultimaFecha[habito] !== hoy) {
            marcadoHoy[habito] = false;
            localStorage.setItem(`marcadoHoy${capitalize(habito)}`, 'false');
        }
        if (ultimaFecha[habito] && ultimaFecha[habito] !== hoy) {
            const fechaUltima = new Date(ultimaFecha[habito]);
            const fechaHoy = new Date(hoy);
            const diferencia = (fechaHoy - fechaUltima) / (1000 * 60 * 60 * 24);
            if (diferencia > 1) {
                reiniciarRacha(habito);
            }
        }
    });
    actualizarBotones();
}

verificarRachas();

console.log('%c🚀 ADMINISTRADOR DIARIO DE JOHAN ORTIZ', 'font-size: 20px; font-weight: bold; color: #58a6ff;');
console.log('%c💪 Disciplina + Código = Éxito', 'font-size: 14px; color: #f0f6fc;');
