### Task 4: Router + shell

**Files:**
- Modify: `package.json` — add `react-router-dom`
- Modify: `src/main.tsx` / `src/App.tsx`
- Create stub screens if needed

- [ ] `npm install react-router-dom`
- [ ] App:

```tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PublicScreen } from "./ui/PublicScreen";
import { HostScreen } from "./ui/HostScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicScreen />} />
        <Route path="/host" element={<HostScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

- [ ] Temporary stubs that render “Público” / “Host” until Tasks 5–6
- [ ] `npm run build` PASS
- [ ] Commit (si aplica): `feat: add public and host routes`

---

