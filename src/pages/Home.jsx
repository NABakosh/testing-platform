import { Link } from 'react-router-dom'
import {
	AcademicCapIcon,
	ClipboardDocumentCheckIcon,
	UserGroupIcon,
} from '@heroicons/react/24/outline'

function Home() {
	const features = [
		{
			name: 'Автоматизированное тестирование',
			description:
				'Создавайте и проходите тесты в удобном формате с мгновенной проверкой результатов.',
			icon: ClipboardDocumentCheckIcon,
		},
		{
			name: 'Для студентов и преподавателей',
			description:
				'Платформа разработана с учетом потребностей как студентов, так и преподавателей.',
			icon: UserGroupIcon,
		},
		{
			name: 'Образовательные возможности',
			description:
				'Расширяйте свои знания и улучшайте навыки с помощью разнообразных тестов.',
			icon: AcademicCapIcon,
		},
	]

	return (
		<div className='py-12'>
			<div className='text-center'>
				<h1 className='text-4xl font-bold tracking-tight sm:text-6xl mb-6'>
					Платформа для тестирования студентов
				</h1>
				<p className='text-lg leading-8 text-gray-400 max-w-2xl mx-auto'>
					Современная веб-система для автоматизированного тестирования знаний
					студентов. Создавайте тесты, проходите их и отслеживайте результаты в
					удобном формате.
				</p>
				<div className='mt-10 flex items-center justify-center gap-x-6'>
					<Link
						to='/tests'
						className='rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
					>
						Просмотреть тесты
					</Link>
					<Link
						to='/tests/create'
						className='text-sm font-semibold leading-6 text-dark-text hover:text-primary-400'
					>
						Создать тест <span aria-hidden='true'>→</span>
					</Link>
				</div>
			</div>

			<div className='mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24'>
				<dl className='mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16'>
					{features.map(feature => (
						<div
							key={feature.name}
							className='relative bg-dark-card p-8 rounded-2xl'
						>
							<dt className='text-base font-semibold leading-7'>
								<div className='absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600'>
									<feature.icon
										className='h-6 w-6 text-white'
										aria-hidden='true'
									/>
								</div>
								<div className='ml-16'>{feature.name}</div>
							</dt>
							<dd className='mt-2 ml-16 text-base leading-7 text-gray-400'>
								{feature.description}
							</dd>
						</div>
					))}
				</dl>
			</div>
		</div>
	)
}

export default Home
