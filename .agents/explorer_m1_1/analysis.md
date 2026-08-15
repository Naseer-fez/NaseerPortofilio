# Technical Analysis Report: Systems, Low-Level, Utilities, Performance & Algorithms

**Explorer**: Explorer 1 (Systems, Low-Level, Utilities, Performance & Algorithms specialist)  
**Date**: 2026-08-15  
**Scope**: Deep technical inspection of 12 local repositories under `d:\CODE`  

---

## Executive Summary Matrix

| # | Project Name | Real Title | Domain Category | Primary Stack | Core Technical Highlight |
|---|--------------|------------|-----------------|---------------|--------------------------|
| 1 | `Api_RateLimiter` | API RateLimiter V2 (`apirlpy`) | `BACKEND` | Python, SQLite, Threading, JSON | 100k client IP benchmark, 64-thread pool, background TTL cleaner daemon |
| 2 | `Dates` | Date (C-Optimized Engine) | `SYSTEMS` | C, Python, ctypes, Zeller's Congruence | Raw C integer array pointer passing via ctypes, zero standard library time calls |
| 3 | `Taskbarengine` | TaskbarEngine | `SYSTEMS` | C17, C++17, DirectComposition, Win32 Hooks, IPC | Windows 11 Explorer process injection, DirectComposition 0-latency, SEH 3-strike fault isolation |
| 4 | `Livewallpaper` | LiveWallpaper Engine for Windows | `CREATIVE` | C++17, Rust, Direct3D 11, HLSL, Media Foundation | Explorer WorkerW injection, Rust FFI shader host with dynamic hot-reload, GTest suite |
| 5 | `DSA-Journey` | DSA-Journey | `SYSTEMS` | C++17/20, STL, Algorithms, MySQL | 50+ hand-crafted optimal vs brute-force solutions (Kadane, Moore's Voting, Inversions) |
| 6 | `Pass_Gen` | Pass_Gen | `SYSTEMS` | C, Python, NumPy, Pyperclip | C manual PRNG arrays vs Python NumPy vectorization with clipboard integration |
| 7 | `Phone-Contract` | Phone-Contract | `SYSTEMS` | C, Doubly Linked List, Dynamic Pointers | Dynamic heap node allocation, bidirectional pointer relinking, $O(1)$ node removal |
| 8 | `Student_Records` | Student_Records | `SYSTEMS` | C, Singly Linked List, Dynamic Heap | Dynamic singly linked list, positional node insertion, manual memory reclamation |
| 9 | `ToDoList` | ToDoList | `SYSTEMS` | C, Multi-dimensional Arrays, Bitmasks | 12-hour fixed time-slot allocator, static global memory tables, 0 temp disk writes |
| 10 | `MineSweper_game` | Minesweeper Console Game | `CREATIVE` | C, PRNG, Coordinate Projections | 1D-to-2D terminal projection matrix, stateful cell masking, replay state machine |
| 11 | `Restaurant_Management_Demo` | Restaurant Order & Billing System | `SYSTEMS` | C, Structs, 2D Arrays, Bubble Sort | 10-table multi-tenant 2D ordering matrix, parallel bubble sort synchronization |
| 12 | `Hosplital_Managment` | Hospital Bed Management System | `SYSTEMS` | C, Global Arrays, 2D Visual Matrix | 100-bed ward capacity management, 2D visual layout rendering, circular logs |

---

## Comprehensive Project Breakdown

### 1. API RateLimiter V2 (`Api_RateLimiter`)

- **Real Title**: API RateLimiter V2 (PyPI: `apirlpy`)
- **Domain Category**: `BACKEND`
- **1-Sentence Description**: A lightweight, thread-safe rate-limiting library and middleware utilizing in-memory hash caching with persistent JSON/SQLite backends and background cleanup daemon threads.
- **Key Technologies Used**: Python 3, Threading (`RLock`, `Event`, `ThreadPoolExecutor`), SQLite3, JSON persistence, Flask (decorators/middleware) *(+2: psutil, Matplotlib/Seaborn)*
- **Architecture Details**:
  - *Concurrency & Synchronization*: Re-entrant lock (`threading.RLock()`) guarding concurrent request validations; independent background worker thread (`threading.Thread`) using `threading.Event()` for periodic TTL expiration without blocking request throughput.
  - *Memory Management & Caching*: In-memory primary hash map (`self.Data: dict`) storing active IP metadata (`WaitStamp`, `LastSeenTime`, `Visits`), eliminating repetitive secondary disk reads.
  - *Data Structures & Storage*: Dual persistence engines: atomic file streaming via `json.dump()` with in-place truncation and `.flush()`, or relational persistence using SQLite (`UserIps` table with `IP TEXT PRIMARY KEY, jsondata TEXT`).
  - *Low-Level APIs / Interfaces*: Flask function decorator middleware (`Decorator.py`), sliding window cooldown logic, atomic thread counters (`AtomicCounters`).
- **Verified Metrics & Technical Capabilities**:
  - Scalability benchmarked with **100,000 unique simulated client IPs** across **64 concurrent worker threads** (`TestRunner.py`).
  - Latency profiling capturing Mean, P95, and P99 response times against concurrent load; system resource tracking via `psutil`.
  - Non-blocking daemon background cleaner with configurable TTL and cleaning frequencies.
- **URLs**:
  - **GitHub URL**: `https://github.com/Naseer-fez/Api_RateLimiter`
  - **PyPI / Demo URL**: `https://pypi.org/project/apirlpy/`

---

### 2. Date C-Optimized Engine (`Dates`)

- **Real Title**: Date (C-Optimized Date Manipulation Library)
- **Domain Category**: `SYSTEMS`
- **1-Sentence Description**: A low-level, high-performance date manipulation and validation engine written from scratch in C with manual heap management and bound to Python via ctypes pointers without relying on standard date/time libraries.
- **Key Technologies Used**: C, Python, ctypes, GCC/Clang (dynamic DLL compilation), Zeller’s Congruence algorithm *(+2: Memory Pointers, Custom C ABI)*
- **Architecture Details**:
  - *Memory Management & Pointer Safety*: Manual heap allocation in C (`malloc(sizeof(int)*4)`), strict pointer ownership passing raw integer array pointers (`int* [format, day, month, year]`) safely across C/Python FFI boundaries.
  - *Data Structures*: Compact contiguous 4-element C array representation `[Format, Day, Month, Year]` avoiding high-level object wrapping overhead.
  - *Low-Level APIs / Algorithmic Implementation*: Custom modular C dynamic link libraries (`memory_Date.dll`, `Date_Filler.dll`, `Datecheck.dll`, `Day_of_Year.dll`), Zeller's Congruence implementation for $O(1)$ day-of-week calculation, leap-year validation, partial date parsing logic (`DD-MM-YYYY`, `DDMMYYYY`, `DDMM`, `DD`).
- **Verified Metrics & Technical Capabilities**:
  - Zero reliance on Python `datetime` or OS system time abstractions.
  - Direct C dynamic library interface via `ctypes.CDLL` with strict `argtypes` and `restype` pointer type safety.
- **URLs**:
  - **GitHub URL**: `https://github.com/Naseer-fez/Dates`
  - **Demo URL**: None

---

### 3. TaskbarEngine (`Taskbarengine`)

- **Real Title**: TaskbarEngine
- **Domain Category**: `SYSTEMS`
- **1-Sentence Description**: A high-performance, modular C17/C++17 Windows 11 Taskbar modification engine featuring Explorer process injection via SetWindowsHookEx CBT hooks, DirectComposition zero-latency rendering, SEH fault-isolated plugin architecture, and Win32 Named Pipe IPC.
- **Key Technologies Used**: C17, C++17, Win32 API / SetWindowsHookEx, DirectComposition / Comctl32 Subclassing, Named Pipes IPC, JSON-C *(+4: CMake, Google Benchmark, Structured Exception Handling, DPI Virtualization)*
- **Architecture Details**:
  - *Concurrency & Synchronization*: Asynchronous event dispatcher with lock-free atomic depth re-entrancy guards (`InterlockedCompareExchange`), UI thread synchronization with sync/async command queues (`TE_UiPostCommandSync`), dedicated background IPC listener thread.
  - *Memory Management & Fault Isolation*: Structured Exception Handling (`__try / __except` SEH) wrapping plugin calls, 3-strike fault count watchdog timer isolation via `CreateTimerQueueTimer`, atomic generation versioning.
  - *Data Structures & Modules*: State store hash tables / registries, plugin dynamic loading (`TE_PluginEntry`), dynamic easing curves, DPI virtualization scaling.
  - *Low-Level APIs*: `SetWindowsHookExW` (WH_CBT), `SetWindowSubclass` on `Shell_TrayWnd`, DirectComposition rendering pipelines, Win32 Named Pipes with custom binary frame serialization (`TE_IpcHeader`).
- **Verified Metrics & Technical Capabilities**:
  - Runs fully inside `explorer.exe` process space with 0-latency DirectComposition rendering.
  - Complete benchmark suite (`bench_easing.cpp`, `bench_event_dispatch.cpp`, `bench_icon_layout.cpp`, `bench_magnification.cpp`, `bench_state_store.cpp`, `bench_config_parse.cpp`).
  - Dynamic hot-reloading of JSONC configs via directory change notifications without restarting Explorer.
- **URLs**:
  - **GitHub URL**: `https://github.com/Naseer-fez/Taskbarengine`
  - **Demo URL**: None

---

### 4. LiveWallpaper Engine for Windows (`Livewallpaper`)

- **Real Title**: LiveWallpaper Engine for Windows
- **Domain Category**: `CREATIVE`
- **1-Sentence Description**: A high-performance Windows 10/11 dynamic wallpaper engine combining C++17 Direct3D 11 rendering and Windows Media Foundation hardware video decoding with a safe Rust core library for interactive HLSL shader hot-reloading injected into Explorer's WorkerW background.
- **Key Technologies Used**: C++17, Rust (`windows` crate, `parking_lot`, `notify`), Direct3D 11, HLSL (custom compute/pixel shaders), Windows Media Foundation, Win32 API (WorkerW Injection) *(+4: CMake, Cargo, Google Test, INI Configuration)*
- **Architecture Details**:
  - *Concurrency*: Background async file watching (`notify` crate) with lock-free atomic hot-reloading (`AtomicBool`), Media Foundation asynchronous playback callbacks, power/fullscreen polling thread.
  - *Memory Management & Resource Lifecycle*: Direct3D 11 resource management (device, context, swap chain, render target views, constant buffers aligned to 16-byte boundaries `#[repr(C)]`), zero-leak COM smart pointer handling.
  - *Low-Level APIs*: Explorer `Progman` message pump injection (`0x052C` message to spawn `WorkerW`), `SetParent` anchoring behind desktop icons, fullscreen window detection (`GetForegroundWindow` / `GetWindowRect` checking `MONITORINFO`), sleep/idle power management (`GetLastInputInfo`).
  - *Shaders & Pipeline*: Full-screen triangle vertex shader generated via `SV_VertexID`, 60+ FPS dynamic uniform buffer passing `i_time`, `i_resolution`, `i_mouse`, `i_audio`, `i_frame`.
- **Verified Metrics & Technical Capabilities**:
  - Dual-engine rendering: Hardware-accelerated video playback (MP4/MKV/AVI) via Media Foundation + 60+ FPS HLSL shaders via Direct3D 11.
  - Rust FFI dynamic library (`live_wallpaper_rust.dll`) with automated runtime shader compilation via `D3DCompile`.
  - Comprehensive Google Test suite (`LiveWallpaperTests.exe`) verifying device manager, explorer integration, swap chain, and power monitoring.
- **URLs**:
  - **GitHub URL**: `https://github.com/Naseer-fez/Livewallpaper`
  - **Demo URL**: None

---

### 5. DSA-Journey (`DSA-Journey`)

- **Real Title**: DSA-Journey (Data Structures and Algorithms Repository)
- **Domain Category**: `SYSTEMS`
- **1-Sentence Description**: A comprehensive algorithmic repository implementing foundational and advanced data structure problem solutions in C++ and SQL, contrasting brute-force against time/space optimal patterns across array manipulations, binary search, sliding windows, and dynamic programming.
- **Key Technologies Used**: C++17 / C++20, STL (`std::vector`, `std::unordered_map`, `std::set`), MySQL, Algorithms (Kadane's, Moore's Voting, Dutch National Flag, Merge Sort Inversions) *(+3: Binary Search on Monotonic Space, Matrix Rotations, Prefix Sums)*
- **Architecture Details**:
  - *Algorithmic Design Patterns*: Multi-approach comparison (Bruteforce $O(N^2)/O(N^3)$ vs Optimal $O(N)/O(N \log N)$), in-place space optimization $O(1)$.
  - *Data Structures*: Contiguous dynamic arrays (`std::vector`), Hash tables (`std::unordered_map`), Hash sets (`std::unordered_set`), 2D matrices, Frequency maps.
  - *Algorithmic Techniques*: Dutch National Flag partitioning, Kadane's algorithm for maximum subarray sum, Boyer-Moore Voting Algorithm for $O(N)$ majority element, Merge Sort tree recursion for counting inversions and reverse pairs, Binary search on monotonic answer spaces (Koko eating bananas, aggressive cows, ship packages in D days), Matrix rotations and spiral traversals.
- **Verified Metrics & Technical Capabilities**:
  - 50+ hand-crafted C++ solutions systematically categorised (Arrays, Binary Search, Matrix, LeetCode, SQL).
  - Comprehensive asymptotic complexity comparisons (Time & Space) coded for each problem progression.
- **URLs**:
  - **GitHub URL**: `https://github.com/Naseer-fez/DSA-Journey`
  - **Demo URL**: None

---

### 6. Random Password Generator & Cracker (`Pass_Gen`)

- **Real Title**: Pass_Gen (Dual-Language Random Password Generator & Brute-Force Cracker)
- **Domain Category**: `SYSTEMS`
- **1-Sentence Description**: A cross-language cryptographic comparison utility implementing randomized password generation in both C (manual PRNG arrays & non-repeating index shuffling) and Python (NumPy vectorization & pyperclip integration) alongside a brute-force password guesser.
- **Key Technologies Used**: C, Python, NumPy, Pyperclip, PRNG algorithms (C `rand()`/`srand()` vs NumPy uniform sampling) *(+2: String manipulation, Standard I/O)*
- **Architecture Details**:
  - *Memory Management / Array Layout*: In C, stack-allocated character arrays `char genrator[character + 1]` with manual index collision checking loop arrays (`int check[]`), zero heap allocations.
  - *Concurrency / Execution*: Single-threaded procedural C CLI alongside an object-oriented Python architecture (`class Paswords`).
  - *Low-Level APIs*: Standard C I/O and time seeding (`time(0)` / `srand()`), OS clipboard integration via `pyperclip` in Python.
- **Verified Metrics & Technical Capabilities**:
  - Dual-implementation: Low-level C memory model vs High-level Python abstraction.
  - Shuffled non-repeating index distribution algorithm ensuring uniform character placement across configurable password lengths.
- **URLs**:
  - **GitHub URL**: `https://github.com/Naseer-fez/Pass_Gen`
  - **Demo URL**: None

---

### 7. Contact Book Management System (`Phone-Contract`)

- **Real Title**: Phone-Contract (Contact Book Management System)
- **Domain Category**: `SYSTEMS`
- **1-Sentence Description**: A low-level contact management CLI engine written in C that demonstrates dynamic memory allocation and bidirectional pointer manipulation through a custom Doubly Linked List data structure.
- **Key Technologies Used**: C, Pointers & Dynamic Memory (`malloc`/`free`), Doubly Linked List, String manipulation (`string.h`), CLI validation *(+2: stdlib, ctype)*
- **Architecture Details**:
  - *Memory Management*: Explicit dynamic node heap allocation (`malloc(sizeof(contact))`) and deallocation (`free(temp)`), dual pointer link updates (`next` and `prev`).
  - *Data Structures*: Bidirectional Doubly Linked List (`typedef struct contact { char name[50]; char phone_number[10]; struct contact *next; struct contact *prev; }`).
  - *Validation / Flow*: Strict digit-only phone number validation (`phonenumbercheck`), interactive nested menu switch engine with error recovery and retry limits.
- **Verified Metrics & Technical Capabilities**:
  - Full CRUD (Create, Read, Update, Delete) operations implemented in raw C without third-party dependencies.
  - Bidirectional pointer relinking ensuring $O(1)$ node removal once pointer is located and zero memory leaks.
- **URLs**:
  - **GitHub URL**: `https://github.com/Naseer-fez/Phone-Contract`
  - **Demo URL**: None

---

### 8. Student Record Management System (`Student_Records`)

- **Real Title**: Student_Records (Student Record Management System)
- **Domain Category**: `SYSTEMS`
- **1-Sentence Description**: A low-level C management system executing dynamic single linked list operations for academic student record tracking with positional insertion, sequential traversal, and manual heap reclamation.
- **Key Technologies Used**: C, Singly Linked List, Dynamic Memory Allocation (`malloc`/`free`), String buffers, Pointer arithmetic *(+2: stdlib, stdio)*
- **Architecture Details**:
  - *Memory Management*: Dynamic heap node instantiation (`malloc(sizeof(student))`), traversal pointer walking, sequential node deletion and memory freeing across head, tail, and indexed positions (`insertatb`, `insertatend`, `insertatpos`, `delete_all`).
  - *Data Structures*: Singly Linked List (`typedef struct student { int roll; char name[50]; float marks; char course[30]; struct student *next; }`).
  - *Low-Level APIs*: Standard C memory and I/O runtime libraries (`stdlib.h`, `stdio.h`, `string.h`).
- **Verified Metrics & Technical Capabilities**:
  - Full positional CRUD support ($O(1)$ head insertion, $O(N)$ arbitrary position insertion/deletion).
  - Comprehensive memory cleanup functions preventing memory leaks upon program termination.
- **URLs**:
  - **GitHub URL**: `https://github.com/Naseer-fez/Student_Records`
  - **Demo URL**: None

---

### 9. Console Time-Slot Task Scheduler (`ToDoList`)

- **Real Title**: ToDoList (Console Time-Slot Task Scheduler)
- **Domain Category**: `SYSTEMS`
- **1-Sentence Description**: A time-slot oriented CLI task scheduling system in C using fixed memory lookup tables, collision-free slot indexing, and multi-attempt validation menus.
- **Key Technologies Used**: C, Fixed-size Multi-dimensional Arrays, String Manipulation, CLI Menus, In-Memory Slot Allocation *(+2: stdlib, stdio)*
- **Architecture Details**:
  - *Memory Management*: Static global memory tables (`char realtask[size][100]`), deterministic stack allocation, 0 temporary disk writes.
  - *Data Structures*: Fixed hourly slot lookup arrays and status masks (`int array[] = {1, 1, ...}`).
  - *Validation / Flow*: Interactive slot collision resolution, 3-attempt bounded validation retry system.
- **Verified Metrics & Technical Capabilities**:
  - 12 distinct hourly time slots (12 AM to 12 PM) with task allocation, relocation, deletion, and real-time availability filtering.
  - 100% deterministic memory footprint with zero memory allocation failure risk.
- **URLs**:
  - **GitHub URL**: `https://github.com/Naseer-fez/ToDoList`
  - **Demo URL**: None

---

### 10. Console Minesweeper Game (`MineSweper_game`)

- **Real Title**: Minesweeper (Console Game)
- **Domain Category**: `CREATIVE`
- **1-Sentence Description**: A terminal-based Minesweeper game engine built in C featuring pseudorandom 1D/2D grid mapping, stateful cell masking, collision-safe mine distribution, and replay mechanics.
- **Key Technologies Used**: C, Standard I/O, Pseudorandom Generation (`rand`/`srand`), Linear-to-2D Coordinate Projections, Stateful State Machines *(+2: time.h, stdlib.h)*
- **Architecture Details**:
  - *Memory Management*: In-memory static array state representation `int matrix[Totalgrids]` (0: Unopened, 1: Cleared Safe, 2: Mine), zero heap allocation overhead.
  - *Data Structures*: Flat 1D array mapped to 10-column dynamic terminal row projections.
  - *Game Loop & Validation*: Non-deterministic PRNG mine seeding with bounded retry input validation.
- **Verified Metrics & Technical Capabilities**:
  - Zero external runtime dependencies, 100% C standard library implementation.
  - Configurable grid size and density ratio with instant win/loss condition evaluation.
- **URLs**:
  - **GitHub URL**: `https://github.com/Naseer-fez/MineSweper_game`
  - **Demo URL**: None

---

### 11. Restaurant Order & Billing System (`Restaurant_Management_Demo`)

- **Real Title**: Restaurant_Management_Demo (Table Order & Billing System)
- **Domain Category**: `SYSTEMS`
- **1-Sentence Description**: A multi-table restaurant ordering and billing CLI application in C incorporating multi-dimensional array mapping, structured item catalogs, bubble sort synchronization, and itemized billing reports.
- **Key Technologies Used**: C, C Structs, 2D State Arrays, Dual-Array Bubble Sort, Multi-Table State Tracking *(+2: string.h, stdio.h)*
- **Architecture Details**:
  - *Memory Management*: Contiguous structured arrays (`typedef struct items { int id; char menu[50]; float prices; }`) and 2D integer matrices for table-to-item mapping (`int tabelorder[10][quantity]`).
  - *Algorithms & Data Structures*: Synchronized parallel bubble sort keeping item IDs and quantities sorted during order finalization, table occupancy bitmask arrays.
  - *Validation / Flow*: Duplicate table/item rejection, bounded input retries, aggregated bill summation.
- **Verified Metrics & Technical Capabilities**:
  - Manages up to 10 concurrent tables with up to 20 menu items per table.
  - Generates tabular formatted final billing reports across all active tables.
- **URLs**:
  - **GitHub URL**: `https://github.com/Naseer-fez/Restaurant_Management_Demo`
  - **Demo URL**: None

---

### 12. Hospital Bed Management System (`Hosplital_Managment`)

- **Real Title**: Hospital Bed Management System
- **Domain Category**: `SYSTEMS`
- **1-Sentence Description**: A console-based hospital bed occupancy and patient admission tracking system in C featuring 2D ward layout visualization, occupancy analytics, and circular historical logs.
- **Key Technologies Used**: C, Fixed-size Global State Arrays, 2D Terminal Ward Rendering, Occupancy Metrics Calculation, CLI Multi-Attempt Menus *(+2: string.h, stdio.h)*
- **Architecture Details**:
  - *Memory Management*: Static contiguous buffer arrays (`char patientsnames[Totalbeds][100]`, `int bedcount[Totalbeds]`), deterministic footprint, zero dynamic fragmentation.
  - *Data Structures & Analytics*: Flat array to 10x10 2D visual ward layout ('X' occupied, 'O' empty), occupancy rate percentage calculation, last-admitted and last-discharged tracking buffers.
  - *Validation / Flow*: Bed collision avoidance, bounded retry input handling, admission/discharge state transitions.
- **Verified Metrics & Technical Capabilities**:
  - 100-bed ward capacity management with real-time occupancy statistics and 2D matrix visual reporting.
- **URLs**:
  - **GitHub URL**: `https://github.com/Naseer-fez/Hosplital_Managment`
  - **Demo URL**: None

---

## Technical Insights & Portfolio Impact

1. **Systems & Low-Level Native Programming**:
   - `Taskbarengine` and `Livewallpaper` represent production-grade native Windows systems programming involving CBT hook injection into `explorer.exe`, DirectComposition 0-latency rendering, Direct3D 11 graphics pipelines, Rust FFI bridges with dynamic HLSL hot-reloading, and SEH watchdog timer fault isolation.
2. **C Memory Management & Data Structure Fundamentals**:
   - `Dates`, `Phone-Contract`, and `Student_Records` showcase deep mastery of manual memory management (`malloc`/`free`), raw pointer arithmetic, FFI pointer marshalling via `ctypes`, and custom linked list data structures (Doubly and Singly Linked Lists).
3. **High-Performance Concurrency & Benchmarking**:
   - `Api_RateLimiter` demonstrates multi-threaded concurrency controls, re-entrant locking (`RLock`), background daemon TTL thread cleaners, and rigorous load testing up to **100k client IP addresses** across **64 concurrent worker threads**.
4. **Algorithmic Rigor**:
   - `DSA-Journey` proves comprehensive algorithmic problem-solving ability across classic and advanced computing problems in C++, emphasizing optimal asymptotic time/space bounds over brute-force baselines.
