import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { testService } from '../services/testService'

const QUESTION_TYPES = {
	SINGLE: 'single',
	MULTIPLE: 'multiple',
	TEXT: 'text',
}

const QUESTION_TYPE_LABELS = {
	[QUESTION_TYPES.SINGLE]: 'Один правильный ответ',
	[QUESTION_TYPES.MULTIPLE]: 'Несколько правильных ответов',
	[QUESTION_TYPES.TEXT]: 'Текстовый ответ',
}

function CreateTest() {
	const navigate = useNavigate()
	const [isConfirmOpen, setIsConfirmOpen] = useState(false)
	const [testData, setTestData] = useState({
		title: '',
		description: '',
		timeLimit: 30,
		author: 'Текущий пользователь',
		questions: [
			{
				id: 1,
				text: '',
				type: QUESTION_TYPES.SINGLE,
				options: ['', '', '', ''],
				correctAnswers: [0],
			},
		],
	})

	const handleQuestionChange = (index, field, value) => {
		const newQuestions = [...testData.questions]
		if (field === 'option') {
			const [optionIndex, optionValue] = value
			newQuestions[index].options[optionIndex] = optionValue
		} else if (field === 'type') {
			const question = newQuestions[index]
			question.type = value
			if (value === QUESTION_TYPES.TEXT) {
				question.options = ['']
				question.correctAnswers = ['']
			} else if (value === QUESTION_TYPES.SINGLE) {
				question.options = ['', '', '', '']
				question.correctAnswers = [0]
			} else {
				question.options = ['', '', '', '']
				question.correctAnswers = []
			}
		} else if (field === 'correctAnswer') {
			const question = newQuestions[index]
			if (question.type === QUESTION_TYPES.SINGLE) {
				question.correctAnswers = [value]
			} else if (question.type === QUESTION_TYPES.MULTIPLE) {
				const correctAnswers = [...question.correctAnswers]
				const answerIndex = correctAnswers.indexOf(value)
				if (answerIndex === -1) {
					correctAnswers.push(value)
				} else {
					correctAnswers.splice(answerIndex, 1)
				}
				question.correctAnswers = correctAnswers
			} else {
				question.correctAnswers = [value]
			}
		} else {
			newQuestions[index][field] = value
		}
		setTestData({ ...testData, questions: newQuestions })
	}

	const addQuestion = () => {
		const newQuestionId = Math.max(...testData.questions.map(q => q.id)) + 1
		setTestData({
			...testData,
			questions: [
				...testData.questions,
				{
					id: newQuestionId,
					text: '',
					type: QUESTION_TYPES.SINGLE,
					options: ['', '', '', ''],
					correctAnswers: [0],
				},
			],
		})
	}

	const removeQuestion = index => {
		const newQuestions = testData.questions.filter((_, i) => i !== index)
		setTestData({ ...testData, questions: newQuestions })
	}

	const handleSubmit = e => {
		e.preventDefault()
		setIsConfirmOpen(true)
	}

	const confirmCreate = () => {
		testService.createTest(testData)
		toast.success('Оплата прошла успешно! Тест создан.')
		setIsConfirmOpen(false)
		navigate('/tests')
	}

	return (
		<div className='max-w-4xl mx-auto'>
			<h1 className='text-3xl font-bold mb-8'>Создание нового теста</h1>

			<form onSubmit={handleSubmit} className='space-y-8'>
				<div className='space-y-4'>
					<div>
						<label className='block text-sm font-medium mb-2'>
							Название теста
						</label>
						<input
							type='text'
							required
							className='w-full px-4 py-2 rounded-lg bg-dark-card border border-dark-border focus:ring-2 focus:ring-primary-500 focus:border-transparent'
							value={testData.title}
							onChange={e =>
								setTestData({ ...testData, title: e.target.value })
							}
						/>
					</div>

					<div>
						<label className='block text-sm font-medium mb-2'>Описание</label>
						<textarea
							required
							rows={3}
							className='w-full px-4 py-2 rounded-lg bg-dark-card border border-dark-border focus:ring-2 focus:ring-primary-500 focus:border-transparent'
							value={testData.description}
							onChange={e =>
								setTestData({ ...testData, description: e.target.value })
							}
						/>
					</div>

					<div>
						<label className='block text-sm font-medium mb-2'>
							Время на выполнение (минут)
						</label>
						<input
							type='number'
							required
							min='1'
							className='w-full px-4 py-2 rounded-lg bg-dark-card border border-dark-border focus:ring-2 focus:ring-primary-500 focus:border-transparent'
							value={testData.timeLimit}
							onChange={e =>
								setTestData({
									...testData,
									timeLimit: parseInt(e.target.value),
								})
							}
						/>
					</div>
				</div>

				<div className='space-y-6'>
					<div className='flex justify-between items-center'>
						<h2 className='text-xl font-semibold'>Вопросы</h2>
						<button
							type='button'
							onClick={addQuestion}
							className='text-primary-400 hover:text-primary-300'
						>
							+ Добавить вопрос
						</button>
					</div>

					{testData.questions.map((question, questionIndex) => (
						<div
							key={questionIndex}
							className='p-6 bg-dark-card rounded-lg border border-dark-border'
						>
							<div className='flex justify-between items-start mb-4'>
								<h3 className='text-lg font-medium'>
									Вопрос {questionIndex + 1}
								</h3>
								{testData.questions.length > 1 && (
									<button
										type='button'
										onClick={() => removeQuestion(questionIndex)}
										className='text-red-500 hover:text-red-400'
									>
										Удалить
									</button>
								)}
							</div>

							<div className='space-y-4'>
								<div>
									<label className='block text-sm font-medium mb-2'>
										Тип вопроса
									</label>
									<select
										className='w-full px-4 py-2 rounded-lg bg-dark-card border border-dark-border focus:ring-2 focus:ring-primary-500 focus:border-transparent'
										value={question.type}
										onChange={e =>
											handleQuestionChange(
												questionIndex,
												'type',
												e.target.value
											)
										}
									>
										{Object.entries(QUESTION_TYPE_LABELS).map(
											([value, label]) => (
												<option key={value} value={value}>
													{label}
												</option>
											)
										)}
									</select>
								</div>

								<div>
									<input
										type='text'
										required
										placeholder='Текст вопроса'
										className='w-full px-4 py-2 rounded-lg bg-dark-card border border-dark-border focus:ring-2 focus:ring-primary-500 focus:border-transparent'
										value={question.text}
										onChange={e =>
											handleQuestionChange(
												questionIndex,
												'text',
												e.target.value
											)
										}
									/>
								</div>

								{question.type === QUESTION_TYPES.TEXT ? (
									<div>
										<label className='block text-sm font-medium mb-2'>
											Правильный ответ
										</label>
										<input
											type='text'
											required
											placeholder='Введите правильный ответ'
											className='w-full px-4 py-2 rounded-lg bg-dark-card border border-dark-border focus:ring-2 focus:ring-primary-500 focus:border-transparent'
											value={question.correctAnswers[0] || ''}
											onChange={e =>
												handleQuestionChange(
													questionIndex,
													'correctAnswer',
													e.target.value
												)
											}
										/>
									</div>
								) : (
									<div className='space-y-2'>
										{question.options.map((option, optionIndex) => (
											<div
												key={optionIndex}
												className='flex items-center space-x-2'
											>
												<input
													type={
														question.type === QUESTION_TYPES.SINGLE
															? 'radio'
															: 'checkbox'
													}
													name={`correct-${questionIndex}`}
													checked={question.correctAnswers.includes(
														optionIndex
													)}
													onChange={() =>
														handleQuestionChange(
															questionIndex,
															'correctAnswer',
															optionIndex
														)
													}
													className='text-primary-600 focus:ring-primary-500'
												/>
												<input
													type='text'
													required
													placeholder={`Вариант ${optionIndex + 1}`}
													className='flex-1 px-4 py-2 rounded-lg bg-dark-card border border-dark-border focus:ring-2 focus:ring-primary-500 focus:border-transparent'
													value={option}
													onChange={e =>
														handleQuestionChange(questionIndex, 'option', [
															optionIndex,
															e.target.value,
														])
													}
												/>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					))}
				</div>

				<div className='flex justify-end'>
					<button
						type='submit'
						className='bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-500 transition-colors'
					>
						Создать тест (2500 ₸)
					</button>
				</div>
			</form>

			{isConfirmOpen && (
				<div className='fixed inset-0 z-10 overflow-y-auto'>
					<div className='flex items-center justify-center min-h-screen px-4'>
						<div
							className='fixed inset-0 bg-black bg-opacity-30'
							onClick={() => setIsConfirmOpen(false)}
						/>
						<div className='relative bg-dark-card p-6 rounded-lg max-w-sm mx-auto'>
							<h3 className='text-lg font-medium mb-4'>
								Подтверждение создания теста
							</h3>
							<p className='text-gray-400 mb-6'>
								Вы уверены, что хотите создать этот тест? С вашего счета будет
								списано 2500 ₸.
							</p>
							<div className='flex justify-end space-x-4'>
								<button
									type='button'
									className='text-gray-400 hover:text-gray-300'
									onClick={() => setIsConfirmOpen(false)}
								>
									Отмена
								</button>
								<button
									type='button'
									className='bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-500'
									onClick={confirmCreate}
								>
									Подтвердить
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default CreateTest
