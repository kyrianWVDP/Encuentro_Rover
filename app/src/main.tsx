import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { assetUrl } from './game/assetUrl'

const rootStyle = document.documentElement.style
rootStyle.setProperty('--asset-encuentro-fondo', `url(${assetUrl('encuentro-fondo.jpg')}?v=2)`)
rootStyle.setProperty('--asset-ruleta-fondo', `url(${assetUrl('ruleta-badge.png')})`)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
