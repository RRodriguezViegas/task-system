# Task System

App de gestión de tareas y subtasks con React (Vite) en el frontend y Node + Express + SQLite en el backend. Incluye filtros, ordenamiento, paginación, diseño responsivo, código formateado con Prettier y tests unitarios.

---

## 🔹 Estructura del proyecto
project-root/ <br>
├─ frontend/  <br>
├─ backend/  <br>
├─ README.md <br>

---

## 🔹 Requisitos

- Node.js >= 16
- npm o yarn

---

## 🔹 Backend

1. Entrar a la carpeta backend:

```bash
cd backend
```

2.	Instalar dependencias:
```bash
npm install
```

3.	Ejecutar el servidor:
```bash
npm run dev
```

El servidor corre por defecto en http://localhost:3000  
Endpoints principales:  
  GET /tasks → Listar tareas padre  
  GET /tasks/:id → Obtener tarea por ID (incluye subtasks)  
  POST /tasks → Crear tarea  
  PATCH /tasks/:id → Actualizar tarea  
  DELETE /tasks/:id → Borrar tarea  


## 🔹 Frontend

1. Entrar a la carpeta frontend:

```bash
cd frontend
```

2.	Instalar dependencias:
```bash
npm install
```

3.	Ejecutar la app:
```bash
npm run dev
```

Abre http://localhost:5173 en tu navegador web  
Ahí se verá la interfaz para ver, editar y crear tareas

## 🔹 Testing

### Tests unitarios cubren business logic:  

Validación de título obligatorio en creación y actualización  
Ordenamiento y filtrado de tareas  
Funciones de update  

 Desde el backend ejecutar

 ```bash
npm test
```
