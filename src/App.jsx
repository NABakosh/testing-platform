import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Tests from './pages/Tests'
import CreateTest from './pages/CreateTest'
import TestDetails from './pages/TestDetails'

function App() {
	return (
		<Router>
			<div className='min-h-screen bg-dark-bg text-dark-text'>
				<Navbar />
				<main className='container mx-auto px-4 py-8'>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/tests' element={<Tests />} />
						<Route path='/tests/create' element={<CreateTest />} />
						<Route path='/tests/:id' element={<TestDetails />} />
					</Routes>
				</main>
				<Toaster
					position='bottom-right'
					toastOptions={{
						className: 'bg-dark-card text-dark-text',
						duration: 4000,
					}}
				/>
			</div>
		</Router>
	)
}

export default App
