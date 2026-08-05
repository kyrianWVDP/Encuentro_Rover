### Task 1: Scaffold Vite + Vitest

**Files:**
- Create: proyecto en raíz `Encuentro_Rover/` (o subcarpeta `app/` si se prefiere no mezclar docs — **usar raíz del repo** y dejar `docs/` intacto)
- Create: `vite.config.ts`, `tsconfig.json`, `src/main.tsx`, `index.html`, `package.json`
- Test: configuración Vitest en `vite.config.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `npm run dev`, `npm test` funcionando

- [ ] **Step 1: Crear app Vite React-TS**

```bash
cd "c:\Users\kyrian\Documents\06-Scout\Scout\Encuentro_Rover"
npm create vite@latest . -- --template react-ts
```

Si Vite se niega porque el directorio no está vacío, crear en `app/`:

```bash
npm create vite@latest app -- --template react-ts
cd app
```

En ese caso, **todas las rutas `src/` de este plan** viven bajo `app/src/`.

- [ ] **Step 2: Instalar deps de test**

```bash
npm install
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 3: Configurar Vitest en `vite.config.ts`**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

Agregar en `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 4: Verificar**

```bash
npm test
npm run build
```

Expected: tests vacíos OK o “no tests”; build OK.

- [ ] **Step 5: Commit (solo si el usuario lo pidió)**

```bash
git add package.json package-lock.json vite.config.ts tsconfig*.json index.html src
git commit -m "chore: scaffold Vite React TypeScript with Vitest"
```

---

