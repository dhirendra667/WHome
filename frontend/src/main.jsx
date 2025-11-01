import './index.css'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router-dom'

import App from './App.jsx'
import { store, persistor } from './redux/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {/* <BrowserRouter> */}
        <App />
        <Toaster />
      {/* </BrowserRouter> */}
    </PersistGate>
  </Provider>
)
