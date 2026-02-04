import Piano from './components/Piano'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl sm:text-4xl font-bold text-white text-center mb-3 sm:mb-8 landscape:text-xl landscape:mb-2">
          Web Piano
        </h1>
        <Piano />
      </div>
    </div>
  )
}

export default App
