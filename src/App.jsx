import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Work from './components/Work'
import Contact from './components/Contact'

function App() {
  return (
    <div className="font-sans">
      <Header />
      <main>
        <Hero />
        <About />
        <Work />
      </main>
      <Contact />
    </div>
  )
}

export default App
