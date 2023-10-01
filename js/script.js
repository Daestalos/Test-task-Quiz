"use strict"

// :: array with questions
const questionsData = [
    {
        question: 'Сколько вам лет?',
        answers: [
            {
                id: '1',
                value: 'Нужны средства для ребёнка младше 10 лет'
            },
            {
                id: '2',
                value: 'Мне меньше 25 лет'                
            },
            {
                id: '3',
                value: 'От 25 до 35 лет'                
            },
            {
                id: '4',
                value: 'От 35 до 45 лет'                
            },
            {
                id: '5',
                value: 'Мне больше 45 лет'   
            }
        ]
    },
    {
        question: 'Какой у вас тип кожи?',
        answers: [
            {
                id: '1',
                value: 'Сухая'
            },
            {
                id: '2',
                value: 'Нормальная'                
            },
            {
                id: '3',
                value: 'Комбинированная'                
            },
            {
                id: '4',
                value: 'Жирная'                
            },
        ]
    },
    {
        question: 'Беспокоят ли воспаления на лице?',
        answers: [
            {
                id: '1',
                value: 'Да'
            },
            {
                id: '2',
                value: 'Нет'                
            },
            {
                id: '3',
                value: 'Иногда'                
            },

        ]
    }
]

const buttonPrevious = document.querySelector('.questions__buttons__previous');
const buttonNext = document.querySelector('.questions__buttons__next');
const buttonResult = document.querySelector('.questions__buttons__result');


// :: rendering of answers to the selected question
function renderAnswers(index){
    return questionsData[index].answers.map(item => 
        `
            <label class="questions__block__label" for="answer-${item.id}">
            <input class="questions__block__radio" id="answer-${item.id}" type="radio" name="answer" required/>
                ${item.value}
            </label>
        `
    ).join('')
}

// :: question count rendering
function renderIndicator(index){
    const indicatorsMenu = document.querySelector('#indicators__list');
    const indicatorsCount = document.querySelector('.indicators__question');
    const indicators = document.getElementsByClassName('indicators__item');
    indicatorsMenu.innerText = '';

    // :: render indicators
    for (let i=0; i < questionsData.length; i++){
        i === index 
        ? indicatorsMenu.innerHTML += `<ul class="indicators__item indicators__item_active" data-move=${i}></ul>`
        : indicatorsMenu.innerHTML += `<ul class="indicators__item" data-move=${i}></ul>`
    }

    // :: changing the question when clicking on the indicator
    [...indicators].map(element => element.addEventListener('click', () => {
        const answer = document.querySelector('input[name="answer"]:checked');
        answer ? renderQuestions(Number(element.dataset.move)) : alert('Выберите ответ')
    }));

    indicatorsCount.innerText = `Вопрос ${++index} из ${questionsData.length}`;
}

// :: dynamic rendering of questions based on their number
function renderQuestions(index){
    const questionsBlock = document.querySelector('#questions');
    const questionsText = document.querySelector('.questions__text');
    const answers = document.getElementsByClassName('questions__block__radio');

    questionsText.innerText = questionsData[index].question;

    // :: question rendering
    questionsBlock.innerText = '';
    questionsBlock.innerHTML = `
        <div class="questions__block" id="questions">
            ${renderAnswers(index)}
        </div>  
    `;

    // :: visible of buttons
    if(index == 0) {
        buttonResult.classList.add('hidden');
        buttonPrevious.classList.add('hidden');
        buttonNext.classList.remove('hidden');

        buttonNext.dataset.next = index + 1;
    } else if (index === questionsData.length-1){
        buttonResult.classList.remove('hidden');
        buttonPrevious.classList.remove('hidden');
        buttonNext.classList.add('hidden');

        buttonPrevious.dataset.previous = index - 1;
    } else {
        buttonPrevious.classList.remove('hidden');
        buttonNext.classList.remove('hidden');
        buttonResult.classList.add('hidden');

        buttonPrevious.dataset.previous = index - 1;
        buttonNext.dataset.next = index + 1;
    }

    // ::save answer to localStorage
    [...answers].map(element => {
        element.addEventListener('change', () => {
            localStorage.setItem(index, element.id);
        })
    })

    // :: check if answered before
    if (localStorage.getItem(index)){
        setAnswer(index)
    } 

    renderIndicator(index)
}

renderQuestions(0);

// ::set previous answer if user answered before
function setAnswer(answerId){
    const answer = document.getElementById(`${localStorage.getItem(answerId)}`);
    answer.checked = true;
}

function renderResults(data){
    const quizQuestionsContainer = document.querySelector('.quiz-questions');
    const ProductsContainer = document.querySelector('.products__container');
    const quizHeaderTitle = document.querySelector('.quiz-header__title');
    const quizHeaderText = document.querySelector('.quiz-header__text');
    const quizResult = document.querySelector('.quiz-result');

    quizResult.classList.remove('hidden');
    quizQuestionsContainer.classList.add('hidden');

    quizHeaderTitle.innerText = 'Результат';
    quizHeaderText.innerText = 'Мы подобрали для вас наиболее подходящие средства';

    ProductsContainer.innerText = '';

    // :: product rendering
    data.map(item => {
        ProductsContainer.innerHTML += `
        <div class="products__item" data-id='${item.id}'>
            <div class="products__image">
                <img class="products__product-image" src="${item.image}"/>
                <img class="products__like" src="./images/heart.svg">
            </div>

            <div class="products__item__text">
                <h2>${item.title}</h2>
                ${ item.oldPrice 
                    ? `<span class="products__item__old-price">${item.oldPrice}</span><span class="products__item__new-price"> ${item.price}</span>` 
                    : `<span class="products__item__new-price">${item.price}</span>`}
                
            </div>
        </div>
        `
    })
}

buttonNext.addEventListener('click', () => {
    // :: check if the answer is checked
    const answer = document.querySelector('input[name="answer"]:checked');

    answer ? renderQuestions(Number(buttonNext.dataset.next)) : alert('Выберите ответ')
})

buttonPrevious.addEventListener('click', () => {
    renderQuestions(Number(buttonPrevious.dataset.previous));
})

buttonResult.addEventListener('click', async () => {
    let productData = await fetch('../services/products.json').then(res => res.json())

    renderResults(productData)
})