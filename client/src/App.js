import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import useAuth from './hooks/useAuth'
import { routes } from './routes/routes'
import { logout } from './api/auth'

import './App.css';
import './css/variables.css'

const RouteWithSubRoutes = route => {
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
    }
  }, [user, isLoading])

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
