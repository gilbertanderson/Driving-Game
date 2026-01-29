# Tesla Model Y Racing Game

## Overview
A 3D racing game featuring the Tesla Model Y as the playable vehicle, built with React Three Fiber (Three.js) for web-based 3D graphics and physics simulation.

## Current State
- Fully functional racing game with Tesla Model Y
- 3-lap race on an oval track with barriers
- Working vehicle physics (acceleration, braking, steering)
- Two camera modes: Chase and Cockpit view
- HUD with speedometer and lap timer
- Menu system with race results
- Post-processing visual effects (bloom, vignette)
- Tire smoke particle effects when driving
- Dynamic engine sound based on speed
- Speed boost zones on the track
- Race countdown animation (3-2-1-GO)

## Core Features
- **Vehicle**: Tesla Model Y 3D model with realistic controls
- **Track**: Oval racing circuit with asphalt texture, barriers, checkpoints, and speed boost zones
- **Physics**: Simple arcade physics for accessible gameplay with speed boost mechanics
- **UI**: Futuristic HUD with speed, lap counter, and timer
- **Camera**: Chase camera (default) and cockpit view (press C)
- **Effects**: Post-processing bloom/vignette, tire smoke particles
- **Audio**: Dynamic engine sound that changes with speed

## Project Architecture

### Client Structure
```
client/src/
├── App.tsx                    # Main game container
├── components/
│   └── game/
│       ├── Track.tsx          # Racing track geometry and barriers
│       ├── TeslaModelY.tsx    # Vehicle component with physics
│       ├── RacingCamera.tsx   # Camera system (chase/cockpit)
│       ├── HUD.tsx            # Speed/lap display overlay
│       ├── Menu.tsx           # Start/finish menu
│       ├── Environment.tsx    # Sky, lighting, scenery
│       ├── LapDetector.tsx    # Lap completion detection
│       ├── PostProcessing.tsx # Bloom/vignette visual effects
│       ├── TireSmoke.tsx      # Particle effects for tires
│       ├── Countdown.tsx      # 3-2-1-GO race start animation
│       ├── SpeedBoostZones.tsx# Green boost pads on track
│       └── EngineSound.tsx    # Dynamic engine audio
├── lib/
│   ├── boostZones.ts          # Shared boost zone configuration
│   └── stores/
│       ├── useRacing.tsx      # Racing game state (Zustand)
│       ├── useGame.tsx        # General game state
│       └── useAudio.tsx       # Audio state
└── public/
    ├── models/
    │   └── tesla-model-y.glb  # 3D car model
    ├── textures/              # Track and environment textures
    └── sounds/                # Audio files (background, effects)
```

### Controls
- **W / Arrow Up**: Accelerate
- **S / Arrow Down**: Brake/Reverse
- **A / Arrow Left**: Steer Left
- **D / Arrow Right**: Steer Right
- **C**: Toggle camera view

### Style Guide
- Primary: #E82127 (Tesla red)
- Secondary: #393C41 (dark grey)
- Accent: #FFFFFF (white)
- Background: #87CEEB (sky blue)
- UI: #1A1A1A (deep black)
- Highlights: #00D4FF (electric blue)

## Recent Changes
- January 2026: Enhanced visual and audio experience
  - Added post-processing effects (bloom, vignette)
  - Added tire smoke particle effects
  - Added dynamic engine sound based on speed
  - Added speed boost zones on the track
  - Added race countdown animation (3-2-1-GO)
- January 2026: Initial implementation with all core features
  - Created Tesla Model Y racing game
  - Implemented track with barriers and checkpoints
  - Added vehicle physics and controls
  - Built HUD with speedometer and lap timer
  - Added camera toggle (chase/cockpit views)
  - Generated Tesla Model Y 3D model

## Technologies
- React 18 with TypeScript
- React Three Fiber / Three.js for 3D rendering
- @react-three/drei for helpers
- Zustand for state management
- Tailwind CSS for styling
