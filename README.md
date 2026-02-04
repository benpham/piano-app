# Web Piano App

A modern, interactive web-based piano application built with React, Tailwind CSS, and Tone.js featuring high-quality grand piano samples.

## Features

- **2 Octaves**: Full 2-octave keyboard (F3 to E5)
- **High-Quality Sound**: Uses Salamander grand piano samples from Tone.js CDN
- **Keyboard Support**: Play with your computer keyboard using keys: `A W S E D F T G Y H U J K O L P ; '`
- **Mouse/Touch Support**: Click or tap the virtual piano keys
- **Sustain Pedal**: Toggle sustain mode with the button or press `SPACE`
- **Visual Feedback**: Keys highlight when pressed (blue for white keys, purple for black keys)
- **Modern UI**: Beautiful gradient background and responsive design

## Setup Instructions

### Prerequisites

Make sure you have Node.js (version 16 or higher) installed on your machine.

### Installation

1. Navigate to the project directory:
```bash
cd piano-app
```

2. Install all dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## Usage

### Keyboard Controls

- **Lower Register (F3-D4)**: `A` `W` `S` `E` `D` `F` `T` `G` `Y` `H` `U`
  - White keys: `A` (F3), `S` (G3), `D` (A3), `T` (B3), `G` (C4), `H` (D4)
  - Black keys: `W` (F#3), `E` (G#3), `F` (A#3), `Y` (C#4), `U` (D#4)
- **Upper Register (F#4-E5)**: `O` `P` `J` `K` `L` `;` `'`
  - White keys: `J` (A4), `K` (B4), `L` (C5), `;` (D5), `'` (E5)
  - Black keys: `O` (F#4), `P` (G#4)
- **SPACE**: Toggle sustain on/off

### Mouse/Touch

- Click or tap any key on the virtual piano to play notes
- Click the "Sustain" button to toggle sustain mode

### Sustain Mode

When sustain is enabled, notes will continue to ring until sustain is turned off, simulating a piano's sustain pedal.

## Build for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Technologies Used

- **React 18**: UI framework
- **Vite**: Build tool and development server
- **Tailwind CSS**: Styling and responsive design
- **Tone.js**: Web Audio framework for high-quality sound synthesis
- **Salamander Piano Samples**: Professional grand piano recordings

## Project Structure

```
piano-app/
├── src/
│   ├── components/
│   │   └── Piano.jsx          # Main piano component
│   ├── App.jsx                # Root application component
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles with Tailwind
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── postcss.config.js         # PostCSS configuration
```

## License

MIT
