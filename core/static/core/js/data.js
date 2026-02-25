/* ============================================
   VERITY — Sample Test Data
   ============================================ */
fetch("https://verityb-1.onrender.com")
  .then(response => response.json())
  .then(data => {
    console.log(data);
    document.getElementById("quiz-container").innerText = JSON.stringify(data);
  });
const VERITY_TESTS = [
  {
    id: 'sat-math-1',
    name: 'SAT Math — Module 1',
    category: 'SAT',
    icon: '📐',
    color: '#3b82f6',
    duration: 35,
    description: 'Algebra, problem-solving, and data analysis',
    questions: [
      {
        id: 1,
        text: 'If 3x + 7 = 22, what is the value of x?',
        options: ['3', '4', '5', '6'],
        correct: 2,
        explanation: '3x + 7 = 22 → 3x = 15 → x = 5'
      },
      {
        id: 2,
        text: 'A line passes through the points (2, 5) and (4, 11). What is the slope of this line?',
        options: ['2', '3', '4', '6'],
        correct: 1,
        explanation: 'slope = (11-5)/(4-2) = 6/2 = 3'
      },
      {
        id: 3,
        text: 'What is the value of √144 + √81?',
        options: ['19', '21', '23', '25'],
        correct: 1,
        explanation: '√144 = 12, √81 = 9 → 12 + 9 = 21'
      },
      {
        id: 4,
        text: 'If f(x) = 2x² - 3x + 1, what is f(3)?',
        options: ['8', '10', '12', '14'],
        correct: 1,
        explanation: 'f(3) = 2(9) - 3(3) + 1 = 18 - 9 + 1 = 10'
      },
      {
        id: 5,
        text: 'The price of a shirt decreased from $80 to $60. What is the percent decrease?',
        options: ['20%', '25%', '30%', '33%'],
        correct: 1,
        explanation: '(80-60)/80 × 100 = 25%'
      },
      {
        id: 6,
        text: 'What is the solution to the inequality 2x - 5 > 9?',
        options: ['x > 2', 'x > 5', 'x > 7', 'x > 9'],
        correct: 2,
        explanation: '2x - 5 > 9 → 2x > 14 → x > 7'
      },
      {
        id: 7,
        text: 'If a circle has an area of 49π, what is its diameter?',
        options: ['7', '14', '21', '49'],
        correct: 1,
        explanation: 'πr² = 49π → r = 7 → diameter = 14'
      },
      {
        id: 8,
        text: 'What is the median of: 3, 7, 9, 12, 15?',
        options: ['7', '9', '12', '9.2'],
        correct: 1,
        explanation: 'The middle value of the sorted set is 9'
      }
    ]
  },
  {
    id: 'sat-reading-1',
    name: 'SAT Reading & Writing — Module 1',
    category: 'SAT',
    icon: '📚',
    color: '#6366f1',
    duration: 32,
    description: 'Reading comprehension and grammar',
    questions: [
      {
        id: 1,
        text: 'Which choice best completes the sentence? "The scientist\'s findings were ______ by several independent laboratories, confirming the validity of her results."',
        options: ['contradicted', 'replicated', 'undermined', 'fabricated'],
        correct: 1,
        explanation: '"Replicated" means reproduced, which fits confirming validity.'
      },
      {
        id: 2,
        text: 'In context, "articulate" most nearly means:',
        options: ['jointed', 'eloquent', 'express clearly', 'move freely'],
        correct: 2,
        explanation: '"Articulate" as a verb means to express clearly.'
      },
      {
        id: 3,
        text: 'Which transition best connects these sentences? "The population grew rapidly. ______, resources became scarce."',
        options: ['However', 'Consequently', 'Meanwhile', 'Nevertheless'],
        correct: 1,
        explanation: '"Consequently" shows cause-and-effect relationship.'
      },
      {
        id: 4,
        text: 'Which revision corrects the error? "Neither the students nor the teacher were aware of the change."',
        options: ['No change needed', 'was aware', 'has been aware', 'being aware'],
        correct: 1,
        explanation: 'With "neither...nor," the verb agrees with the nearest subject ("teacher" = singular).'
      },
      {
        id: 5,
        text: '"The author\'s tone in the passage can best be described as:"',
        options: ['dismissive and sarcastic', 'cautiously optimistic', 'overwhelmingly negative', 'indifferent'],
        correct: 1,
        explanation: 'The measured language suggests cautious optimism.'
      },
      {
        id: 6,
        text: 'Which choice provides the most relevant supporting evidence?',
        options: ['A personal anecdote', 'A statistical study from a peer-reviewed journal', 'An opinion from a blog post', 'A fictional example'],
        correct: 1,
        explanation: 'Peer-reviewed statistical data provides the strongest evidence.'
      }
    ]
  },
  {
    id: 'act-english-1',
    name: 'ACT English — Practice Set',
    category: 'ACT',
    icon: '✏️',
    color: '#10b981',
    duration: 25,
    description: 'Grammar, usage, and rhetorical skills',
    questions: [
      {
        id: 1,
        text: 'Choose the correct form: "Each of the students ______ required to submit their assignment by Friday."',
        options: ['are', 'is', 'were', 'have been'],
        correct: 1,
        explanation: '"Each" is singular and requires the singular verb "is."'
      },
      {
        id: 2,
        text: 'Which is the most concise revision? "The reason why she left is because she was tired."',
        options: ['No change', 'The reason she left is that she was tired', 'She left because she was tired', 'The reason why is because of tiredness'],
        correct: 2,
        explanation: '"She left because she was tired" is the most concise and correct form.'
      },
      {
        id: 3,
        text: 'Select the correct punctuation: "The dog a golden retriever loved to play fetch."',
        options: ['The dog, a golden retriever, loved to play fetch.', 'The dog a golden retriever; loved to play fetch.', 'The dog: a golden retriever loved to play fetch.', 'No change needed'],
        correct: 0,
        explanation: 'Commas are needed to set off the appositive phrase.'
      },
      {
        id: 4,
        text: '"Walking through the park, the flowers were beautiful." What is wrong with this sentence?',
        options: ['Nothing is wrong', 'Dangling modifier', 'Subject-verb disagreement', 'Incorrect tense'],
        correct: 1,
        explanation: 'The participial phrase "Walking through the park" modifies "flowers," creating a dangling modifier.'
      },
      {
        id: 5,
        text: 'Which word best maintains the formal tone of the passage?',
        options: ['awesome', 'remarkable', 'cool', 'nice'],
        correct: 1,
        explanation: '"Remarkable" is the most appropriate for a formal register.'
      }
    ]
  },
  {
    id: 'act-math-1',
    name: 'ACT Math — Practice Set',
    category: 'ACT',
    icon: '🔢',
    color: '#f59e0b',
    duration: 30,
    description: 'Pre-algebra through trigonometry',
    questions: [
      {
        id: 1,
        text: 'If 5(x - 2) = 3x + 6, what is x?',
        options: ['4', '6', '8', '10'],
        correct: 2,
        explanation: '5x - 10 = 3x + 6 → 2x = 16 → x = 8'
      },
      {
        id: 2,
        text: 'What is the area of a triangle with base 10 and height 7?',
        options: ['17', '35', '70', '24.5'],
        correct: 1,
        explanation: 'Area = ½ × base × height = ½ × 10 × 7 = 35'
      },
      {
        id: 3,
        text: 'What is sin(30°)?',
        options: ['√3/2', '1/2', '√2/2', '1'],
        correct: 1,
        explanation: 'sin(30°) = 1/2 is a standard trigonometric value.'
      },
      {
        id: 4,
        text: 'If log₂(x) = 5, what is x?',
        options: ['10', '25', '32', '64'],
        correct: 2,
        explanation: '2⁵ = 32'
      },
      {
        id: 5,
        text: 'What is the probability of rolling a sum of 7 with two dice?',
        options: ['1/6', '1/12', '5/36', '7/36'],
        correct: 0,
        explanation: 'There are 6 ways to get 7 out of 36 total outcomes: 6/36 = 1/6.'
      }
    ]
  },
  {
    id: 'gre-verbal-1',
    name: 'GRE Verbal — Practice Set',
    category: 'GRE',
    icon: '🎓',
    color: '#8b5cf6',
    duration: 20,
    description: 'Text completion and sentence equivalence',
    questions: [
      {
        id: 1,
        text: 'Select the word that best completes the sentence: "The professor\'s lecture was so ______ that several students fell asleep."',
        options: ['riveting', 'soporific', 'enlightening', 'provocative'],
        correct: 1,
        explanation: '"Soporific" means tending to induce drowsiness.'
      },
      {
        id: 2,
        text: '"The artist was known for her ______ style, combining elements from many different traditions."',
        options: ['monotonous', 'eclectic', 'austere', 'provincial'],
        correct: 1,
        explanation: '"Eclectic" means deriving from a variety of sources.'
      },
      {
        id: 3,
        text: '"Despite his ______ manner, he was actually quite warm and generous in private."',
        options: ['affable', 'brusque', 'gregarious', 'amiable'],
        correct: 1,
        explanation: '"Brusque" means abrupt or offhand, contrasting with warmth.'
      },
      {
        id: 4,
        text: 'Choose two words that create sentences with similar meanings: "The treaty was largely ______, with neither side willing to enforce its terms."',
        options: ['binding', 'nugatory', 'consequential', 'ineffectual'],
        correct: 1,
        explanation: '"Nugatory" and "ineffectual" both suggest being without effect.'
      }
    ]
  }
];

// Make it globally available
if (typeof window !== 'undefined') {
  window.VERITY_TESTS = VERITY_TESTS;
}
