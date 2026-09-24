import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import TrustedApps from './sections/TrustedApps'
import Workflow from './sections/Workflow'
import DeveloperTools from './sections/DeveloperTools'
import Infrastructure from './sections/Infrastructure'
import Community from './sections/Community'
import ClosingCta from './sections/ClosingCta'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <>
      <Navbar />

      <main id="main-content">
        <Hero />
        <TrustedApps />
        <Workflow />
        <DeveloperTools />
        <Infrastructure />
        <Community />
        <ClosingCta />
      </main>
      <Footer />
    </>
  )
}

export default App