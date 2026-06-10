import { AmbientBackground } from './components/AmbientBackground'
import { Hero } from './components/Hero'
import { SocialLinks } from './components/SocialLinks'
import { Schemes } from './components/Schemes'
import { Dossier } from './components/Dossier'
import { Footer } from './components/Footer'

function App() {
  return (
    <>
      <AmbientBackground />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <SocialLinks />
        <Schemes />
        <Dossier />
        <Footer />
      </main>
    </>
  )
}

export default App
