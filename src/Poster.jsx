import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import QRCode from 'qrcode'
import './Poster.css'

function Poster() {
  const location = useLocation()
  const navigate = useNavigate()
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [imageAspectRatio, setImageAspectRatio] = useState(null)
  const [frameStyle, setFrameStyle] = useState('none')
  const [framePadding, setFramePadding] = useState('minimal')
  const [cornerStyle, setCornerStyle] = useState('match')
  const [screenshotUrl, setScreenshotUrl] = useState('')
  const [companyLogoUrl, setCompanyLogoUrl] = useState('')
  const [tagline, setTagline] = useState('')
  const [screenshotIndex, setScreenshotIndex] = useState(0)
  const [availableScreenshots, setAvailableScreenshots] = useState([])
  const [deviceType, setDeviceType] = useState('iphone')
  const appData = location.state

  useEffect(() => {
    console.log('Poster appData:', appData)
    
    // Initialize from passed data
    if (appData) {
      setCompanyLogoUrl(appData.companyLogo || '')
      setTagline(appData.tagline || '')
    }
    
    // Update document title for PDF filename
    if (appData?.name) {
      document.title = `${appData.name} - App Store Poster`
    }
    
    if (appData?.appStoreUrl) {
      QRCode.toDataURL(appData.appStoreUrl, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
        .then(url => setQrCodeUrl(url))
        .catch(err => console.error(err))
    }
    
    // Cleanup - restore original title when component unmounts
    return () => {
      document.title = 'App Store Poster Creator'
    }
  }, [appData])

  // Handle device type changes and screenshot updates
  useEffect(() => {
    if (appData) {
      const screenshots = deviceType === 'iphone' 
        ? (appData.screenshots || [])
        : (appData.ipadScreenshots || [])
      
      setAvailableScreenshots(screenshots)
      setScreenshotIndex(0) // Reset to first screenshot
      setScreenshotUrl(screenshots[0] || '')
      
      console.log(`Switched to ${deviceType} - ${screenshots.length} screenshots available`)
    }
  }, [deviceType, appData])

  // Handle screenshot navigation
  const handlePreviousScreenshot = () => {
    const screenshots = deviceType === 'iphone' 
      ? (appData.screenshots || [])
      : (appData.ipadScreenshots || [])
    
    if (screenshots.length > 0) {
      const newIndex = screenshotIndex > 0 ? screenshotIndex - 1 : screenshots.length - 1
      setScreenshotIndex(newIndex)
      setScreenshotUrl(screenshots[newIndex])
    }
  }

  const handleNextScreenshot = () => {
    const screenshots = deviceType === 'iphone' 
      ? (appData.screenshots || [])
      : (appData.ipadScreenshots || [])
    
    if (screenshots.length > 0) {
      const newIndex = screenshotIndex < screenshots.length - 1 ? screenshotIndex + 1 : 0
      setScreenshotIndex(newIndex)
      setScreenshotUrl(screenshots[newIndex])
    }
  }

  const handleImageLoad = (e) => {
    const img = e.target
    const aspectRatio = img.naturalWidth / img.naturalHeight
    setImageAspectRatio(aspectRatio)
    console.log('Screenshot loaded successfully, aspect ratio:', aspectRatio)
  }

  if (!appData) {
    return <div>No app data available</div>
  }

  // Get padding value based on selection
  const getPaddingValue = () => {
    switch(framePadding) {
      case 'minimal': return 12
      case 'comfortable': return 20
      default: return 16
    }
  }

  // Calculate frame dimensions based on aspect ratio
  const getFrameDimensions = () => {
    if (!imageAspectRatio) {
      return deviceType === 'ipad' 
        ? { width: 400, height: 550 } // Default iPad dimensions
        : { width: 280, height: 570 } // Default iPhone dimensions
    }
    
    const padding = getPaddingValue() * 2 // Total padding
    const isLandscape = imageAspectRatio > 1
    
    if (deviceType === 'ipad') {
      // iPad dimensions
      if (isLandscape) {
        // Landscape iPad
        const baseWidth = 500
        const contentWidth = baseWidth - padding
        const contentHeight = contentWidth / imageAspectRatio
        const frameHeight = contentHeight + padding
        return { 
          width: baseWidth, 
          height: Math.min(frameHeight, 400)
        }
      } else {
        // Portrait iPad
        const baseWidth = 400
        const contentWidth = baseWidth - padding
        const contentHeight = contentWidth / imageAspectRatio
        const frameHeight = contentHeight + padding
        return { 
          width: baseWidth, 
          height: Math.min(frameHeight, 550)
        }
      }
    } else {
      // iPhone dimensions (always portrait)
      const baseWidth = 280
      const contentWidth = baseWidth - padding
      const contentHeight = contentWidth / imageAspectRatio
      const frameHeight = contentHeight + padding
      return { 
        width: baseWidth, 
        height: Math.min(frameHeight, 650)
      }
    }
  }

  const frameDimensions = getFrameDimensions()

  return (
    <>
      <div className="print-background"></div>
      <div className="poster-container">
      <div className="controls-sidebar">
        <h3>Poster Settings</h3>
        
        <div className="option-group">
          <label>Device Type:</label>
          <select 
            value={deviceType} 
            onChange={(e) => {
              const newDeviceType = e.target.value
              setDeviceType(newDeviceType)
              setScreenshotIndex(0) // Reset to first screenshot
              // Update screenshot URL to first screenshot of new device type
              const screenshots = newDeviceType === 'iphone' 
                ? (appData.screenshots || [])
                : (appData.ipadScreenshots || [])
              setScreenshotUrl(screenshots[0] || '')
            }}
            className="select-input"
          >
            <option value="iphone">iPhone</option>
            <option value="ipad">iPad</option>
          </select>
        </div>
        
        <div className="option-group">
          <label>Frame Style:</label>
          <select 
            value={frameStyle} 
            onChange={(e) => setFrameStyle(e.target.value)}
            className="select-input"
          >
            <option value="no-frame">No Frame</option>
            <option value="none">Device Frame</option>
            <option value="notch">Device Frame with Notch</option>
            <option value="dynamic-island">Device Frame with Dynamic Island</option>
          </select>
        </div>
        
        <div className="option-group">
          <label>Content Padding:</label>
          <select 
            value={framePadding} 
            onChange={(e) => setFramePadding(e.target.value)}
            className="select-input"
          >
            <option value="minimal">Minimal (12px)</option>
            <option value="normal">Normal (16px)</option>
            <option value="comfortable">Comfortable (20px)</option>
          </select>
        </div>
        
        <div className="option-group">
          <label>Screen Corners:</label>
          <select 
            value={cornerStyle} 
            onChange={(e) => setCornerStyle(e.target.value)}
            className="select-input"
          >
            <option value="square">Square (No rounding)</option>
            <option value="slight">Slight (8px)</option>
            <option value="rounded">Rounded (16px)</option>
            <option value="match">Match Frame</option>
          </select>
        </div>
        
        <div className="option-group">
          <label>Tagline:</label>
          <textarea
            placeholder="App tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="textarea-small"
            rows="2"
          />
        </div>
        
        <div className="option-group">
          <label>Screenshot:</label>
          {availableScreenshots.length > 1 && (
            <div className="screenshot-nav">
              <button 
                onClick={handlePreviousScreenshot}
                className="nav-button"
                title="Previous screenshot"
              >
                ←
              </button>
              <span className="screenshot-counter">
                {screenshotIndex + 1} / {availableScreenshots.length}
              </span>
              <button 
                onClick={handleNextScreenshot}
                className="nav-button"
                title="Next screenshot"
              >
                →
              </button>
            </div>
          )}
          <input
            type="url"
            placeholder="Custom screenshot URL"
            value={screenshotUrl}
            onChange={(e) => {
              setScreenshotUrl(e.target.value)
              // Clear index when manually entering URL
              setScreenshotIndex(-1)
            }}
            className="url-input-small"
          />
        </div>
        
        <div className="option-group">
          <label>Company Logo URL:</label>
          <input
            type="url"
            placeholder="Logo URL"
            value={companyLogoUrl}
            onChange={(e) => {
              setCompanyLogoUrl(e.target.value)
              // Save to localStorage
              if (e.target.value) {
                localStorage.setItem('companyLogoUrl', e.target.value)
              } else {
                localStorage.removeItem('companyLogoUrl')
              }
            }}
            className="url-input-small"
          />
        </div>
        
        <div className="sidebar-buttons">
          <button onClick={() => navigate('/')} className="secondary-button">
            Start Over
          </button>
          <button 
            onClick={() => {
              // Force a reflow before printing to ensure layout is correct
              document.body.offsetHeight;
              window.print();
            }} 
            className="print-button"
          >
            Print Poster
          </button>
          <p className="print-note">
            For best results, use "Print to PDF" in your browser's print dialog
          </p>
        </div>
      </div>
      
      <div className="poster">
        <div className="poster-header">
          <div className="app-header-content">
            {appData.iconUrl && (
              <img src={appData.iconUrl} alt={`${appData.name} icon`} className="app-icon" />
            )}
            <div className="app-text">
              <h1 className="app-title">{appData.name}</h1>
              <p className="app-tagline">{tagline}</p>
            </div>
          </div>
        </div>
        
        <div className="screenshot-container">
          {frameStyle === 'no-frame' ? (
            // No frame - just the screenshot
            <div style={{ 
              width: `${frameDimensions.width}px`, 
              height: 'auto',
              borderRadius: cornerStyle === 'square' ? '0' : 
                          cornerStyle === 'slight' ? '8px' : 
                          cornerStyle === 'rounded' ? '16px' : '8px',
              overflow: 'hidden'
            }}>
              {screenshotUrl ? (
                <img 
                  src={screenshotUrl} 
                  alt={`${appData.name} screenshot`}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  onError={(e) => {
                    console.error('Failed to load screenshot:', screenshotUrl)
                    e.target.style.display = 'none'
                  }}
                  onLoad={handleImageLoad}
                />
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666', background: '#f5f5f7' }}>
                  <p>No screenshot available</p>
                  <p style={{ fontSize: '12px' }}>Check console for debug info</p>
                </div>
              )}
            </div>
          ) : (
            // With device frame
            <div 
              className={`device-frame ${deviceType}-frame ${frameStyle}`}
              style={{ 
                width: `${frameDimensions.width}px`, 
                height: `${frameDimensions.height}px`,
                padding: `${getPaddingValue()}px`
              }}
            >
              <div 
                className="iphone-screen"
                style={{
                  borderRadius: cornerStyle === 'square' ? '0' : 
                              cornerStyle === 'slight' ? '8px' : 
                              cornerStyle === 'rounded' ? '16px' :
                              cornerStyle === 'match' ? `${deviceType === 'ipad' ? 20 - getPaddingValue() : 35 - getPaddingValue()}px` : '16px'
                }}
              >
                {screenshotUrl ? (
                  <img 
                    src={screenshotUrl} 
                    alt={`${appData.name} screenshot`}
                    onError={(e) => {
                      console.error('Failed to load screenshot:', screenshotUrl)
                      e.target.style.display = 'none'
                    }}
                    onLoad={handleImageLoad}
                  />
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    <p>No screenshot available</p>
                    <p style={{ fontSize: '12px' }}>Check console for debug info</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="poster-footer">
          <div className="company-info">
            {companyLogoUrl && (
              <img src={companyLogoUrl} alt="Company logo" className="company-logo" />
            )}
          </div>
          <div className="qr-container">
            {qrCodeUrl && (
              <>
                <img src={qrCodeUrl} alt="QR Code" className="qr-code" />
                <img 
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                  alt="Download on the App Store" 
                  className="app-store-badge"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Poster