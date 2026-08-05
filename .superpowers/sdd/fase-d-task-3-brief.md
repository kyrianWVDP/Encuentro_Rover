### Task 3: ClanAvatar + RouletteWheel logos/initials

**Files:**
- Create: `src/ui/ClanAvatar.tsx`
- Modify: `src/ui/RouletteWheel.tsx` (and ScoreTable if useful)

```tsx
type ClanAvatarProps = {
  nombre: string;
  logoUrl: string | null;
  color?: string;
  size?: number;
};
// if logoUrl: <img src={logoUrl} onError→fallback initials />
// else: div with clanInitials(nombre)
```

Roulette: show small avatar per sector or under selected clan; keep labels.

- [ ] Implement + build
- [ ] Commit (si aplica): `feat: show clan logos or initials on wheel`

---

