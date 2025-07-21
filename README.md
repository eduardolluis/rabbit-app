# 🛍️ RABBIT — E-commerce Web App

Bienvenido a **Rabbit**, una tienda en línea moderna construida con **Next.js 14**, **TypeScript**, y un diseño limpio centrado en la experiencia del usuario.

Este proyecto simula una tienda de ropa donde puedes explorar productos, ver detalles individuales, aplicar filtros por género o categoría y mucho más. Ideal para practicar desarrollo fullstack con una arquitectura escalable.

---

## 🚀 Tecnologías Usadas

- **TypeScript & Javascript** — Tipado estático para mayor seguridad
- **Next.js 15** — App Router, SSR y CSR combinados
- **Redux Toolkit** — Manejo global de estado para productos
- **Tailwind CSS** — Estilos rápidos y responsivos
- **Axios** — Llamadas HTTP al backend
- **Sonner** — Notificaciones suaves y modernas
- **Sanity (opcional)** — CMS para manejar productos dinámicos
- **Node.js + Express** (en `/backend`) — API simulada

---

## 📂 Estructura del Proyecto

📦 rabbit/
┣ 🗂️ backend/ → Express + MongoDB (o mock) para API REST
┣ 🗂️ frontend/
┃ ┣ 🗂️ app/ → App Router de Next.js
┃ ┣ 🗂️ components/ → Componentes reutilizables
┃ ┣ 🗂️ lib/ → Hooks, slices y tipos
┃ ┣ 🗂️ public/ → Assets públicos
┃ ┗ 🗂️ pages/ → Rutas legacy o estáticas
┣ 📄 package.json
┣ 📄 .env.local
┗ 📄 README.md


---

## 🧪 Funcionalidades Actuales

- [x] Página de inicio con hero y colecciones destacadas
- [x] Render dinámico de productos desde mock API
- [x] Sección de "Best Seller" dinámica
- [x] Vista de detalles del producto con imágenes, tallas y colores
- [x] Grid de productos filtrados por género y categoría
- [x] Lógica de carrito
- [x] Notificaciones personalizadas con `sonner`

---

## 🛠️ Instalación Local

```bash
# Clona el repositorio
git clone https://github.com/eduardolluis/rabbit-app
cd rabbit

# Instala dependencias
npm install

# Ejecuta en modo desarrollo
npm run dev

Crea un archivo .env.local en la raíz del proyecto con esta variable de entorno (si usas backend real):

NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

📦 Backend (opcional)

Si estás usando el backend incluido en /backend, ejecuta:

cd backend
npm install
npm run dev





📃 Licencia

Este proyecto es solo para fines educativos y personales.


