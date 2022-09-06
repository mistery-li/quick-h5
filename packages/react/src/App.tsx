import './App.css'
import 'antd/dist/antd.css'
import 'animate.css'
import { Home } from './pages/Home'
import { QueryClient, QueryClientProvider } from 'react-query'

const App = () => {
  const queryClient = new QueryClient()

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    </div>
  )
}

export default App
