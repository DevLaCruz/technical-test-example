# Prueba técnica Fullstack — Sistema de Tickets

## Descripción General

Desarrollar una aplicación web para la venta de entradas (tickets) a un evento. Los usuarios deben registrarse, iniciar sesión, comprar tickets y visualizar sus tickets. El sistema debe incluir un panel de administración.

---

## Stack Tecnológico

- **Frontend**: Vue 3 (Composition API) + Tailwind CSS
- **Backend**: Node.js con Express
- **Base de Datos**: MongoDB
- **Tiempo estimado**: 6 horas

---

## Requisitos Funcionales

### 1. Landing Page

La página principal debe mostrar la cantidad de tickets disponibles actualizada al cargar la página. No se requiere actualización en tiempo real.

El precio actual del ticket debe mostrarse en la misma página. El precio que ve el usuario debe ser exactamente el que se le cobra al comprar.

### 2. Registro e Inicio de Sesión

El registro solicita: DNI, correo electrónico, nombre, apellido y contraseña.

El DNI se ingresa como texto en un campo de formulario. Debe almacenarse exactamente como el usuario lo escribe.

El usuario inicia sesión con correo y contraseña. Las rutas protegidas redirigen al login si no hay sesión activa.

### 3. Compra de Tickets

Cada ticket tiene un precio dinámico. El precio aumenta a medida que se venden más tickets.

**Fórmula de precio**:

- Precio base: configurable
- Incremento por ticket vendido: configurable
- `precio = precio_base + (tickets_vendidos × incremento)`

Cuando un usuario compra un ticket se debe descontar del stock disponible. No se puede vender más tickets de los disponibles.

Las ganancias registradas deben ser exactas. No debe haber diferencias por redondeo o por errores de precisión al sumar los precios.

### 4. Página del Ticket

Cada ticket tiene una página en `/ticket/:ticketId`.

Condiciones:

- Solo el usuario dueño del ticket puede acceder
- Muestra: código único, evento, fecha de compra, precio pagado, nombre y DNI del comprador
- Si alguien no autorizado intenta acceder debe recibir un error
- La restricción aplica tanto en la interfaz como en los datos que viajan por red

La página debe funcionar correctamente incluso si el usuario ya estaba en otra página de ticket y navega hacia esta.

### 5. Dashboard de Administración

El panel `/admin` solo accesible por usuarios administradores.

Funcionalidades:

- Ver tickets vendidos y ganancias. Los números deben coincidir entre sí sin importar el orden en que se consulten
- Ver listado de ventas: comprador, ticketId, precio pagado, hora de compra
- Configurar: aforo total, precio base, incremento

### 6. Búsqueda de Usuarios

Permite buscar usuarios por nombre o DNI con coincidencia parcial.

Condiciones:

- Busca tanto por nombre como por DNI
- La búsqueda debe funcionar correctamente aunque el DNI contenga caracteres especiales o comience con cero
- Debe ser rápida incluso con muchos usuarios registrados

### 7. Paginación

Todas las listas (tickets, ventas, usuarios) deben estar paginadas.

---

## API

- **Autenticación**: registro, inicio de sesión, sesión actual
- **Tickets**: comprar, listar mis tickets, ver detalle
- **Usuarios**: búsqueda por nombre o DNI
- **Administración**: estadísticas de ventas, configuración (aforo, precios)

---

## Entidades

- **Usuario**: DNI, email, nombre, apellido, contraseña, rol
- **Ticket**: código único, comprador, precio pagado, fecha de compra
- **Configuración**: aforo total, precio base, incremento por ticket vendido

---

Si no te alcanza el tiempo, igual puedes enviar lo que tengas. La evaluación se centra en la calidad del código más que en la cantidad de funcionalidades completadas.

- No se requiere diseño complejo, pero debe ser funcional y responsivo
- Puedes usar librerías adicionales
- El uso de IA está permitido, pero debes entender el código que entregues
- Sube a un repositorio GitHub público
- Incluye `.env.example`
