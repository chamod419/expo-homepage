import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import TrustedApps from './sections/TrustedApps'
import Workflow from './sections/WorkFlow'
import './App.css'

function App() {
  return (
    <>
      <Navbar />

      <main id="main-content">
        <Hero />
        <TrustedApps />
        <Workflow />
      </main>
    </>
  )
}

export default App