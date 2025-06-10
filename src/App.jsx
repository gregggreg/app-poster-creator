import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Poster from './Poster'
import './App.css'

function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  
  useEffect(() => {
    document.title = 'App Store Poster Creator'
  }, [])

  const extractAppId = (url) => {
    const match = url.match(/id(\d+)/)
    return match ? match[1] : null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const appId = extractAppId(url)
      if (!appId) {
        throw new Error('Invalid App Store URL')
      }

      // Use a CORS proxy for production deployments
      // The iTunes API doesn't support CORS from browsers
      const apiUrl = `https://itunes.apple.com/lookup?id=${appId}`;
      
      let response;
      if (window.location.hostname === 'localhost') {
        // Direct call in development
        response = await axios.get(apiUrl);
      } else {
        // Use proxy in production
        response = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`);
        // AllOrigins wraps the response
        if (response.data.contents) {
          response.data = JSON.parse(response.data.contents);
        }
      }
      const appData = response.data.results[0]
      
      if (!appData) {
        throw new Error('App not found')
      }

      console.log('App data:', appData)
      
      // Get the first iPhone screenshot, checking multiple possible fields
      let screenshot = null
      if (appData.screenshotUrls && appData.screenshotUrls.length > 0) {
        screenshot = appData.screenshotUrls[0]
      } else if (appData.ipadScreenshotUrls && appData.ipadScreenshotUrls.length > 0) {
        screenshot = appData.ipadScreenshotUrls[0]
      }
      
      const posterData = {
        name: appData.trackName,
        tagline: appData.description.split('.')[0],
        screenshot: screenshot,
        screenshots: appData.screenshotUrls || [],
        appStoreUrl: url,
        iconUrl: appData.artworkUrl512,
        sellerName: appData.sellerName,
        companyLogo: localStorage.getItem('companyLogoUrl') || ''
      }
      
      console.log('Poster data:', posterData)
      console.log('Screenshot URL:', screenshot)

      navigate('/poster', { state: posterData })
    } catch (err) {
      setError(err.message || 'Failed to fetch app data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>App Store Poster Creator</h1>
      <p className="subtitle">Create beautiful posters for your iOS apps</p>
      
      <form onSubmit={handleSubmit} className="url-form">
        <input
          type="url"
          placeholder="Enter App Store URL (e.g., https://apps.apple.com/app/id123456789)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="url-input"
          required
        />
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Loading...' : 'Create Poster'}
        </button>
      </form>
      
      {error && <p className="error">{error}</p>}
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/poster" element={<Poster />} />
      </Routes>
    </Router>
  )
}

export default App