import { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'

const Piano = () => {
  const [activeKeys, setActiveKeys] = useState(new Set())
  const [sustain, setSustain] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [volume, setVolume] = useState(70)
  const samplerRef = useRef(null)
  const sustainedNotesRef = useRef(new Set())

  // Define the notes for 2 octaves starting at F3
  const notes = [
    'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4',
    'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'E5'
  ]

  // Keyboard mapping - computer keys to notes
  const keyMap = {
    'a': 'F3',  'w': 'F#3', 's': 'G3',  'e': 'G#3',
    'd': 'A3',  'f': 'A#3', 't': 'B3',  'g': 'C4',
    'y': 'C#4', 'h': 'D4',  'u': 'D#4', 'j': 'A4',
    'k': 'B4',  'o': 'F#4', 'l': 'C5',  'p': 'G#4',
    ';': 'D5',  "'": 'E5'
  }

  // Check if a note is a black key
  const isBlackKey = (note) => note.includes('#')

  // Get the white key index for positioning black keys
  const getWhiteKeyIndex = (note) => {
    const whiteNotes = notes.filter(n => !isBlackKey(n))
    return whiteNotes.indexOf(note)
  }

  // Initialize Tone.js Sampler
  useEffect(() => {
    const sampler = new Tone.Sampler({
      urls: {
        A0: "A0.mp3",
        C1: "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        A1: "A1.mp3",
        C2: "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        A2: "A2.mp3",
        C3: "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
        C6: "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        A6: "A6.mp3",
        C7: "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        A7: "A7.mp3",
        C8: "C8.mp3"
      },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      onload: () => {
        setIsLoaded(true)
      }
    }).toDestination()

    // Set initial volume (70% = -4.5dB approximately)
    sampler.volume.value = Tone.gainToDb(volume / 100)

    samplerRef.current = sampler

    return () => {
      sampler.dispose()
    }
  }, [])

  // Update volume when slider changes
  useEffect(() => {
    if (samplerRef.current) {
      samplerRef.current.volume.value = Tone.gainToDb(volume / 100)
    }
  }, [volume])

  // Play a note
  const playNote = (note) => {
    if (samplerRef.current && isLoaded) {
      samplerRef.current.triggerAttack(note)
      setActiveKeys(prev => new Set(prev).add(note))
      if (sustain) {
        sustainedNotesRef.current.add(note)
      }
    }
  }

  // Stop a note
  const stopNote = (note) => {
    if (samplerRef.current && isLoaded) {
      if (!sustain || !sustainedNotesRef.current.has(note)) {
        samplerRef.current.triggerRelease(note)
        setActiveKeys(prev => {
          const newSet = new Set(prev)
          newSet.delete(note)
          return newSet
        })
      }
    }
  }

  // Handle sustain toggle
  const toggleSustain = () => {
    const newSustain = !sustain
    setSustain(newSustain)

    if (!newSustain && samplerRef.current) {
      // Release all sustained notes
      sustainedNotesRef.current.forEach(note => {
        samplerRef.current.triggerRelease(note)
      })
      sustainedNotesRef.current.clear()
      setActiveKeys(new Set())
    }
  }

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return
      const key = e.key.toLowerCase()
      const note = keyMap[key]
      if (note) {
        e.preventDefault()
        playNote(note)
      }
      // Spacebar for sustain
      if (key === ' ') {
        e.preventDefault()
        toggleSustain()
      }
    }

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase()
      const note = keyMap[key]
      if (note) {
        e.preventDefault()
        stopNote(note)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [sustain, isLoaded])

  // Get keyboard hint for a note
  const getKeyboardHint = (note) => {
    const entry = Object.entries(keyMap).find(([_, n]) => n === note)
    return entry ? entry[0].toUpperCase() : ''
  }

  // Get position for black keys
  const getBlackKeyPosition = (note) => {
    // Map each black key to its position relative to white keys
    const blackKeyPositions = {
      'F#3': 0, 'G#3': 1, 'A#3': 2,
      'C#4': 4, 'D#4': 5,
      'F#4': 7, 'G#4': 8, 'A#4': 9,
      'C#5': 11, 'D#5': 12
    }

    const position = blackKeyPositions[note]
    return position * 100 / 14 + 100 / 14 * 0.7
  }

  return (
    <div className="relative bg-white rounded-2xl shadow-2xl p-4 sm:p-8 landscape:p-3">
      {/* Controls */}
      <div className="flex justify-between items-center mb-4 sm:mb-6 landscape:mb-2">
        <div className="text-xs sm:text-sm text-gray-600 landscape:text-xs">
          {isLoaded ? (
            <span className="text-green-600 font-semibold">Ready to play!</span>
          ) : (
            <span className="text-orange-600">Loading...</span>
          )}
        </div>
        <button
          onClick={toggleSustain}
          className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm landscape:px-3 landscape:py-1.5 landscape:text-xs ${
            sustain
              ? 'bg-purple-600 text-white shadow-lg scale-105'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Sustain {sustain ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Piano Keyboard */}
      <div className="relative bg-gray-900 p-2 sm:p-4 rounded-lg landscape:p-2" style={{ height: 'clamp(200px, 50vh, 400px)' }}>
        {/* White Keys */}
        <div className="flex gap-0.5 sm:gap-1 h-full justify-center">
          {notes.filter(note => !isBlackKey(note)).map((note) => {
            const isActive = activeKeys.has(note)
            const keyboardHint = getKeyboardHint(note)

            return (
              <div
                key={note}
                onMouseDown={() => playNote(note)}
                onMouseUp={() => stopNote(note)}
                onMouseLeave={() => stopNote(note)}
                onTouchStart={(e) => {
                  e.preventDefault()
                  playNote(note)
                }}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  stopNote(note)
                }}
                className={`flex-1 rounded-b-lg cursor-pointer transition-all duration-75 border border-gray-300 sm:border-2 flex flex-col justify-end items-center pb-2 sm:pb-4 landscape:pb-1 ${
                  isActive
                    ? 'bg-gradient-to-b from-blue-400 to-blue-500 shadow-lg scale-95'
                    : 'bg-gradient-to-b from-white to-gray-100 hover:from-gray-50 hover:to-gray-200'
                }`}
                style={{ minWidth: '30px', maxWidth: '60px' }}
              >
                <div className="text-[10px] sm:text-xs font-semibold text-gray-600 mb-0.5 sm:mb-1 landscape:hidden">
                  {note}
                </div>
                {keyboardHint && (
                  <div className={`text-sm sm:text-lg font-bold landscape:text-xs ${isActive ? 'text-white' : 'text-blue-600'}`}>
                    {keyboardHint}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Black Keys */}
        <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 landscape:top-2 landscape:left-2 landscape:right-2 h-3/5 pointer-events-none">
          {notes.filter(note => isBlackKey(note)).map((note) => {
            const isActive = activeKeys.has(note)
            const keyboardHint = getKeyboardHint(note)
            const position = getBlackKeyPosition(note)

            return (
              <div
                key={note}
                onMouseDown={() => playNote(note)}
                onMouseUp={() => stopNote(note)}
                onMouseLeave={() => stopNote(note)}
                onTouchStart={(e) => {
                  e.preventDefault()
                  playNote(note)
                }}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  stopNote(note)
                }}
                className={`absolute rounded-b-lg cursor-pointer transition-all duration-75 pointer-events-auto flex flex-col justify-end items-center pb-1 sm:pb-3 landscape:pb-1 ${
                  isActive
                    ? 'bg-gradient-to-b from-purple-600 to-purple-700 shadow-xl scale-95'
                    : 'bg-gradient-to-b from-gray-800 to-black hover:from-gray-700'
                }`}
                style={{
                  left: `${position}%`,
                  width: 'clamp(35px, 5vw, 50px)',
                  height: '100%',
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="text-[10px] sm:text-xs font-semibold text-white mb-0.5 sm:mb-1 landscape:hidden">
                  {note}
                </div>
                {keyboardHint && (
                  <div className="text-xs sm:text-sm font-bold text-yellow-300 landscape:text-[10px]">
                    {keyboardHint}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-3 sm:mt-6 text-center text-xs sm:text-sm text-gray-600 landscape:mt-2 landscape:hidden">
        <p className="mb-2">
          Use your keyboard: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-[10px] sm:text-xs">A W S E D F T G Y H U J K O L P ; '</span>
        </p>
        <p>
          Press <span className="font-mono bg-gray-100 px-2 py-1 rounded text-[10px] sm:text-xs">SPACE</span> to toggle sustain
        </p>
      </div>

      {/* Volume Control */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 landscape:bottom-2 landscape:right-2 flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg shadow-md">
        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
        </svg>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-20 sm:w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          style={{
            background: `linear-gradient(to right, rgb(147 51 234) 0%, rgb(147 51 234) ${volume}%, rgb(229 231 235) ${volume}%, rgb(229 231 235) 100%)`
          }}
        />
        <span className="text-xs font-semibold text-gray-600 w-8">{volume}%</span>
      </div>
    </div>
  )
}

export default Piano
