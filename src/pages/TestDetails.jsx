import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { testService } from '../services/testService'

const QUESTION_TYPES = {
	SINGLE: 'single',
	MULTIPLE: 'multiple',
	TEXT: 'text',
}

// Временные данные для демонстрации
const DEMO_TEST = {
	id: 1,
	title: 'Основы программирования',
	description: 'Тест на знание базовых концепций программирования',
	timeLimit: 20,
	questions: [
		{
			id: 1,
			text: 'Что такое переменная в программировании?',
			options: [
				'Именованная область памяти для хранения данных',
				'Математическое выражение',
				'Название функции',
				'Оператор сравнения',
			],
			correctAnswer: 0,
		},
		{
			id: 2,
			text: 'Какой цикл используется, когда количество итераций известно заранее?',
			options: ['while', 'do-while', 'for', 'foreach'],
			correctAnswer: 2,
		},
		// Добавьте больше вопросов по необходимости
	],
}

function TestDetails() {
	const { id } = useParams()
	const [test, setTest] = useState(null)
	const [currentStep, setCurrentStep] = useState('start') // 'start', 'test', 'results'
	const [userName, setUserName] = useState('')
	const [answers, setAnswers] = useState({})
	const [timeLeft, setTimeLeft] = useState(0)
	const [testHistory, setTestHistory] = useState(() => {
		const savedHistory = localStorage.getItem('testHistory')
		return savedHistory ? JSON.parse(savedHistory) : []
	})
	const [timer, setTimer] = useState(null)

	useEffect(() => {
		const loadTest = () => {
			const currentTest = testService.getTestById(parseInt(id))
			if (currentTest) {
				setTest(currentTest)
				setTimeLeft(currentTest.timeLimit * 60)
			}
		}
		loadTest()

		// Cleanup timer on unmount
		return () => {
			if (timer) {
				clearInterval(timer)
			}
		}
	}, [id])

	useEffect(() => {
		if (currentStep === 'test' && timeLeft > 0) {
			const newTimer = setInterval(() => {
				setTimeLeft(prev => {
					if (prev <= 1) {
						clearInterval(newTimer)
						handleSubmitTest()
						return 0
					}
					return prev - 1
				})
			}, 1000)
			setTimer(newTimer)

			return () => clearInterval(newTimer)
		}
	}, [currentStep])

	useEffect(() => {
		localStorage.setItem('testHistory', JSON.stringify(testHistory))
	}, [testHistory])

	const handleStartTest = e => {
		e.preventDefault()
		setCurrentStep('test')
		setTimeLeft(test.timeLimit * 60)
	}

	const handleAnswerSelect = (questionId, answer, type) => {
		if (type === QUESTION_TYPES.MULTIPLE) {
			const currentAnswers = answers[questionId] || []
			const newAnswers = currentAnswers.includes(answer)
				? currentAnswers.filter(a => a !== answer)
				: [...currentAnswers, answer]
			setAnswers({
				...answers,
				[questionId]: newAnswers,
			})
		} else {
			setAnswers({
				...answers,
				[questionId]: answer,
			})
		}
	}

	const calculateResults = () => {
		if (!test) return { total: 0, correct: 0, percentage: 0 }

		let correct = 0
		test.questions.forEach(question => {
			const userAnswer = answers[question.id]
			if (question.type === QUESTION_TYPES.MULTIPLE) {
				const isCorrect =
					userAnswer &&
					userAnswer.length === question.correctAnswers.length &&
					userAnswer.every(a => question.correctAnswers.includes(a))
				if (isCorrect) correct++
			} else if (question.type === QUESTION_TYPES.TEXT) {
				const isCorrect =
					userAnswer &&
					userAnswer.toLowerCase().trim() ===
						question.correctAnswers[0].toLowerCase().trim()
				if (isCorrect) correct++
			} else {
				const isCorrect = userAnswer === question.correctAnswers[0]
				if (isCorrect) correct++
			}
		})

		return {
			total: test.questions.length,
			correct,
			percentage: Math.round((correct / test.questions.length) * 100),
		}
	}

	const handleSubmitTest = () => {
		if (timer) {
			clearInterval(timer)
		}

		const results = calculateResults()
		const historyEntry = {
			testId: test.id,
			testTitle: test.title,
			date: new Date().toLocaleString(),
			userName,
			timeSpent: test.timeLimit * 60 - timeLeft,
			answers: answers,
			...results,
		}
		setTestHistory(prev => [historyEntry, ...prev])
		setCurrentStep('results')
	}

	const formatTime = seconds => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
	}

	if (!test) {
		return (
			<div className='max-w-4xl mx-auto text-center py-12'>
				<p className='text-gray-400'>Тест не найден</p>
			</div>
		)
	}

	return (
		<div className='max-w-4xl mx-auto'>
			{currentStep === 'start' && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='bg-dark-card p-8 rounded-lg'
				>
					<h1 className='text-3xl font-bold mb-4'>{test.title}</h1>
					<p className='text-gray-400 mb-6'>{test.description}</p>
					<div className='mb-8'>
						<p className='text-sm text-gray-400'>
							Время на выполнение: {test.timeLimit} минут
						</p>
						<p className='text-sm text-gray-400'>
							Количество вопросов: {test.questions.length}
						</p>
					</div>

					<form onSubmit={handleStartTest} className='space-y-4'>
						<div>
							<label className='block text-sm font-medium mb-2'>
								Введите ваше имя
							</label>
							<input
								type='text'
								required
								className='w-full px-4 py-2 rounded-lg bg-dark-card border border-dark-border focus:ring-2 focus:ring-primary-500 focus:border-transparent'
								value={userName}
								onChange={e => setUserName(e.target.value)}
							/>
						</div>
						<button
							type='submit'
							className='w-full bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-500 transition-colors'
						>
							Начать тест
						</button>
					</form>
				</motion.div>
			)}

			{currentStep === 'test' && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='space-y-8'
				>
					<div className='flex justify-between items-center bg-dark-card p-4 rounded-lg sticky top-0'>
						<h2 className='text-xl font-semibold'>
							Вопрос {Object.keys(answers).length + 1} из{' '}
							{test.questions.length}
						</h2>
						<div className='text-primary-400'>
							Осталось времени: {formatTime(timeLeft)}
						</div>
					</div>

					<div className='space-y-6'>
						{test.questions.map((question, index) => (
							<div key={question.id} className='bg-dark-card p-6 rounded-lg'>
								<h3 className='text-lg font-medium mb-4'>
									{index + 1}. {question.text}
								</h3>
								{question.type === QUESTION_TYPES.TEXT ? (
									<div>
										<input
											type='text'
											placeholder='Введите ваш ответ'
											className='w-full px-4 py-2 rounded-lg bg-dark-card border border-dark-border focus:ring-2 focus:ring-primary-500 focus:border-transparent'
											value={answers[question.id] || ''}
											onChange={e =>
												handleAnswerSelect(
													question.id,
													e.target.value,
													question.type
												)
											}
										/>
									</div>
								) : (
									<div className='space-y-2'>
										{question.options.map((option, optionIndex) => (
											<label
												key={optionIndex}
												className='flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-border cursor-pointer'
											>
												<input
													type={
														question.type === QUESTION_TYPES.SINGLE
															? 'radio'
															: 'checkbox'
													}
													name={`question-${question.id}`}
													checked={
														question.type === QUESTION_TYPES.MULTIPLE
															? (answers[question.id] || []).includes(
																	optionIndex
															  )
															: answers[question.id] === optionIndex
													}
													onChange={() =>
														handleAnswerSelect(
															question.id,
															optionIndex,
															question.type
														)
													}
													className='text-primary-600 focus:ring-primary-500'
												/>
												<span>{option}</span>
											</label>
										))}
									</div>
								)}
							</div>
						))}
					</div>

					<div className='flex justify-end'>
						<button
							onClick={handleSubmitTest}
							className='bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-500 transition-colors'
						>
							Завершить тест
						</button>
					</div>
				</motion.div>
			)}

			{currentStep === 'results' && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='space-y-8'
				>
					<div className='bg-dark-card p-8 rounded-lg text-center'>
						<h2 className='text-2xl font-bold mb-4'>Результаты теста</h2>
						<div className='text-6xl font-bold text-primary-400 mb-4'>
							{calculateResults().percentage}%
						</div>
						<p className='text-gray-400'>
							Правильных ответов: {calculateResults().correct} из{' '}
							{calculateResults().total}
						</p>
						<p className='text-gray-400 mt-2'>
							Затраченное время: {formatTime(test.timeLimit * 60 - timeLeft)}
						</p>
					</div>

					<div className='bg-dark-card p-6 rounded-lg'>
						<h3 className='text-xl font-semibold mb-4'>История прохождения</h3>
						<div className='space-y-4'>
							{testHistory
								.filter(entry => entry.testId === test.id)
								.map((entry, index) => (
									<div
										key={index}
										className='p-4 border border-dark-border rounded-lg'
									>
										<div className='flex justify-between items-center'>
											<div>
												<p className='font-medium'>{entry.userName}</p>
												<p className='text-sm text-gray-400'>{entry.date}</p>
												<p className='text-sm text-gray-400'>
													Время: {formatTime(entry.timeSpent)}
												</p>
											</div>
											<div className='text-right'>
												<p className='text-lg font-semibold text-primary-400'>
													{entry.percentage}%
												</p>
												<p className='text-sm text-gray-400'>
													{entry.correct} из {entry.total}
												</p>
											</div>
										</div>
										<div className='mt-4'>
											<button
												onClick={() => setAnswers(entry.answers)}
												className='text-primary-400 hover:text-primary-300 text-sm'
											>
												Показать ответы
											</button>
										</div>
									</div>
								))}
						</div>
					</div>

					{Object.keys(answers).length > 0 && (
						<div className='bg-dark-card p-6 rounded-lg'>
							<h3 className='text-xl font-semibold mb-4'>Ваши ответы</h3>
							<div className='space-y-4'>
								{test.questions.map((question, index) => (
									<div
										key={question.id}
										className='p-4 border border-dark-border rounded-lg'
									>
										<p className='font-medium mb-2'>
											{index + 1}. {question.text}
										</p>
										{question.type === QUESTION_TYPES.TEXT ? (
											<div>
												<p className='text-gray-400'>
													Ваш ответ: {answers[question.id] || 'Не отвечено'}
												</p>
												<p className='text-primary-400 mt-1'>
													Правильный ответ: {question.correctAnswers[0]}
												</p>
											</div>
										) : (
											<div>
												<p className='text-gray-400 mb-2'>Ваш ответ:</p>
												{question.options.map((option, optionIndex) => {
													const isSelected =
														question.type === QUESTION_TYPES.MULTIPLE
															? (answers[question.id] || []).includes(
																	optionIndex
															  )
															: answers[question.id] === optionIndex
													const isCorrect =
														question.correctAnswers.includes(optionIndex)
													return (
														<div
															key={optionIndex}
															className={`p-2 rounded ${
																isSelected
																	? isCorrect
																		? 'bg-green-500/20'
																		: 'bg-red-500/20'
																	: isCorrect
																	? 'bg-green-500/20'
																	: ''
															}`}
														>
															{option}
														</div>
													)
												})}
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					)}
				</motion.div>
			)}
		</div>
	)
}

export default TestDetails
