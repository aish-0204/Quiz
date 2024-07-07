let quizzes = [];

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-question').addEventListener('click', addQuestion);
    document.getElementById('quiz-form').addEventListener('submit', saveQuiz);
    document.getElementById('select-quiz').addEventListener('change', displayQuiz);
    document.getElementById('submit-quiz').addEventListener('click', submitQuiz);
    loadQuizzes();
});

function addQuestion() {
    const questionsContainer = document.getElementById('questions-container');
    const questionIndex = questionsContainer.children.length - 1;

    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');

    questionDiv.innerHTML = `
        <label for="question-${questionIndex}">Question:</label>
        <input type="text" id="question-${questionIndex}" required>
        <label for="options-${questionIndex}">Options (comma separated):</label>
        <input type="text" id="options-${questionIndex}" required>
        <label for="answer-${questionIndex}">Correct Answer:</label>
        <input type="text" id="answer-${questionIndex}" required>
    `;

    questionsContainer.appendChild(questionDiv);
}

function saveQuiz(event) {
    event.preventDefault();

    const title = document.getElementById('quiz-title').value;
    const questions = [];

    document.querySelectorAll('.question').forEach((questionDiv, index) => {
        const questionText = document.getElementById(`question-${index}`).value;
        const options = document.getElementById(`options-${index}`).value.split(',').map(option => option.trim());
        const correctAnswer = document.getElementById(`answer-${index}`).value;

        questions.push({
            questionText,
            options,
            correctAnswer
        });
    });

    const quiz = {
        title,
        questions
    };

    quizzes.push(quiz);
    saveQuizzesToLocalStorage();
    loadQuizzes();
    document.getElementById('quiz-form').reset();
    document.getElementById('questions-container').innerHTML = '<h3>Questions</h3>';
}

function saveQuizzesToLocalStorage() {
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
}

function loadQuizzes() {
    const storedQuizzes = localStorage.getItem('quizzes');
    if (storedQuizzes) {
        quizzes = JSON.parse(storedQuizzes);
    }

    const selectQuiz = document.getElementById('select-quiz');
    selectQuiz.innerHTML = '<option value="">Select a quiz</option>';

    quizzes.forEach((quiz, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = quiz.title;
        selectQuiz.appendChild(option);
    });
}

function displayQuiz() {
    const quizIndex = document.getElementById('select-quiz').value;
    const quizQuestionsContainer = document.getElementById('quiz-questions');

    if (quizIndex === '') {
        quizQuestionsContainer.innerHTML = '';
        return;
    }

    const quiz = quizzes[quizIndex];
    quizQuestionsContainer.innerHTML = '';

    quiz.questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        const optionsHtml = question.options.map((option, optionIndex) => `
            <div>
                <input type="radio" id="question-${index}-option-${optionIndex}" name="question-${index}" value="${option}">
                <label for="question-${index}-option-${optionIndex}">${option}</label>
            </div>
        `).join('');

        questionDiv.innerHTML = `
            <p>${question.questionText}</p>
            ${optionsHtml}
        `;

        quizQuestionsContainer.appendChild(questionDiv);
    });
}

function submitQuiz() {
    const quizIndex = document.getElementById('select-quiz').value;

    if (quizIndex === '') {
        alert('Please select a quiz');
        return;
    }

    const quiz = quizzes[quizIndex];
    let score = 0;

    quiz.questions.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);

        if (selectedOption && selectedOption.value === question.correctAnswer) {
            score++;
        }
    });

    alert(`Your score is ${score} out of ${quiz.questions.length}`);
}
