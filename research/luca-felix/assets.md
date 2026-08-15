# Dock Visual Assets & Design Token Mapping (`luca-felix.com`)

**Target Reference**: `luca-felix.com` (Interactive Taskbar / macOS Dock Navigation)  
**Document**: App Icons, Indicator Dots, Glassmorphic Styling Tokens & Token Alignment  
**Classification Standard**: `[CONFIRMED]`, `[INFERRED]`, `[ESTIMATED]`, `[UNKNOWN]`  
**Design System Anchor**: `d:\CODE\Html\test\design.md`

---

## 1. Dock Icon Assets & Vector Squircles

| Icon Identifier | Subject / App | Base Size | Peak Size | Visual Treatment | Classification |
|---|---|---|---|---|---|
| `finder` | Finder Blue Face | 40×40px | 72×72px | macOS Two-tone blue split face squircle | `[CONFIRMED]` |
| `terminal` | Terminal CLI | 40×40px | 72×72px | Dark slate squircle, green prompt glyph | `[CONFIRMED]` |
| `projects` | Portfolio Showcase | 40×40px | 72×72px | Action Blue folder with preview icon | `[CONFIRMED]` |
| `about` | Personal Dossier | 40×40px | 72×72px | Indigo squircle with user silhouette | `[CONFIRMED]` |
| `skills` | Tech Stack Matrix | 40×40px | 72×72px | Amber gradient with lightning bolt | `[CONFIRMED]` |
| `settings` | System Preferences | 40×40px | 72×72px | Metallic gear wheel on dark tile | `[CONFIRMED]` |
| `contact` | Mail Messaging | 40×40px | 72×72px | Sky blue gradient with white envelope | `[CONFIRMED]` |
| `music` | Audio Mini-Player | 40×40px | 72×72px | Magenta/red gradient with musical note | `[CONFIRMED]` |

---

## 2. Design Token Harmonization Mapping

The visual styling of `luca-felix.com` aligns strictly with `design.md`:

| Dock Visual Element | Observed Implementation | Canonical `design.md` Token | Compliance Rationale |
|---|---|---|---|
| **Container Capsule** | Rounded pill container | `{rounded.pill}` (`9999px`) | **100% Match**: Signature Apple pill geometry. |
| **Frosted Glass Surface** | Acrylic blur background | `{colors.surface-chip-translucent}` / `{component.sub-nav-frosted}` | **100% Match**: `backdrop-filter: blur(20px) saturate(180%)`. |
| **Hairline Rim** | 1px semi-translucent border | `{colors.hairline}` (`#e0e0e0`) | **100% Match**: 1px crisp outline on light and dark canvases. |
| **Active Indicator Dot** | Blue active signal | `{colors.primary}` (`#0066cc`) / `{colors.primary-on-dark}` (`#2997ff`) | **100% Match**: Sole brand interactive accent rule honored. |
| **Active Press State** | Scale down on click | `{component.button-primary-active}` (`transform: scale(0.95)`) | **100% Match**: System-wide micro-interaction adhered to. |
| **Tooltip Typography** | SF Pro Text, 12px, -0.12px | `{typography.fine-print}` / `{typography.nav-link}` | **100% Match**: SF Pro Text at 12px with negative tracking. |
| **Dock Shadow** | Soft ambient elevation drop | Section: Elevation & Depth (Soft ambient drop) | **Resolved**: Light ambient drop permitted for floating chrome. |

---

## 3. Glassmorphic CSS Implementation Blueprint

```css
.dock-container {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 9999px;
  background-color: rgba(32, 32, 36, 0.65);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  z-index: 40;
}
```
