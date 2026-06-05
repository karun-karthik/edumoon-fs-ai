import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { App, App2 } from './App.tsx'
import App from './App.tsx'
import EffectExample from './EffectExample'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <EffectExample/>
    {/* <App2></App2> */}
  </StrictMode>,
)
