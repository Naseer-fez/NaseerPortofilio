# Comprehensive Application Architecture & Implementation Blueprint
## Milestone 2: 6 Dedicated macOS Desktop Applications

**Author**: Explorer 1 (Milestone 2)  
**Target Directory**: `src/components/apps/`  
**Dependencies**: `useOSStore`, `GlobalAudioManager`, `SoundSynthesizer`, `apps.ts`, `wallpapers.ts`, `Framer Motion`, `Lucide React`  
**Status**: Ready for Implementation  

---

## 1. Executive Summary & System Overview

Milestone 2 delivers the full interactive application layer of the macOS-style Portfolio OS. The 6 applications serve as rich, responsive, and tactile interactive experiences that showcase developer engineering expertise, career accomplishments, systems design, and creative UI engineering:

1. **`TerminalApp.tsx`**: Interactive command-line interface featuring an authentic Neofetch ASCII art system banner, 12 commands (`help`, `about`, `projects`, `skills`, `clear`, `neofetch`, `theme`, `date`, `contact`, `sudo`, `cat`, `matrix`), command history with up/down arrows, tab completion, sound FX on command execution, and a live Matrix digital rain mode.
2. **`ProjectsApp.tsx`**: Interactive portfolio project showcase gallery with category filter pills (`All`, `Full Stack`, `AI / ML`, `Systems`, `Creative`), real-time search input, visual cards with tech stack badges, and an interactive Project Detail Modal/Drawer with architecture highlights and live demo/repo links.
3. **`AboutApp.tsx`**: Interactive developer profile with avatar, biography narrative, quick stats grid, interactive career timeline, animated skills proficiency matrix, and PDF resume download action.
4. **`FinderApp.tsx`**: macOS-style Finder file browser featuring a sidebar tree (`Applications`, `Documents`, `Pictures`, `Downloads`), toolbar with path breadcrumbs, Grid/List view mode toggle, virtual filesystem with rich files, and a live File Preview pane with metadata and quick look.
5. **`SettingsApp.tsx`**: macOS System Settings with Wallpaper picker gallery (thumbnail preview & instant swap), Appearance (Dark / Light / Auto toggle), Dock magnification slider & toggle, Sound FX toggle with UI volume slider, and Typography Ambient Mode toggle.
6. **`MailApp.tsx`**: macOS Mail contact client with prefilled recipient, input validation (Name, Email, Subject, Message), animated paper airplane send button with spring physics, and success confirmation screen.

---

## 2. Global App Conventions & Shared Protocols

### 2.1 Audio System Binding
All interactive UI events trigger procedural audio through the singleton `GlobalAudioManager`:
- **Command Execute / Button Click / Tab Switch / Item Select**:
  ```ts
  GlobalAudioManager.getInstance().playFx('click');
  ```
- **Modal Open / File Open / Email Dispatch**:
  ```ts
  GlobalAudioManager.getInstance().playFx('window-open');
  ```
- **Modal Close / Clear Buffer**:
  ```ts
  GlobalAudioManager.getInstance().playFx('window-close');
  ```

### 2.2 Styling & Theme Consistency
- All app components are built to render within `WindowFrame` (desktop) and `MobileBottomSheet` (mobile).
- Glassmorphic transparency: `backdrop-blur-xl bg-stone-900/80 dark:bg-stone-950/85 text-white`.
- Light theme compatibility: Uses high-contrast glassmorphic surfaces that adapt with CSS variables and Tailwind `dark:` variants.
- Scrollbars: Styled with subtle webkit scrollbar classes (`scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent`).

---

## 3. App 1: `TerminalApp.tsx` (Interactive CLI & Neofetch)

### 3.1 Architecture & State Model
- **File**: `src/components/apps/TerminalApp.tsx`
- **Window Identifier**: `'terminal'`
- **Default Dimensions**: 640×400px (min: 380×240px)

```tsx
interface TerminalEntry {
  id: string;
  command?: string;
  output: React.ReactNode;
  timestamp: Date;
}
```

- **Local State**:
  - `history: TerminalEntry[]` — Scrollback history of terminal outputs.
  - `input: string` — Current input line buffer.
  - `commandHistory: string[]` — Past executed commands.
  - `historyIndex: number` — Pointer for Up/Down arrow history lookup.
  - `isMatrix: boolean` — Toggles full-window Matrix green digital rain canvas mode.
  - `inputRef: React.RefObject<HTMLInputElement>` — Auto-focused on window click.
  - `terminalEndRef: React.RefObject<HTMLDivElement>` — For auto-scrolling to bottom.

### 3.2 Neofetch Banner Specification
The Neofetch output contains a 2-column layout:
- **Left Column**: Colored ASCII art logo:
  ```
     /\_/\
    ( o.o )  OS: macOS Portfolio OS Sonoma
     > ^ <   Host: MacBook Pro M3 Max 64GB
             Kernel: 24.2.0 Darwin x86_64
             Uptime: 42 days, 13 hours, 37 mins
             Shell: zsh 5.9 (x86_64-apple-darwin24.0)
             Resolution: 3840x2160 @ 120Hz Retina
             Theme: Sonoma Dark (Glassmorphic)
             CPU: Apple M3 Max (16 cores @ 4.05GHz)
             Memory: 32.4 GiB / 64.0 GiB (50%)
  ```
- **Bottom Row**: ANSI color palette block with 8 squares (`bg-black`, `bg-red-500`, `bg-green-500`, `bg-yellow-500`, `bg-blue-500`, `bg-purple-500`, `bg-cyan-500`, `bg-white`).

### 3.3 Command Registry & Execution Logic
| Command | Description | Action / Output |
|---|---|---|
| `help` | List available commands | 2-column tabular list of all commands and descriptions |
| `about` | Developer bio | Narrative summary + prompt to open About app |
| `projects` | List portfolio projects | Formatted table of projects, categories, and tech stacks |
| `skills` | Skills breakdown | Languages, Frontend, Backend, Systems, AI/ML tools |
| `clear` | Clear buffer | Resets `history` to empty |
| `neofetch` | Print system info | Full ASCII art banner and hardware telemetry |
| `theme [dark\|light]` | Switch theme | Calls `useOSStore.getState().setTheme(mode)` |
| `date` | System date | Formatted `new Date().toString()` |
| `contact` | Contact links | Email, GitHub, LinkedIn + triggers `openWindow('mail')` |
| `sudo [cmd]` | Easter egg | "🔒 Permission denied: Incident reported to Santa Claus." |
| `cat <file>` | View virtual file | Previews `resume.txt`, `bio.md`, `secret.txt` |
| `matrix` | Digital rain | Activates falling green character stream with ESC/Ctrl+C exit |
| `[unknown]` | Error handler | `zsh: command not found: <cmd>. Type 'help' for available commands.` |

### 3.4 Key Interactions
- **Enter**: Executes command, appends output to history, scrolls to bottom, plays `click` sound FX.
- **ArrowUp / ArrowDown**: Cycles through `commandHistory`.
- **Tab**: Auto-completes the longest matching command prefix.
- **Ctrl+L**: Clears the terminal screen.
- **Ctrl+C**: Clears current input or exits Matrix mode.
- **Container Click**: Focuses input ref automatically.

### 3.5 TestIDs & Verification Elements
- `data-testid="terminal-app"`: Root terminal container
- `data-testid="terminal-history"`: History list container
- `data-testid="terminal-input"`: Hidden or inline text input
- `data-testid="terminal-prompt"`: Command prompt label
- `data-testid="neofetch-banner"`: Neofetch banner element
- `data-testid="terminal-matrix-canvas"`: Matrix mode canvas

---

## 4. App 2: `ProjectsApp.tsx` (Portfolio Showcase Gallery)

### 4.1 Architecture & State Model
- **File**: `src/components/apps/ProjectsApp.tsx`
- **Window Identifier**: `'projects'`
- **Default Dimensions**: 800×550px (min: 450×320px)

```tsx
export interface ProjectItem {
  id: string;
  title: string;
  category: 'Full Stack' | 'AI / ML' | 'Systems' | 'Creative';
  tagline: string;
  description: string;
  highlights: string[];
  techStack: string[];
  gradient: string;
  iconName: string;
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  metrics?: { label: string; value: string }[];
}
```

- **Local State**:
  - `activeCategory: string` — `'All' | 'Full Stack' | 'AI / ML' | 'Systems' | 'Creative'`
  - `searchQuery: string` — Live search text string
  - `selectedProject: ProjectItem | null` — Currently inspected project for Detail Modal

### 4.2 Projects Dataset (6 Production-Grade Showcase Items)
1. **macOS Portfolio OS** (`Creative`):
   - Tagline: "Web desktop operating system with Euler physics & Web Audio"
   - Tech: `Next.js 14`, `TypeScript`, `Tailwind CSS`, `Framer Motion`, `Web Audio API`, `Zustand`
   - Highlights: Semi-implicit Euler ODE solver for kinetic typography, Luca parabolic Cosine Bell dock magnification, Procedural audio synthesis with automatic ducking.
2. **Neural Audio Synthesizer** (`AI / ML`):
   - Tagline: "Real-time neural audio synthesis & timbre transfer"
   - Tech: `PyTorch`, `ONNX Runtime Web`, `WebAssembly`, `Web Audio API`, `TypeScript`
   - Highlights: Sub-15ms client-side inference, Spectral loss minimization, Interactive harmonic overtones visualizer.
3. **HyperScale Distributed KV** (`Systems`):
   - Tagline: "High-throughput distributed key-value store with Raft consensus"
   - Tech: `Rust`, `Tokio`, `gRPC`, `Raft Consensus`, `LSM-Trees`, `eBPF`
   - Highlights: 120,000+ QPS per cluster node, Write-Ahead Log (WAL) with deterministic chaos testing, Self-healing partition recovery.
4. **Autonomous Agent Mesh** (`AI / ML`):
   - Tagline: "Multi-agent runtime for distributed task execution & code synthesis"
   - Tech: `Python`, `FastAPI`, `LangGraph`, `Redis Streams`, `Docker`, `PostgreSQL`
   - Highlights: Zero-loss message bus, Streaming subagent handoff protocol, Automated verification sandboxes.
5. **Cloud-Native Telemetry Suite** (`Full Stack`):
   - Tagline: "Real-time distributed tracing and APM platform"
   - Tech: `Go`, `React`, `TypeScript`, `ClickHouse`, `eBPF`, `TailwindCSS`
   - Highlights: Ingests 1M+ spans/sec, Sub-second OLAP aggregation, Interactive microservice topology graph.
6. **Generative Shader Visualizer** (`Creative`):
   - Tagline: "GPU-accelerated GLSL shader synthesizer with audio-reactive fractals"
   - Tech: `WebGL2`, `Three.js`, `GLSL Shaders`, `Web Audio FFT`, `React`
   - Highlights: 60fps 4K raymarching, Real-time frequency bin harmonic mapping, Custom volumetric raymarching.

### 4.3 UI Components & Interactions
- **Category Filter Pills**:
  - Horizontal bar with pills: `All (6)`, `Full Stack (1)`, `AI / ML (2)`, `Systems (1)`, `Creative (2)`.
  - Framer Motion `layoutId="activeFilter"` indicator with smooth slide animation.
- **Search Bar**:
  - Real-time search by title, description, and tech stack tags.
  - Clear button `✕` inside input.
- **Responsive Card Grid**:
  - 2-column grid (`grid grid-cols-1 md:grid-cols-2 gap-4`).
  - Cards feature glowing gradient headers, category tags, tech pills, and action buttons.
- **Detail Modal / Lightbox**:
  - Framer Motion modal overlay with backdrop blur.
  - Displays full architecture details, metrics, challenge/solution notes, live demo button, and GitHub button.
  - Close button and click-outside dismiss.

### 4.4 TestIDs & Verification Elements
- `data-testid="projects-app"`: Root container
- `data-testid="project-filter-all"`, `project-filter-full-stack`, etc.: Category filter buttons
- `data-testid="project-search-input"`: Search input box
- `data-testid="project-card-{id}"`: Individual project cards
- `data-testid="project-modal"`: Detail modal dialog
- `data-testid="project-modal-close"`: Modal close button

---

## 5. App 3: `AboutApp.tsx` (Developer Profile, Career & Skills)

### 5.1 Architecture & State Model
- **File**: `src/components/apps/AboutApp.tsx`
- **Window Identifier**: `'about'`
- **Default Dimensions**: 700×500px (min: 420×300px)

- **Local State**:
  - `activeTab: 'overview' | 'timeline' | 'skills' | 'resume'` — Active navigation tab
  - `downloadingResume: boolean` — Feedback state on resume download action

### 5.2 4-Tab Navigation & Panels
1. **`Overview` Tab**:
   - **Hero Profile**: Avatar with radiant gradient ring, green status badge ("🟢 Available for high-impact roles"), Developer Name, Title ("Principal Software Engineer & Creative Technologist"), Location ("San Francisco, CA / Remote").
   - **Action Bar**:
     - "Download Resume (PDF)" button (triggers animated download and click sound).
     - "Contact Me" button (triggers `useOSStore.getState().openWindow('mail')`).
     - Social link chips: GitHub, LinkedIn, Twitter, Email.
   - **Bio Story**: 3 engaging narrative paragraphs covering systems background, modern UI passion, and real-time computing interests.
   - **Quick Stats Grid**:
     - `8+` Years Experience
     - `40+` Projects Shipped
     - `2.5k+` GitHub Stars
     - `99.99%` Production Reliability
2. **`Career Timeline` Tab**:
   - Vertical timeline track with illuminated node dots and connector gradients:
     - `2024 - Present`: Lead Systems & AI Engineer @ Autonomous Labs
     - `2021 - 2024`: Senior Full-Stack Engineer @ CloudScale Technologies
     - `2018 - 2021`: Software Engineer @ Interactive Media Studio
     - `2014 - 2018`: B.S. in Computer Science @ UC Berkeley (Magna Cum Laude)
   - Expandable accomplishment bullets and tech tags for each role.
3. **`Skills Matrix` Tab**:
   - Categorized technical proficiencies with animated percentage bars (fills smoothly on tab view):
     - **Languages**: TypeScript (96%), Rust (88%), Python (92%), Go (85%), C++ (80%), SQL (90%)
     - **Frontend & UI**: React / Next.js (96%), Tailwind CSS (95%), Framer Motion (92%), WebGL / Three.js (86%), Web Audio API (90%)
     - **Backend & Systems**: Node.js (94%), FastAPI (90%), PostgreSQL (92%), Redis (90%), Kafka (85%), gRPC (88%)
     - **Cloud & DevOps**: Docker / K8s (88%), AWS / GCP (88%), CI/CD & Terraform (85%), Linux / eBPF (84%)
   - Badges: `Expert`, `Advanced`, `Proficient`.
4. **`Resume` Tab**:
   - Clean, beautifully formatted in-app document view of resume with Summary, Core Competencies, Experience, and Education.
   - "Download PDF" action with feedback toast.

### 5.3 TestIDs & Verification Elements
- `data-testid="about-app"`: Root container
- `data-testid="about-tab-overview"`, `about-tab-timeline`, `about-tab-skills`, `about-tab-resume`: Tab buttons
- `data-testid="about-resume-download-btn"`: Resume download button
- `data-testid="about-contact-btn"`: Contact launch button
- `data-testid="skills-progress-bar-{skill}"`: Individual proficiency bar

---

## 6. App 4: `FinderApp.tsx` (macOS Filesystem Browser & Preview)

### 6.1 Architecture & State Model
- **File**: `src/components/apps/FinderApp.tsx`
- **Window Identifier**: `'finder'`
- **Default Dimensions**: 700×500px (min: 420×300px)

```tsx
export interface VFSItem {
  id: string;
  name: string;
  path: string;
  parentId: string;
  type: 'folder' | 'app' | 'document' | 'picture' | 'download' | 'audio';
  size: string;
  modified: string;
  appId?: string;
  iconName: string;
  contentPreview?: string;
  downloadUrl?: string;
}
```

- **Local State**:
  - `currentFolderId: string` — Current directory ID (`'root'`, `'apps'`, `'docs'`, `'pics'`, `'downloads'`)
  - `history: string[]` — History stack for Back/Forward navigation
  - `historyIndex: number` — Current index in history stack
  - `viewMode: 'grid' | 'list'` — Toggle between icon grid and detail table
  - `selectedItemId: string | null` — Currently selected file/folder
  - `searchQuery: string` — Filter files in current directory

### 6.2 Virtual Filesystem Hierarchy
- **`/Applications`** (Folder):
  - `Terminal.app` (`app`, opens `terminal`)
  - `Projects.app` (`app`, opens `projects`)
  - `About Me.app` (`app`, opens `about`)
  - `Settings.app` (`app`, opens `settings`)
  - `Mail.app` (`app`, opens `mail`)
  - `Music Player.app` (`app`, toggles music deck expansion)
- **`/Documents`** (Folder):
  - `Resume_2026.pdf` (`document`, 240 KB)
  - `System_Architecture_Notes.md` (`document`, 18 KB)
  - `Portfolio_Project_Specs.txt` (`document`, 8 KB)
  - `Distributed_Systems_Research.pdf` (`document`, 1.2 MB)
- **`/Pictures`** (Folder):
  - `Developer_Avatar.png` (`picture`, 420 KB)
  - `Sonoma_Wallpaper_4K.webp` (`picture`, 3.4 MB)
  - `Architecture_Diagram.svg` (`picture`, 65 KB)
  - `Audio_Synthesizer_UI.png` (`picture`, 850 KB)
- **`/Downloads`** (Folder):
  - `portfolio_source_bundle.zip` (`download`, 14.2 MB)
  - `neural_weights_fp16.onnx` (`download`, 45.8 MB)
  - `benchmark_telemetry.json` (`download`, 120 KB)

### 6.3 UI Structure & Interaction Logic
- **Finder Chrome Toolbar**:
  - Navigation buttons: Back (`<`) and Forward (`>`) with history tracking.
  - Path Breadcrumbs: `Macintosh HD > Users > dev > [currentFolder]`.
  - View Mode Toggle: Grid (Icons) vs List (Table).
  - Search Input: Filter items within the current directory.
- **Left Sidebar**:
  - Favorites: `Applications`, `Documents`, `Pictures`, `Downloads`, `Desktop`.
  - Locations: `Macintosh HD`, `GitHub Repos`.
  - Clicking any sidebar item navigates immediately to that folder.
- **Main View (Grid / List)**:
  - Single Click: Selects item and updates the Preview Pane.
  - Double Click:
    - If `app`: Invokes `useOSStore.getState().openWindow(appId)`.
    - If `folder`: Navigates into folder.
    - If `file`: Selects and displays full preview.
- **Right Preview Pane**:
  - Large thumbnail icon / preview canvas.
  - File metadata: Name, Kind, Size, Date Modified, Path.
  - Content preview snippet (Markdown text, image preview, or PDF summary).
  - "Open / Quick Look" button.

### 6.4 TestIDs & Verification Elements
- `data-testid="finder-app"`: Root container
- `data-testid="finder-sidebar"`: Left navigation sidebar
- `data-testid="finder-sidebar-{folderId}"`: Sidebar folder links
- `data-testid="finder-view-grid-btn"`, `finder-view-list-btn`: View switcher buttons
- `data-testid="finder-item-{id}"`: File/folder item
- `data-testid="finder-preview-pane"`: File preview pane

---

## 7. App 5: `SettingsApp.tsx` (macOS System Preferences)

### 7.1 Architecture & State Model
- **File**: `src/components/apps/SettingsApp.tsx`
- **Window Identifier**: `'settings'`
- **Default Dimensions**: 600×450px (min: 400×300px)

- **Local State**:
  - `activeSection: 'wallpaper' | 'appearance' | 'dock' | 'sound' | 'displays' | 'about'`
  - `dockScale: number` — Dock icon size multiplier (1.0 to 1.6)
  - `dockMagnificationEnabled: boolean` — Dock magnification toggle

### 7.2 Preference Sections & Controls
1. **`Wallpaper` Panel**:
   - Gallery grid displaying all wallpapers from `WALLPAPERS` constant:
     - `Sonoma Dark`, `Sonoma Light`, `macOS Sequoia`, `macOS Ventura`, `macOS Monterey`, `Cyberpunk Horizon`, `Minimalist Noir`.
   - Each card displays live gradient/thumbnail, wallpaper name, theme badge, and active indicator checkmark (`✓ Current Wallpaper`).
   - Clicking a wallpaper card calls `useOSStore.getState().setWallpaper(id)` and plays `click` sound.
2. **`Appearance` Panel**:
   - Theme toggle cards: `Dark`, `Light`, `System Auto`.
   - Visual mini preview mockup for each mode.
   - Clicking a theme card calls `useOSStore.getState().setTheme(theme)`.
   - Accent color selection palette (Blue, Purple, Pink, Orange, Green, Graphite).
3. **`Dock & Taskbar` Panel**:
   - Parabolic Magnification toggle switch (`Enable Cosine Bell Magnification`).
   - Magnification Size Slider (1.0x to 1.6x).
   - Show Active App Indicator Dot toggle.
   - Show Desktop Icons toggle.
4. **`Sound & Audio` Panel**:
   - Sound FX Enable/Disable toggle switch (`useOSStore.soundEnabled`).
   - UI Sound Volume slider (`useOSStore.soundVolume`).
   - Audio Ducking info banner: "Procedural UI sounds automatically duck background music to 20% over 40ms."
   - "Test Sound Effect" buttons (Test Window Open, Test Click, Test Window Close).
5. **`Displays & Kinetic Mode` Panel**:
   - Typography Ambient Hero Mode toggle switch (`useOSStore.desktopMode`).
   - Kinetic Typography Physics explanation (Euler ODE spring-mass-damper solver: $k=280, c=24, m=1.0$).
   - Custom Cursor Aura Ring difference-blend info.
6. **`About System` Panel**:
   - macOS Sonoma Portfolio Showcase (v2.0.0).
   - Architecture: Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Framer Motion, Zustand, Web Audio API.

### 7.3 TestIDs & Verification Elements
- `data-testid="settings-app"`: Root container
- `data-testid="settings-nav-{section}"`: Sidebar category items
- `data-testid="settings-wallpaper-{id}"`: Wallpaper gallery cards
- `data-testid="settings-theme-{mode}"`: Theme selector buttons
- `data-testid="settings-sound-toggle"`: Sound FX toggle switch
- `data-testid="settings-ambient-toggle"`: Ambient mode toggle switch

---

## 8. App 6: `MailApp.tsx` (macOS Mail Contact Client)

### 8.1 Architecture & State Model
- **File**: `src/components/apps/MailApp.tsx`
- **Window Identifier**: `'mail'`
- **Default Dimensions**: 550×400px (min: 380×260px)

```tsx
interface MailFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}
```

- **Local State**:
  - `formData: MailFormData` — Current form values
  - `errors: FormErrors` — Validation error messages
  - `status: 'idle' | 'sending' | 'sent' | 'error'` — Submission status lifecycle
  - `copiedEmail: boolean` — Copy-to-clipboard feedback badge

### 8.2 Form Validation Rules
- `name`: Required, minimum 2 characters. Error: "Please enter your name (at least 2 characters)."
- `email`: Required, must match regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`. Error: "Please enter a valid email address."
- `subject`: Required, minimum 3 characters. Error: "Please provide a subject line."
- `message`: Required, minimum 10 characters. Error: "Message must be at least 10 characters."

### 8.3 Interactive Paper Airplane Send Animation
- When the user clicks the "Send" button:
  1. Validates all fields. If invalid, plays error feedback and shakes the form container (`x: [-6, 6, -4, 4, 0]`).
  2. If valid, status switches to `'sending'`.
  3. Triggers `GlobalAudioManager.getInstance().playFx('window-open')`.
  4. Framer Motion paper airplane icon animates along an ascending parabolic trajectory:
     ```ts
     animate={{
       x: [0, 80, 240],
       y: [0, -40, -120],
       rotate: [0, 20, 50],
       scale: [1, 1.2, 0],
       opacity: [1, 1, 0],
     }}
     transition={{ duration: 0.8, ease: "easeIn" }}
     ```
  5. After 800ms, status transitions to `'sent'`.
  6. **Sent Screen UI**:
     - Pulsing green checkmark badge.
     - Heading: "Message Sent Successfully!"
     - Description: "Thank you for reaching out! I've received your message and will respond within 24 hours."
     - "Send Another Message" button to reset form to initial empty state.

### 8.4 Secondary Channels & Quick Copy
- Secondary contact chips at bottom of form:
  - GitHub link
  - LinkedIn link
  - Twitter / X link
  - "Copy Email (`contact@developer.dev`)" button with instant "Copied!" checkmark feedback.

### 8.5 TestIDs & Verification Elements
- `data-testid="mail-app"`: Root container
- `data-testid="mail-input-name"`: Name input field
- `data-testid="mail-input-email"`: Email input field
- `data-testid="mail-input-subject"`: Subject input field
- `data-testid="mail-input-message"`: Message textarea
- `data-testid="mail-send-button"`: Send paper airplane button
- `data-testid="mail-sent-success"`: Sent confirmation banner
- `data-testid="mail-copy-email-btn"`: Copy email button

---

## 9. WindowManager & Full Desktop Integration Plan

### 9.1 Dispatch Wiring in `src/components/window/WindowManager.tsx`
Update `WindowManager.tsx` to render the 6 application components inside their respective `WindowFrame` instances:

```tsx
import React from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import { WindowFrame } from './WindowFrame';
import { useBreakpoint } from '@/hooks/useBreakpoint';

// 6 App Component Imports
import { TerminalApp } from '@/components/apps/TerminalApp';
import { ProjectsApp } from '@/components/apps/ProjectsApp';
import { AboutApp } from '@/components/apps/AboutApp';
import { FinderApp } from '@/components/apps/FinderApp';
import { SettingsApp } from '@/components/apps/SettingsApp';
import { MailApp } from '@/components/apps/MailApp';

export function WindowManager() {
  const windows = useOSStore(state => state.windows);
  const { isMobile } = useBreakpoint();

  if (isMobile) return null;

  const renderAppContent = (id: string) => {
    switch (id) {
      case 'terminal':
        return <TerminalApp />;
      case 'projects':
        return <ProjectsApp />;
      case 'about':
        return <AboutApp />;
      case 'finder':
        return <FinderApp />;
      case 'settings':
        return <SettingsApp />;
      case 'mail':
        return <MailApp />;
      default:
        return null;
    }
  };

  return (
    <div data-testid="window-manager" className="fixed inset-0 pointer-events-none z-20">
      <div className="pointer-events-auto">
        {Object.values(windows).map(win => (
          <WindowFrame key={win.id} windowState={win}>
            {renderAppContent(win.id)}
          </WindowFrame>
        ))}
      </div>
    </div>
  );
}
```

### 9.2 Mobile Bottom Sheet Compatibility
The same `renderAppContent(id)` helper can be utilized in `MobileBottomSheet` to ensure full desktop and mobile feature parity without code duplication.

---

## 10. Summary Matrix of App Specifications

| App Name | Component File | Default Size | Key Capabilities | Audio Triggers | TestID |
|---|---|---|---|---|---|
| **Terminal** | `TerminalApp.tsx` | 640×400px | Interactive CLI, Neofetch ASCII art, 12 commands, history, Tab completion, Matrix rain | `click` on Enter | `terminal-app` |
| **Projects** | `ProjectsApp.tsx` | 800×550px | Category pills, Live search, 6 rich cards, Architecture Detail Modal | `click` on filter & select | `projects-app` |
| **About** | `AboutApp.tsx` | 700×500px | Bio, Quick stats, Career timeline, Skills progress bars, PDF resume download | `click` on tab & download | `about-app` |
| **Finder** | `FinderApp.tsx` | 700×500px | Sidebar navigation, Grid/List view toggle, Breadcrumbs, Preview pane, App launcher | `click` on folder & file | `finder-app` |
| **Settings** | `SettingsApp.tsx` | 600×450px | Wallpaper picker (live swap), Theme toggle, Dock scale/magnification, Sound FX volume, Ambient mode | `click` on options, `window-open` test | `settings-app` |
| **Mail** | `MailApp.tsx` | 550×400px | Contact form, validation, Parabolic paper airplane animation, Status screen, Quick links | `window-open` on send | `mail-app` |

---
