import testsData from '../data/tests.json'

class TestService {
	constructor() {
		this.tests = testsData.tests
	}

	getAllTests() {
		return this.tests
	}

	getTestById(id) {
		return this.tests.find(test => test.id === id)
	}

	createTest(testData) {
		const newTest = {
			...testData,
			id: this.tests.length + 1,
		}
		this.tests.push(newTest)
		this.saveTests()
		return newTest
	}

	saveTests() {
		// В реальном приложении здесь был бы API запрос к серверу
		console.log('Сохранение тестов:', this.tests)
	}
}

export const testService = new TestService()
