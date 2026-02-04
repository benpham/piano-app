import { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'

const Piano = () => {
  const [activeKeys, setActiveKeys] = useState(new Set())
  const [sustain, setSustain] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
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

    samplerRef.current = sampler

    return () => {
      sampler.dispose()
    }
  }, [])

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
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          {isLoaded ? (
            <span className="text-green-600 font-semibold">Ready to play!</span>
          ) : (
            <span className="text-orange-600">Loading piano samples...</span>
          )}
        </div>
        <button
          onClick={toggleSustain}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
            sustain
              ? 'bg-purple-600 text-white shadow-lg scale-105'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Sustain {sustain ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Piano Keyboard */}
      <div className="relative bg-gray-900 p-4 rounded-lg" style={{ height: '300px' }}>
        {/* White Keys */}
        <div className="flex gap-1 h-full">
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
                className={`flex-1 rounded-b-lg cursor-pointer transition-all duration-75 border-2 border-gray-300 flex flex-col justify-end items-center pb-4 ${
                  isActive
                    ? 'bg-gradient-to-b from-blue-400 to-blue-500 shadow-lg scale-95'
                    : 'bg-gradient-to-b from-white to-gray-100 hover:from-gray-50 hover:to-gray-200'
                }`}
                style={{ minWidth: '40px' }}
              >
                <div className="text-xs font-semibold text-gray-600 mb-1">
                  {note}
                </div>
                {keyboardHint && (
                  <div className={`text-lg font-bold ${isActive ? 'text-white' : 'text-blue-600'}`}>
                    {keyboardHint}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Black Keys */}
        <div className="absolute top-4 left-4 right-4 h-3/5 pointer-events-none">
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
                className={`absolute rounded-b-lg cursor-pointer transition-all duration-75 pointer-events-auto flex flex-col justify-end items-center pb-3 ${
                  isActive
                    ? 'bg-gradient-to-b from-purple-600 to-purple-700 shadow-xl scale-95'
                    : 'bg-gradient-to-b from-gray-800 to-black hover:from-gray-700'
                }`}
                style={{
                  left: `${position}%`,
                  width: '50px',
                  height: '100%',
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="text-xs font-semibold text-white mb-1">
                  {note}
                </div>
                {keyboardHint && (
                  <div className="text-sm font-bold text-yellow-300">
                    {keyboardHint}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p className="mb-2">
          Use your keyboard: <span className="font-mono bg-gray-100 px-2 py-1 rounded">A W S E D F T G Y H U J K O L P ; '</span>
        </p>
        <p>
          Press <span className="font-mono bg-gray-100 px-2 py-1 rounded">SPACE</span> to toggle sustain
        </p>
      </div>
    </div>
  )
}

export default Piano
