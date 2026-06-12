import { AmbientBackground } from './components/AmbientBackground'
import { Schemes } from './components/Schemes'
import { Dossier } from './components/Dossier'
import { Footer } from './components/Footer'
import { Preloader } from './components/v2/Preloader'
import { HeroV2 } from './components/v2/HeroV2'
import { SocialLinksV2 } from './components/v2/SocialLinksV2'
import { PixelImp } from './components/v2/PixelImp'
import { DeckSection } from './components/v2/DeckSection'

function App() {
  return (
    <>
      <Preloader />
      <AmbientBackground />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <DeckSection>
          <HeroV2 />
        </DeckSection>
        <DeckSection>
          <Schemes />
        </DeckSection>
        <DeckSection>
          <Dossier />
        </DeckSection>
        <SocialLinksV2 />
        <Footer />
        <PixelImp />
      </main>
    </>
  )
}

export default App
