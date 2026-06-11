import { AmbientBackground } from './components/AmbientBackground'
import { Schemes } from './components/Schemes'
import { Dossier } from './components/Dossier'
import { Footer } from './components/Footer'
import { Preloader } from './components/v2/Preloader'
import { HeroV2 } from './components/v2/HeroV2'
import { SocialLinksV2 } from './components/v2/SocialLinksV2'
import { Lightning } from './components/v2/Lightning'
import { PixelImp } from './components/v2/PixelImp'

function App() {
  return (
    <>
      <Preloader />
      <AmbientBackground />
      {/* Глобальная молния — живёт за контентом по всему сайту */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          opacity: 0.5,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <Lightning hue={352} speed={1.0} intensity={0.38} size={2.1} />
      </div>
      <main style={{ position: 'relative', zIndex: 1 }}>
        <HeroV2 />
        <Schemes />
        <Dossier />
        <SocialLinksV2 />
        <Footer />
        <PixelImp />
      </main>
    </>
  )
}

export default App
