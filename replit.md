# Tesla Drag Racing Game

## Overview
A 3D drag racing game featuring Tesla Model Y vehicles, built with React Three Fiber (Three.js). Race head-to-head against an AI opponent on a quarter-mile drag strip.

## Current State
- Fully functional drag racing game with two Tesla Model Y vehicles
- Quarter-mile (402m) straight drag strip with lane markings
- Christmas tree staging lights system
- Player vs AI opponent racing
- Reaction time tracking and false start detection
- Elapsed time (E.T.) and trap speed display
- Win/lose determination based on finish times
- Post-processing visual effects (bloom, vignette)
- Tire smoke particle effects
- Dynamic engine sound

## Core Features
- **Vehicles**: Two Tesla Model Y 3D models - player (red) and opponent (blue)
- **Track**: Quarter-mile drag strip with barriers, lane markings, and finish line
- **Staging**: Christmas tree light sequence for authentic drag racing start
- **Physics**: Arcade-style acceleration physics for accessible gameplay
- **AI Opponent**: Configurable reaction time (0.15-0.25s) and competitive speed
- **UI**: Futuristic HUD with speed, progress bars, reaction time, E.T., and trap speed
- **Camera**: Chase camera (default) and side view (press C)
- **Effects**: Post-processing bloom/vignette, tire smoke particles
- **Audio**: Dynamic engine sound that changes with speed

## Project Architecture

### Client Structure
```
client/src/
├── App.tsx                    # Main game container
├── components/
│   └── game/
│       ├── DragStrip.tsx      # Quarter-mile drag strip track
│       ├── TeslaModelY.tsx    # Player vehicle with physics
│       ├── OpponentTesla.tsx  # AI opponent vehicle
│       ├── ChristmasTree.tsx  # Staging lights sequence
│       ├── RacingCamera.tsx   # Camera system (chase/side)
│       ├── HUD.tsx            # Speed/time/progress display
│       ├── Menu.tsx           # Start/results menu
│       ├── Environment.tsx    # Sky, lighting, scenery
│       ├── PostProcessing.tsx # Bloom/vignette visual effects
│       ├── TireSmoke.tsx      # Particle effects for tires
│       └── EngineSound.tsx    # Dynamic engine audio
├── lib/
│   └── stores/
│       ├── useRacing.tsx      # Drag race state (Zustand)
│       ├── useGame.tsx        # General game state
│       └── useAudio.tsx       # Audio state
└── public/
    ├── models/
    │   └── tesla-model-y.glb  # 3D car model
    ├── textures/              # Track and environment textures
    └── sounds/                # Audio files
```

### Game Flow
1. **Menu** - Start screen with race button
2. **Staging** - Cars move to start line, tree initializes
3. **Countdown** - Christmas tree lights cascade (stage → yellow → yellow → yellow)
4. **Racing** - Green light, cars accelerate to finish line
5. **Finished** - Winner determined, results displayed

### Controls
- **W / Arrow Up**: Accelerate (hold to launch when green)
- **A / Arrow Left**: Minor left lane adjustment
- **D / Arrow Right**: Minor right lane adjustment
- **C**: Toggle camera view (Chase / Side)

### Drag Race Mechanics
- **Reaction Time**: Time from green light to acceleration
- **False Start**: Launching before green results in disqualification
- **Elapsed Time (E.T.)**: Time from launch to crossing finish line
- **Trap Speed**: Speed when crossing finish line
- **Winner**: Determined by who crosses finish line first

### Style Guide
- Primary: #E82127 (Tesla red)
- Secondary: #1a237e (Opponent blue)
- Accent: #00D4FF (Electric blue)
- Background: #87CEEB (Sky blue)
- UI: #1A1A1A (Deep black)
- Success: #00FF00 (Green for winner/good reaction)

## Recent Changes
- January 2026: Complete pivot to drag racing format
  - Replaced oval track with quarter-mile drag strip
  - Added AI opponent Tesla vehicle
  - Implemented Christmas tree staging lights
  - Added reaction time and false start detection
  - Created elapsed time and trap speed tracking
  - Updated HUD with progress bars and race stats
  - Updated camera for drag racing views
  - Win/lose determination with results display

## Technologies
- React 18 with TypeScript
- React Three Fiber / Three.js for 3D rendering
- @react-three/drei for helpers
- @react-three/postprocessing for visual effects
- Zustand for state management
- Tailwind CSS for styling
