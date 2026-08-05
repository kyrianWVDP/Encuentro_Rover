### Task 5: `RouletteWheel` UI

**Files:**
- Create: `src/ui/RouletteWheel.tsx`
- Create: `src/ui/RouletteWheel.css`
- Create: `src/assets/ruleta-fondo.png` (copiar imagen del Encuentro; si falta, placeholder CSS)

**Interfaces:**
- Consumes: `CLANS`, `playedClanIds`, `rotationDeg`, `spinning`, `selectedClanId`
- Produces: presentational component

Props:

```ts
type RouletteWheelProps = {
  playedClanIds: string[];
  rotationDeg: number;
  spinning: boolean;
  selectedClanId: string | null;
  durationMs?: number;
};
```

- [ ] **Step 1: Copiar arte**

Buscar la imagen WhatsApp del encuentro y copiarla a `src/assets/ruleta-fondo.png`. Si no está, usar fondo sólido `#4a4a4a` en CSS.

- [ ] **Step 2: Implementar rueda**

- Contenedor relativo con pointer absoluto arriba al centro
- Capa que rota: `transform: rotate(${rotationDeg}deg)`; `transition` solo cuando `spinning` o al aterrizar (`transition: transform ${durationMs}ms cubic-bezier(0.12, 0.8, 0.2, 1)`)
- 8 labels posicionadas con `rotate(i*45deg) translateY(-radius)` + counter-rotate del texto para legibilidad **o** texto radial simple
- `opacity: 0.35` si `playedClanIds.includes(id)`
- Highlight borde si `id === selectedClanId` y no spinning

- [ ] **Step 3: Smoke visual**

```bash
npm run dev
```

Montar temporalmente en `App` con props fijas; verificar 8 nombres y dimmed.

- [ ] **Step 4: Commit (si aplica)**

```bash
git add src/ui src/assets
git commit -m "feat: add roulette wheel UI with clan labels"
```

---

