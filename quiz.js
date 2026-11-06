const questions = [
  {
    text: "А когда с человеком может произойти дрожемент?",
    answers: [
      { text: "Когда он влюбляется", correct: false },
      { text: "Когда он идёт шопиться", correct: false },
      { text: "Когда он слышит смешную шутку", correct: false },
      { text: "Когда он боится, пугается", correct: true,
        explanation: "Лексема «дрожемент» имплицирует состояние крайнего напряжения и страха: «У меня всегда дрожемент в ногах, когда копы подходят»." }
    ]
  },
  {
    text: "Говорят, Антон заовнил всех. Это ещё как понимать?",
    answers: [
      { text: "Как так, заовнил? Ну и хамло. Кто с ним теперь дружить-то будет?", correct: false },
      { text: "Антон очень надоедливый и въедливый человек, всех задолбал", correct: false },
      { text: "Молодец, Антон, всех победил!", correct: true,
        explanation: "Термин «заовнить» заимствован из английского языка, он происходит от слова own и переводится как «победить», «завладеть», «получить»." },
      { text: "Нет ничего плохого в том, что Антон тщательно выбирает себе друзей", correct: false }
    ]
  },
  {
    text: "А фразу «заскамить мамонта» как понимать?",
    answers: [
      { text: "Разозлить кого-то из родителей", correct: false },
      { text: "Увлекаться археологией", correct: false },
      { text: "Развести недотепу на деньги", correct: true,
        explanation: "Заскамить мамонта - значит обмануть или развести на деньги. Почему мамонта? Потому что мошенники часто выбирают в жертвы пожилых людей (древних, как мамонты), которых легко обвести вокруг пальца." },
      { text: "Оскорбить пожилого человека", correct: false }
    ]
  },
  {
    text: "Кто такие бефефе?",
    answers: [
      { text: "Вши?", correct: false },
      { text: "Милые котики, такие милые, что бефефе", correct: false },
      { text: "Лучшие друзья", correct: true,
        explanation: "Бефефе - это лучшие друзья. Этакая аббревиатура от английского выражения best friends forever." },
      { text: "Люди, которые не держат слово", correct: false }
    ]
  },
  {
    text: "Что из перечисленного можно назвать крашем, если ты чиллишь в компании и вдруг залипаешь на кого-то?",
    answers: [
      { text: "Человек, который тебе очень нравится и вызывает симпатию.", correct: true,
        explanation: "«Краш» - это объект симпатии; «чиллить» - расслабляться, отдыхать; «залипать» - засматриваться или задумываться." },
      { text: "Тот, на кого приятно смотреть и хочется общаться.", correct: true,
        explanation: "«Краш» - это объект симпатии; «чиллить» - расслабляться, отдыхать; «залипать» - засматриваться или задумываться." },
      { text: "Твоя сильно накрашенная подруга, которая переоценила свой макияж.", correct: false },
      { text: "Трэш в более мягкой интерпретации.", correct: false }
    ]
  }
];

function shuffle(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

const state = {
  questions: [],
  currentIndex: 0,
  answeredCount: 0,
  correctCount: 0,
  answeredFlags: []
};

function initQuiz() {
  const quizEl   = document.getElementById('quiz');
  const statusEl = document.getElementById('status');
  const statsEl  = document.getElementById('stats');

  state.questions = shuffle(questions).map(q => ({
    ...q,
    answers: shuffle(q.answers)
  }));
  state.answeredFlags = state.questions.map(() => false);

  console.log(questions);
  quizEl.innerHTML = '';
  statusEl.textContent = '';
  statusEl.classList.remove('visible');
  statsEl.textContent = '';
  statsEl.classList.remove('visible');

  state.questions.forEach((q, i) => {
    quizEl.appendChild(createQuestionElement(q, i));
  });

  lockAllExcept(0);
}

function createQuestionElement(q, index) {
  const wrap = document.createElement('div');
  wrap.className = 'question';
  wrap.dataset.index = index;
  wrap.id = 'question-' + index;

  const header = document.createElement('div');
  header.className = 'question-header';

  const num = document.createElement('span');
  num.className = 'q-number';
  num.textContent = index + 1;

  const text = document.createElement('span');
  text.className = 'q-text';
  text.textContent = q.text;

  const marker = document.createElement('span');
  marker.className = 'marker';

  header.append(num, text, marker);

  const answersBox = document.createElement('div');
  answersBox.className = 'answers';

  q.answers.forEach((ans, ai) => {
    answersBox.appendChild(createAnswerElement(ans, index, ai));
  });

  const correctBlock = document.createElement('div');
  correctBlock.className = 'correct-answer-block';
  const correctAns = q.answers.find(a => a.correct);
  correctBlock.innerHTML =
    '<b>Правильный ответ:</b> ' + correctAns.text +
    '<br><i>' + (correctAns.explanation || '') + '</i>';

  wrap.append(header, answersBox, correctBlock);
  return wrap;
}

function createAnswerElement(ans, qIndex, aIndex) {
  const el = document.createElement('div');
  el.className = 'answer';
  el.setAttribute('data-correct', ans.correct);
  el.setAttribute('data-q-index', qIndex);
  el.setAttribute('data-a-index', aIndex);
  el.textContent = ans.text;

  if (ans.correct) {
    const exp = document.createElement('div');
    exp.className = 'explanation';
    exp.textContent = ans.explanation || '';
    el.appendChild(exp);
  }

  el.addEventListener('click', () => handleAnswerClick(el, qIndex));
  return el;
}

function handleAnswerClick(el, qIndex) {
  if (qIndex !== state.currentIndex) return;
  if (state.answeredFlags[qIndex]) return;
  state.answeredFlags[qIndex] = true;
  state.answeredCount++;

  const questionEl = document.getElementById('question-' + qIndex);
  const marker = questionEl.querySelector('.marker');
  const answersBox = questionEl.querySelector('.answers');
  const allAnswers = [...answersBox.querySelectorAll('.answer')];
  const isCorrect = el.getAttribute('data-correct') === 'true';

  if (isCorrect) {
    state.correctCount++;
    el.classList.add('correct');
    marker.textContent = '✔';
    marker.classList.add('ok');
  } else {
    el.classList.add('wrong');
    marker.textContent = '✘';
    marker.classList.add('bad');
  }
  allAnswers.forEach(a => a.classList.add('disabled'));
  const wrongAnswers = allAnswers.filter(a => a !== el || !isCorrect);

  setTimeout(() => {
    wrongAnswers.forEach((a, i) => {
      setTimeout(() => {
        a.classList.add('slide-out');
      }, i * 180);
    });
  }, 900);

  const totalSlideTime = 900 + wrongAnswers.length * 180 + 400;

  if (isCorrect) {
    setTimeout(() => {
      el.classList.add('fade-out');
      setTimeout(() => {
        questionEl.style.display = 'none';
        goToNextQuestion(qIndex);
      }, 600);
    }, totalSlideTime);
  } else {
    setTimeout(() => {
      questionEl.style.display = 'none';
      goToNextQuestion(qIndex);
    }, totalSlideTime);
  }
}

function goToNextQuestion(prevIndex) {
  const nextIndex = prevIndex + 1;

  if (nextIndex < state.questions.length) {
    state.currentIndex = nextIndex;
    lockAllExcept(nextIndex);
  } else {
    finishQuiz();
  }
}

function lockAllExcept(activeIndex) {
  state.questions.forEach((_, i) => {
    const qEl = document.getElementById('question-' + i);
    if (!qEl) return;
    if (i === activeIndex) {
      qEl.classList.remove('locked');
    } else if (!state.answeredFlags[i]) {
      qEl.classList.add('locked');
    }
  });
}

function finishQuiz() {
  const statusEl = document.getElementById('status');
  const statsEl  = document.getElementById('stats');

  statusEl.textContent = 'Вопросы закончились';
  statusEl.classList.add('visible');

  statsEl.textContent =
    'Правильных ответов: ' + state.correctCount +
    ' из ' + state.questions.length;
  statsEl.classList.add('visible');

  state.questions.forEach((_, i) => {
    const qEl = document.getElementById('question-' + i);
    if (!qEl) return;

    qEl.style.display = '';
    qEl.classList.remove('locked');
    qEl.classList.add('revealable');

    qEl.querySelectorAll('.answer').forEach(a => {
      a.classList.remove('slide-out', 'disabled', 'correct', 'wrong');
    });
    const m = qEl.querySelector('.marker');
    m.textContent = '';
    m.className = 'marker';

    qEl.onclick = () => {
      const block = qEl.querySelector('.correct-answer-block');
      const open = block.style.display === 'block';
      block.style.display = open ? 'none' : 'block';
    };
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuiz);
} else {
  initQuiz();
}