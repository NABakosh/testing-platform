import { Link, useLocation } from 'react-router-dom'

function Navbar() {
	const location = useLocation()

	const isActive = path => {
		return location.pathname === path
	}

	return (
		<nav className='bg-dark-card border-b border-dark-border'>
			<div className='container mx-auto px-4'>
				<div className='flex items-center justify-between h-16'>
					<Link to='/' className='text-xl font-bold text-primary-400'>
						TestingPlatform
					</Link>
					<div className='flex space-x-4'>
						<Link
							to='/'
							className={`px-3 py-2 rounded-md text-sm font-medium ${
								isActive('/')
									? 'bg-primary-600 text-white'
									: 'text-dark-text hover:bg-dark-border'
							}`}
						>
							Главная
						</Link>
						<Link
							to='/tests'
							className={`px-3 py-2 rounded-md text-sm font-medium ${
								isActive('/tests')
									? 'bg-primary-600 text-white'
									: 'text-dark-text hover:bg-dark-border'
							}`}
						>
							Тесты
						</Link>
						<Link
							to='/tests/create'
							className={`px-3 py-2 rounded-md text-sm font-medium ${
								isActive('/tests/create')
									? 'bg-primary-600 text-white'
									: 'text-dark-text hover:bg-dark-border'
							}`}
						>
							Создать тест
						</Link>
					</div>
				</div>
			</div>
		</nav>
	)
}

export default Navbar
