# 🏛️ Museo Juan del Corral - Interactive Exhibits

## Project Overview
**Two independent p5.js museum exhibits** for Museo Juan del Corral (Santa Fe de Antioquia):
- **📞 TelefonoMuseo**: Active exhibit - vintage phone to "call" 4 historical characters
- **🏛️ VitrinaMuseo**: Passive exhibit - smart display case with 3 heritage objects

**Academic Context**: Taller 6 - Museum UX (Universidad Pontificia Bolivariana)

## Architecture: Modular p5.js Pattern

### Module Loading Order (Critical)
Both projects use **dependency-ordered script loading** in `index.html`:
```html
<!-- TelefonoMuseo: 9 modules -->
<script src="js/constants.js"></script>      <!-- 1. No deps -->
<script src="js/background.js"></script>     <!-- 2. p5 only -->
<script src="js/audio.js"></script>          <!-- 3. constants -->
<script src="js/state.js"></script>          <!-- 4. constants, audio -->
<script src="js/ui-telefono.js"></script>    <!-- 5. constants, state, audio -->
<script src="js/ui-headset.js"></script>     <!-- 6. state, audio -->
<script src="js/ui-components.js"></script>  <!-- 7. constants, state -->
<script src="js/interactions.js"></script>   <!-- 8. all UI modules -->
<script src="sketch.js"></script>            <!-- 9. Coordinator (preload/setup/draw) -->

<!-- VitrinaMuseo: 8 modules + sketch_new.js -->
```

**Rule**: Variables declared with `let`/`const` at module top-level are **global** across all scripts. No imports/exports - pure script concatenation model.

### State Machine Architecture (Both Projects)
**Central pattern**: All behavior controlled by `STATES` enum + `changeState()` function:
```javascript
// TelefonoMuseo: 10 states for phone call lifecycle
const STATES = {
  IDLE: 'idle',
  DIAL_TONE: 'dial_tone',
  DIALING: 'dialing',
  CALLING_RINGING: 'calling_ringing',
  CALLING_INTRO: 'calling_intro',
  CALLING_OPCIONES: 'calling_opciones',  // Plays 2x
  WAITING_OPTION: 'waiting_option',      // 5s timeout
  CALLING_TEMA: 'calling_tema',
  ERROR: 'error',  // NO auto-hangup (user must manually hang up)
  BUSY: 'busy'
};

// VitrinaMuseo: 5 states for sequential narratives
const STATES = {
  IDLE: 'idle',
  DETECTING: 'detecting',               // 5s proximity timer
  PLAYING_NARRATIVE: 'playing',         // Per-object audio
  TRANSITIONING: 'transitioning',       // 2s pause between objects
  COOLDOWN: 'cooldown'                  // 5s before reset
};
```

**Critical**: State changes logged via `changeState()` in `state.js`. Audio playback callbacks (`.onended()`) trigger subsequent state transitions.

### Audio System (p5.sound.js)
**Two audio sources**:
1. **Synthesized tones** (`p5.Oscillator`) - TelefonoMuseo DTMF/dial tones
   ```javascript
   // Created in audio.js, stored in arrays
   dtmfOscs[row][col] = new p5.Oscillator(dtmfFreqs[row][col]);
   dialToneOsc = new p5.Oscillator(440);
   ```
2. **MP3 files** (`loadSound()` in `preload()`) - All narratives
   ```javascript
   // TelefonoMuseo: 5 audios per character (intro, opciones, tema1/2/3)
   personajeAudios[1].intro = loadSound('assets/sounds/personajes/Per_1_Intro_MujerAnonColonia.mp3');
   
   // VitrinaMuseo: 1 narrative per object
   objetos[0].narrativa = loadSound('assets/sounds/Camisa Indigena con ilustraciones de mapa.mp3');
   ```

**Volume pattern**: `masterVolume` (0-1) multiplied across all sources. Call `updateAllVolumes()` after changes.

## TelefonoMuseo: Critical Workflows

### Phone Call Lifecycle
```
Lift handset → pickup_phone.mp3 (500ms) → DIAL_TONE
↓
Enter 4 digits (DTMF feedback) → DIALING → checkNumber()
↓
Valid: CALLING_RINGING → ringing tone (3s) → CALLING_INTRO
Invalid: ERROR → error_call_phone.mp3 (loops forever, NO auto-hangup)
↓
Intro audio → .onended() → CALLING_OPCIONES (plays 2x with 3s pause)
↓
WAITING_OPTION (5s timeout) ← User presses 1/2/3 during opciones OR waiting
↓
CALLING_TEMA → tema audio → 3s pause → back to CALLING_OPCIONES (resets counter)
```

### Handset Physics (ui-headset.js)
- **Draggable**: `mouseDragged()` constrains to (-300→500, -400→200) in scaled units
- **Dynamic scaling**: `map(headsetX, 0, 500*scale, 1.0, 0.5)` shrinks as it moves right
- **Snap behavior**: <100px from persona ear → auto-position
- **Hang up**: <30px from origin → `hangUp()` → reset all state

### Dual Phone Styles (ui-telefono.js)
Toggle between `phoneStyle = 'buttons'` or `'rotary'`:
- **Buttons**: 4×3 grid keypad, instant digit entry
- **Rotary**: Draggable dial, digit on return (isReturning=true)

## VitrinaMuseo: Layout System

### Three Interchangeable Layouts (ui-vitrina.js)
```javascript
const LAYOUTS = { INDIVIDUAL: 1, HORIZONTAL: 2, LEVELS: 3 };

// Layout 1: 3 separate vitrines, individual detection per vitrine
if (currentLayout === LAYOUTS.INDIVIDUAL) {
  individualDetectionTimers[detectedVitrineIndex]++;
  // Plays ONLY that vitrine's narrative
}

// Layouts 2-3: Unified vitrine, sequential playback all 3 objects
else {
  detectionTimer++;  // Global timer
  // Plays object 0 → 1 → 2 in sequence
}
```

**LED Lighting** (ui-vitrina.js):
- Idle: 25% intensity (`LIGHT_IDLE`)
- Active: 65% intensity (`LIGHT_ACTIVE`)
- Smooth lerp transitions: `lights[i].current = lerp(current, target, 0.1)`

**Bocinas (Speakers)**:
- Layout 1: 3 individual speakers with LED per vitrine
- Layouts 2-3: 1 shared speaker with pulsing LED during playback

## Responsive Scaling Convention

**Both projects** use ideal coordinate system:
```javascript
let scaleRatio = min(width / 1200, height / 800);
// All positions multiplied by scaleRatio
drawRect(150 * scaleRatio, 200 * scaleRatio, 100 * scaleRatio, 80 * scaleRatio);
```

**Never** hardcode pixel values - always scale by `scaleRatio`.

## Timer Management Pattern

**Frame-based timers** (60fps assumed):
```javascript
// Increment per frame in draw() loop
detectionTimer++;

// Convert to seconds for threshold checks
if (detectionTimer > DETECTION_THRESHOLD / 16.67) { // 5000ms / 16.67 = 300 frames
  changeState(STATES.PLAYING_NARRATIVE);
}
```

**Critical timers**:
- TelefonoMuseo: `autoHangupTimer`, `optionTimer`
- VitrinaMuseo: `detectionTimer`, `individualDetectionTimers[]`

## Touch Support Pattern

**All mouse handlers mirrored**:
```javascript
function touchStarted() {
  mousePressed();
  return false; // Prevent default scroll
}
function touchMoved() {
  mouseDragged();
  return false;
}
```

Maintain this for mobile compatibility.

## Development Workflow

### Local Server (Required)
```powershell
# Navigate to project
cd TelefonoMuseo  # or VitrinaMuseo

# Start server (audio loading requires HTTP)
python -m http.server 8000
# OR use Live Server extension

# Open: http://localhost:8000
```

### Testing Checklist
**TelefonoMuseo**:
1. Click anywhere (audio context)
2. Drag handset → verify pickup sound + dial tone
3. Dial `1234` → verify ringing → intro
4. Press 1/2/3 during opciones → verify tema playback → loop back
5. Dial invalid → verify error loop (manual hangup required)
6. Toggle phone style → test rotary dial

**VitrinaMuseo**:
1. Mouse over vitrina → verify 5s detection timer
2. Verify sequential playback: Object 1 → 2 → 3
3. Test layout switching (1/2/3 keys)
4. Verify LED intensity changes
5. Check bocina LED pulsing in layouts 2-3

### Console Logging
All state changes and audio events logged:
```javascript
console.log(`Estado: ${currentState} -> ${newState}`);
console.log(`✓ Audio ${i+1} cargado: ${objetos[i].nombre}`);
```

## Asset Organization

```
TelefonoMuseo/
├── assets/
│   ├── images/
│   │   ├── persona_rostro.png    # 80% x, 35% y, rounded mask
│   │   └── persona_mano.png      # Same position, overlay
│   └── sounds/
│       ├── pickup_phone.mp3
│       ├── hangup_phone.mp3
│       ├── error_call_phone.mp3
│       └── personajes/
│           └── Per_{1-4}_{Intro,Opciones,Tema_1/2/3}_{PersonaName}.mp3

VitrinaMuseo/
├── assets/
│   ├── images/
│   │   ├── Obj_Camisa.png        # Preserved aspect ratio
│   │   ├── Obj_Mascara.png
│   │   └── Obj_Muneco.png
│   └── sounds/
│       ├── Camisa Indigena con ilustraciones de mapa.mp3
│       ├── Mascara de los diablitos celebracion de diciembre.mp3
│       └── Muñeco curandero de la cultura cuna para los enfermos.mp3
```

## What NOT to Change

1. **State machine constants** (`STATES` object) - referenced everywhere
2. **Module loading order** in `index.html` - breaks dependencies
3. **DTMF frequencies** (`dtmfFreqs`) - standard telephone tones
4. **Timer thresholds** - tuned to museum visitor behavior
5. **`personajes` array structure** - 4-digit `telefono` strings (TelefonoMuseo)
6. **`objetos` array structure** - `nombre`, `narrativa`, `posX` (VitrinaMuseo)

## Common Patterns to Preserve

**Lerp animations**:
```javascript
headsetX = lerp(headsetX, targetHeadsetX, 0.15);  // Smooth easing
earAlpha = lerp(earAlpha, targetAlpha, 0.08);     // Fade in/out
```

**State-guarded input**:
```javascript
let canPress = (currentState === STATES.DIALING || 
                currentState === STATES.CALLING_OPCIONES || 
                currentState === STATES.WAITING_OPTION);
if (canPress && dist(mouseX, mouseY, btnX, btnY) < buttonSize/2) {
  pressKey(key);
}
```

**Volume propagation**:
```javascript
function updateAllVolumes() {
  if (pickupSound) pickupSound.setVolume(masterVolume);
  if (currentAudio) currentAudio.setVolume(masterVolume);
  // Update ALL audio sources
}
```

## Known Issues / Future Work

- **5th character** in TelefonoMuseo pending audio files
- **Mobile responsive** needs improvement (touch drag precision)
- **Arduino integration** for VitrinaMuseo proximity sensor (currently mouse-simulated)

## Documentation References

- **TelefonoMuseo/README.md**: Complete feature list, architecture diagrams
- **VitrinaMuseo/docs/**: Version history (v2.0 → v2.5)
  - `REFACTORIZACION_V2.md`: Modularization details
  - `MEJORAS_BOCINAS_VITRINAS_v2.5.md`: Latest layout changes
