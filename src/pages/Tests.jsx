import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { testService } from '../services/testService'

// Временные данные для демонстрации
const DEMO_TESTS = [
	{
		id: 1,
		title: 'Основы программирования',
		description: 'Тест на знание базовых концепций программирования',
		questions: 10,
		timeLimit: 20,
		author: 'Преподаватель А',
	},
	{
		id: 2,
		title: 'Математический анализ',
		description: 'Проверка знаний по основам математического анализа',
		questions: 15,
		timeLimit: 30,
		author: 'Преподаватель Б',
	},
	// Добавьте больше тестов по необходимости
]

function Tests() {
	const [searchTerm, setSearchTerm] = useState('')
	const [tests, setTests] = useState([])
	const [testHistory, setTestHistory] = useState([])

	useEffect(() => {
		// Загрузка тестов из сервиса
		const loadTests = () => {
			const allTests = testService.getAllTests()
			setTests(allTests)
		}
		loadTests()

		// Загрузка истории тестов
		const savedHistory = localStorage.getItem('testHistory')
		if (savedHistory) {
			setTestHistory(JSON.parse(savedHistory))
		}
	}, [])

	const filteredTests = tests.filter(
		test =>
			test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			test.description.toLowerCase().includes(searchTerm.toLowerCase())
	)

	const formatTime = seconds => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
	}

	return (
		<div className='max-w-7xl mx-auto'>
			<div className='flex justify-between items-center mb-8'>
				<div>
					<h1 className='text-3xl font-bold'>Доступные тесты</h1>
					<p className='text-gray-400 mt-2'>
						Выберите тест для прохождения или создайте свой
					</p>
				</div>
				<Link
					to='/tests/create'
					className='bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-500 transition-colors'
				>
					Создать тест
				</Link>
			</div>

			<div className='mb-6'>
				<input
					type='text'
					placeholder='Поиск тестов...'
					className='w-full px-4 py-2 rounded-lg bg-dark-card border border-dark-border focus:ring-2 focus:ring-primary-500 focus:border-transparent'
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
				/>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
				{filteredTests.map(test => (
					<motion.div
						key={test.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						className='bg-dark-card p-6 rounded-lg border border-dark-border hover:border-primary-500 transition-colors'
					>
						<h3 className='text-xl font-semibold mb-2'>{test.title}</h3>
						<p className='text-gray-400 mb-4'>{test.description}</p>
						<div className='flex justify-between items-center text-sm text-gray-400 mb-4'>
							<span>{test.questions.length} вопросов</span>
							<span>{test.timeLimit} минут</span>
						</div>
						<div className='flex justify-between items-center'>
							<span className='text-sm text-gray-400'>{test.author}</span>
							<Link
								to={`/tests/${test.id}`}
								className='text-primary-400 hover:text-primary-300 font-medium'
							>
								Начать тест →
							</Link>
						</div>
					</motion.div>
				))}
			</div>

			{filteredTests.length === 0 && (
				<div className='text-center py-12'>
					<p className='text-gray-400'>Тесты не найдены</p>
				</div>
			)}

			{testHistory.length > 0 && (
				<div className='mt-16'>
					<h2 className='text-2xl font-bold mb-6'>
						История прохождения тестов
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{testHistory.map((entry, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
								className='bg-dark-card p-6 rounded-lg border border-dark-border'
							>
								<div className='flex justify-between items-start mb-4'>
									<div>
										<h3 className='font-semibold text-lg mb-1'>
											{entry.testTitle}
										</h3>
										<p className='text-sm text-gray-400'>{entry.userName}</p>
									</div>
									<div className='text-right'>
										<div className='text-2xl font-bold text-primary-400'>
											{entry.percentage}%
										</div>
										<p className='text-sm text-gray-400'>
											{entry.correct} из {entry.total}
										</p>
									</div>
								</div>
								<div className='flex justify-between items-center text-sm text-gray-400'>
									<span>{entry.date}</span>
									<span>Время: {formatTime(entry.timeSpent)}</span>
								</div>
								<div className='mt-4'>
									<Link
										to={`/tests/${entry.testId}`}
										className='text-primary-400 hover:text-primary-300 text-sm'
									>
										Пройти тест снова →
									</Link>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export default Tests
