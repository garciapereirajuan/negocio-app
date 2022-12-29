import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import useAuth from './hooks/useAuth'
import { routes } from './routes/routes'
import { logout } from './api/auth'
import Gif1 from './assets/gif/vidrio.webp'
import Gif2 from './assets/gif/phone.webp'

import './App.css';
import './css/variables.css'

const RouteWithSubRoutes = (route) => {
  return (
    <Route 
      key={route.path}
      path={route.path}
      exact={route.exact}
      render={ props => <route.element routes={route.routes} {...props} />}
    />
  )
}

function App() {
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!user && !isLoading) {
      localStorage.removeItem('messageAboutSymbol')
      localStorage.removeItem('messageAboutBonusColor')
    }
  }, [user, isLoading])

  function onCanPlay(e) {
    let audio = document.getElementById('audio')
    var context = new AudioContext(audio);

    audio.setAttribute('autoplay', 'true');
    audio.setAttribute('controls', 'true');
    audio.autoplay = true
    audio.play()
  }

  function thisIsMovil(){
    return ( navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    )
  }

  function send(){
    const message = "No estoy en el navegador de instagram..."

    if (thisIsMovil) {
      window.open(`https://wa.me/542923657103?text=${message}`, '_blank')
    } else {
      window.open(`http://web.whatsapp.com/send?text=${message}&phone=+542923657103&abid=+542923657103`, '_blank')
    }
  }

  if (navigator.userAgent.match(/instagram/gi)) {
    let urlAudio = 'https://project-web-sound2.s3.us-east-2.amazonaws.com/Exogenesis+Symphony+pt-3+Redemption+(1).mp3'

    return(
      <div className='browser-instagram'>
        <div className='browser-instagram__container'>
          <h3>Esto no funciona<br/>desde Instagram.</h3>
          <br/>
          <p className='parraph-type-secondary first-child'>
            Algunas versiones no son compatibles con esta página, y para evitar problemas la deshabilité para este navegador.
          </p>
          <br/>
          <div className='browser-instagram__options'>
            <p className='bold'>Por favor ingresá a <span>Opciones</span>... <span>Abrir con</span>... Y elegí el navegador que siempre usas.</p>        
          </div>
          <br />
          <div className='browser-instagram__options'>
            <p className='bold'>Muchas gracias</p>
          </div>
          <br/>
          <p className='parraph-type-secondary'>¿No estás en el navegador de Instagram?</p>
          <p className='parraph-type-secondary'><span onClick={send}>Avisame</span></p>
        </div>
      </div>
    )
    // <audio id='audio' onCanPlay={(e) => onCanPlay(e)} src={urlAudio} controls></audio>
  }

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {
            routes.map((route, index) => {
              return <Route 
                key={index}
                path={route.path}
                exact={route.exact}
                element={<route.element routes={route.routes} />}
              />
            })
          }   
        </Routes>
      </div>
    </Router>
  );
}

export default App;
