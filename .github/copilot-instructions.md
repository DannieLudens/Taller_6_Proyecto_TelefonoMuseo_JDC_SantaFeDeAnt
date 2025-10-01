# Museum Telephone Simulator - AI Coding Agent Instructions

## Project Overview
Interactive p5.js museum exhibit simulating a vintage 1980s-style cream telephone. Visitors pick up the handset, dial 4-digit numbers from a directory, and listen to audio narratives from 4 historical characters (5th pending). Built for Museo Juan del Corral in Santa Fe de Antioquia. Features immersive persona images with rounded masks and dynamic headset scaling.

## Architecture & Data Flow

### State Machine (STATES in sketch.js)
The entire application is controlled by a state machine with **10 states** (expanded from 8):
- `IDLE` → `DIAL_TONE` (lift handset + 500ms delay) → `DIALING` (entering digits) → `CALLING_RINGING` (ringing tone, NEW)
- `CALLING_INTRO` (character intro audio) → `CALLING_OPCIONES` (menu options, plays 2x with 3s pause)
- `WAITING_OPTION` (5s timeout for selection) → `CALLING_TEMA` (selected topic audio) → loops back to `CALLING_OPCIONES`
- `ERROR` (invalid number, continuous loop, NO auto-hangup) / `BUSY` (call ended)

**Critical**: All state changes must go through `changeState()` function which logs transitions. Audio playback and UI behavior are tightly coupled to `currentState`.

### Audio System Architecture
- **DTMF Tones**: Generated via p5.Oscillator arrays (`dtmfOscs`) - dual-tone frequencies for keypad feedback
- **System Sounds** (real MP3 files):
  - `pickup_phone.mp3`: Played when handset lifted (500ms delay before dial tone)
  - `hangup_phone.mp3`: Played when handset hung up
  - `error_call_phone.mp3`: Continuous loop for ERROR state (no auto-hangup, user must hang up manually)
- **Character Audio**: 4 characters fully implemented with real MP3 files:
  - `Per_1_Intro_MujerAnonColonia.mp3`, `Per_1_Opciones_MujerAnonColonia.mp3`, `Per_1_Tema_1/2/3_MujerAnonColonia.mp3`
  - `Per_2_*_CampesinoIndigenaDesplazado.mp3` (same structure)
  - `Per_3_*_AfroColonial.mp3` (same structure)
  - `Per_4_*_Sepulturero.mp3` (same structure)
  - 5th character pending audio files
- **Volume Control**: `masterVolume` (0-1) affects all audio sources. Must call `updateAllVolumes()` after changes.

### UI Components
1. **Wood Texture Background**: Pre-rendered canvas with grain effect (139, 90, 60 base color)
2. **Directory Panel** (left, 8% x, 15% y): 4 active characters with name/profession/4-digit phone numbers
3. **Telephone Base** (center, 50% x, 42% y - repositioned higher):
   - Trapezoid shape with rounded corners (cream 245, 240, 220)
   - Parallel shadow beneath (darker trapezoid at Y=300)
   - LCD screen displaying `dialedNumber`
   - 4x3 keypad grid with dark square buttons (50, 45, 40) and white text
4. **Handset** (lateral view, 50° rotation when lifted):
   - Two circular auriculares (85×100, 80×95) connected by 250-wide rectangular mango
   - Decorative lines on mango
   - **Dynamic Scaling**: Shrinks from 1.0 to 0.5 as it moves toward face (based on headsetX: 0→500)
   - Movement range: X (-300 to 500), Y (-400 to 200) - expanded for persona images
5. **Spiral Cable**: Bezier curve with sine wave perpendicular spiral effect
   - Two-layer rendering (dark border + cream center)
   - Rotation-aware anchor using trigonometry (cos/sin of headsetRotation)
   - Connects headset left auricular to phone base rear
6. **Horquilla/Soporte** (phone holder): Fixed-scale element with two vertical hooks and switch button
7. **Persona Images** (3-layer rendering system):
   - **Layer 1**: `persona_rostro.png` (80% x, 35% y) with **rounded rectangle mask** (30*scale corner radius) - NEW
   - **Layer 2**: Telephone components
   - **Layer 3**: `persona_mano.png` (same position as rostro)
   - Images scaled at 0.6 * scale, rendered in CENTER mode
8. **Ear Graphic**: Removed (replaced by persona images)
9. **Volume Slider** (85% x, 75% y): Custom-drawn, values stored in `volumeSliderBounds`
10. **Status Display** (bottom center): Shows state, instructions, and countdown timers

## Critical Workflows

### Dialing Sequence
1. User drags handset → `toggleHeadset()` → plays `pickup_phone.mp3` → 500ms delay → `changeState(DIAL_TONE)` → `playDialTone()`
2. Keypad presses → `pressKey()` → appends to `dialedNumber` → plays DTMF via `playDTMFTone(col, row)`
3. After 4 digits → 500ms delay → `checkNumber()` validates against `personajes[].telefono`
4. Match: `changeState(CALLING_RINGING)` → plays ringing tone → transitions to intro
5. `playIntroAudio()` → plays real MP3 intro → `.onended()` triggers `playOpcionesAudio()`
6. `playOpcionesAudio()` plays twice with 3s pause between, then → `changeState(WAITING_OPTION)`
7. No match: `changeState(ERROR)` → plays `error_call_phone.mp3` in continuous loop → NO auto-hangup, user must hang up manually

### Option Selection (Key Pattern)
- **Interruption Allowed**: Users can press 1/2/3 during `CALLING_OPCIONES` OR `WAITING_OPTION`
- After 2nd options playback → 5s timeout in `WAITING_OPTION` → auto-hangup if no selection
- Selection → `playTemaAudio(option)` → plays real MP3 tema → 3s pause → loops back to options (resets `opcionesPlayCount`)
- **Only** buttons 1, 2, 3 are active during option selection (see `mousePressed()` conditionals)

### Handset Lifecycle
- **Lift**: `headsetLifted=true`, plays pickup sound, animates via `targetHeadsetX/Y`, enables keypad, shows persona images
- **Drag**: `mouseDragged()` constrains to (-300→500, -400→200) scaled units, snaps to persona ear at <100px distance
- **Dynamic Scaling**: As headset moves right (toward face), `dynamicScale` decreases from 1.0 to 0.5 based on `map(headsetX, 0, 500*scale, 1.0, 0.5)`
- **Hang Up**: Drop near origin (<30px) → plays `hangup_phone.mp3` → `hangUp()` → resets all state variables
- **Error State**: User MUST manually hang up (no auto-hangup), error tone loops until handset returned

## Project-Specific Conventions

### Coordinate System
All drawing uses responsive scaling: `scale = min(width/1200, height/800)`. Positions are specified in "ideal" units (e.g., `150*scale`) rather than pixels. Always multiply hardcoded positions by `scale`.

### Timer Management
Timers increment per frame (~60fps = 16.67ms). Convert to seconds: `TIMEOUT / 16.67`. Two critical timers:
- `autoHangupTimer`: Tracks ERROR/BUSY states (NOTE: ERROR state NO LONGER auto-hangs up, user must manually hang up)
- `optionTimer`: Tracks WAITING_OPTION timeout (5000ms = 300 frames)

### Audio Placeholder Pattern
**DEPRECATED**: Real audio is now fully integrated using MP3 files:
- Character audios loaded in `preload()`: `personajeAudios[1-4].{intro, opciones, tema1, tema2, tema3}`
- System sounds: `pickupSound`, `hangupSound`, `errorCallSound`
- All audio uses `.onended()` callbacks for state transitions
- No more setTimeout simulations

### Touch vs Mouse
All mouse events have mirror `touch*()` functions (lines 1082-1096) that call mouse handlers and `return false` to prevent default scrolling. Maintain this pattern for mobile compatibility.

## External Dependencies
- **p5.js v1.11.10**: Core graphics/animation framework
- **p5.sound.js v1.11.10**: Provides `p5.Oscillator` for DTMF tones and `.sound` file loading (when implemented)
- Loaded from CDN in `index.html`, no build step required

## File Organization
**Main Repository**: `Taller_6_ProyectoVoces/` contains two independent projects:

### TelefonoMuseo/ (Primary Project)
- `sketch.js`: Entire application logic (~1400 lines, monolithic)
- `index.html`: Minimal HTML shell, CDN script tags only
- `style.css`: Basic resets (hide p5 default buttons, set background)
- `assets/sounds/`: Real MP3 files
  - `pickup_phone.mp3`, `hangup_phone.mp3`, `error_call_phone.mp3`
  - `personajes/Per_{1-4}_{Intro,Opciones,Tema_1/2/3}_[PersonaName].mp3` (5th character pending)
- `assets/images/`: Persona interaction images
  - `persona_rostro.png`: Face image with rounded mask (80% x, 35% y)
  - `persona_mano.png`: Hand overlay (same position as rostro)

### VitrinaMuseo/ (Secondary Project)
- Separate interactive display case system with automatic proximity detection
- Similar p5.js structure but different interaction model (passive vs active)

## Running & Testing
1. **Navigate to Project**: `cd TelefonoMuseo/` (for phone) or `cd VitrinaMuseo/` (for display case)
2. **Local Server**: Use Live Server extension or `python -m http.server 8000` (required for audio loading)
3. **Test Sequence (Phone)**: Lift handset → Dial `1234` → Wait for intro → Press 1/2/3 during options → Verify loop back
4. **Test Sequence (Vitrina)**: Mouse over display case → Wait 5s → Observe automatic narrative sequence
5. **Audio Context**: Click anywhere first to satisfy browser autoplay policies (`startAudioContext()`)
6. **Console Logging**: All state changes and audio events log to console for debugging

## Known Patterns to Preserve
- **State-guarded input**: Keypad `canPress` logic (lines 444-452) differs by state - maintain these conditionals
- **Lerp animations**: `headsetX/Y` and `earAlpha` use `lerp()` for smooth transitions - keep easing factor ~0.1-0.15
- **Button highlighting**: Hovered buttons check both mouse distance AND `canPress` state - don't separate these checks
- **Volume propagation**: Any new audio source must multiply by `masterVolume` and update in `updateAllVolumes()`

## What NOT to Change
- State machine constants in `STATES` object (referenced throughout codebase)
- DTMF frequency arrays `dtmfFreqs` (standard telephone tones)
- Personajes array structure (5 entries with `telefono` as 4-digit strings)
- Timer thresholds (carefully tuned to museum visitor behavior expectations)
