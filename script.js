// Star background generation
function createStars() {
    const container = document.getElementById('stars-container');
    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = Math.random() * 2 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDuration = Math.random() * 3 + 2 + 's';
        star.style.opacity = Math.random();
        container.appendChild(star);
    }
}

// Navigation handling
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionId = btn.dataset.section;
            sections.forEach(section => {
                section.classList.add('hidden');
                section.classList.remove('active');
            });
            const targetSection = document.getElementById(sectionId);
            targetSection.classList.remove('hidden');
            setTimeout(() => targetSection.classList.add('active'), 10);
        });
    });
}

// Quiz data
const quizData = [
    {
        question: "რა არის მზის სისტემის ყველაზე დიდი პლანეტა?",
        options: ["სატურნი", "იუპიტერი", "ურანი", "ნეპტუნი"],
        correct: 1
    },
    {
        question: "რამდენი ბუნებრივი თანამგზავრი ჰყავს დედამიწას?",
        options: ["არცერთი", "ერთი", "ორი", "სამი"],
        correct: 1
    },
    {
        question: "რომელი გალაქტიკის ნაწილია მზის სისტემა?",
        options: ["ანდრომედას გალაქტიკა", "ირმის ნახტომი", "სამკუთხედი გალაქტიკა", "მაგელანის ღრუბელი"],
        correct: 1
    },
    {
        question: "რა მანძილზეა მზე დედამიწიდან?",
        options: ["50 მილიონი კმ", "150 მილიონი კმ", "250 მილიონი კმ", "350 მილიონი კმ"],
        correct: 1
    },
    {
        question: "რომელია მზესთან ყველაზე ახლოს მდებარე პლანეტა?",
        options: ["ვენერა", "მარსი", "მერკური", "დედამიწა"],
        correct: 2
    }
];

let currentQuiz = 0;
let score = 0;
let answeredQuestions = new Set();

// Quiz functions
function initQuiz() {
    currentQuiz = 0;
    score = 0;
    answeredQuestions.clear();
    loadQuiz();
    updateNavigationButtons();
}

function loadQuiz() {
    const questionContainer = document.getElementById('question-container');
    const optionsContainer = document.getElementById('options-container');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const progressBar = document.getElementById('progress-bar');
    const feedbackContainer = document.getElementById('feedback-container');

    feedbackContainer.classList.add('hidden');
    feedbackContainer.innerHTML = '';

    const currentQuizData = quizData[currentQuiz];
    questionContainer.innerHTML = `<h2 class="text-xl font-bold">${currentQuizData.question}</h2>`;
    optionsContainer.innerHTML = '';

    currentQuestionSpan.textContent = currentQuiz + 1;
    totalQuestionsSpan.textContent = quizData.length;
    progressBar.style.width = `${((currentQuiz + 1) / quizData.length) * 100}%`;

    currentQuizData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'quiz-option w-full text-left p-4 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 transition border border-blue-700';
        button.innerHTML = option;
        
        if (answeredQuestions.has(currentQuiz)) {
            button.disabled = true;
            if (index === currentQuizData.correct) {
                button.classList.add('correct-answer');
            }
        } else {
            button.addEventListener('click', () => selectAnswer(index));
        }
        
        optionsContainer.appendChild(button);
    });

    updateNavigationButtons();
}

function selectAnswer(index) {
    if (answeredQuestions.has(currentQuiz)) return;

    const feedback = document.getElementById('feedback-container');
    const options = document.querySelectorAll('.quiz-option');
    const currentQuizData = quizData[currentQuiz];

    answeredQuestions.add(currentQuiz);
    
    options.forEach(option => option.disabled = true);
    
    if (index === currentQuizData.correct) {
        options[index].classList.add('correct-answer');
        feedback.innerHTML = `
            <div class="bg-green-900/40 border border-green-600 rounded-lg p-4">
                <p class="text-green-400">სწორია! 🎉</p>
            </div>
        `;
        score++;
    } else {
        options[index].classList.add('wrong-answer');
        options[currentQuizData.correct].classList.add('correct-answer');
        feedback.innerHTML = `
            <div class="bg-red-900/40 border border-red-600 rounded-lg p-4">
                <p class="text-red-400">არასწორია! სწორი პასუხია: ${currentQuizData.options[currentQuizData.correct]}</p>
            </div>
        `;
    }

    feedback.classList.remove('hidden');
    updateNavigationButtons();
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (currentQuiz > 0) {
        prevBtn.classList.remove('hidden');
    } else {
        prevBtn.classList.add('hidden');
    }

    if (currentQuiz === quizData.length - 1) {
        nextBtn.textContent = answeredQuestions.has(currentQuiz) ? 'დასრულება' : 'შემდეგი';
    } else {
        nextBtn.textContent = 'შემდეგი';
    }

    nextBtn.disabled = !answeredQuestions.has(currentQuiz);
}

function showResults() {
    const quizContainer = document.getElementById('quiz-container');
    const percentage = (score / quizData.length) * 100;
    
    quizContainer.innerHTML = `
        <div class="text-center">
            <h2 class="text-2xl font-bold mb-4">ქვიზი დასრულებულია!</h2>
            <p class="text-xl mb-4">თქვენი ქულაა: ${score}/${quizData.length} (${percentage}%)</p>
            <div class="mb-6">
                ${getResultMessage(percentage)}
            </div>
            <button onclick="initQuiz()" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                თავიდან დაწყება
            </button>
        </div>
    `;
}

function getResultMessage(percentage) {
    if (percentage === 100) {
        return '<p class="text-green-400">შესანიშნავი! თქვენ ბრწყინვალედ იცით ასტრონომია! 🌟</p>';
    } else if (percentage >= 80) {
        return '<p class="text-green-400">ძალიან კარგი! თქვენ კარგად იცით ასტრონომია! 🎉</p>';
    } else if (percentage >= 60) {
        return '<p class="text-yellow-400">კარგია! მცირე დახვეწა გჭირდებათ! 👍</p>';
    } else {
        return '<p class="text-red-400">გააგრძელეთ მეცადინეობა! 📚</p>';
    }
}

// Game functionality
let gameActive = false;
let gameScore = 0;
let gameLevel = 1;

function initGame() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const spacecraft = new THREE.Mesh(geometry, material);
    scene.add(spacecraft);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        if (gameActive) {
            spacecraft.rotation.x += 0.01;
            spacecraft.rotation.y += 0.01;
        }
        renderer.render(scene, camera);
    }

    animate();

    document.getElementById('start-game').addEventListener('click', () => {
        gameActive = true;
        document.getElementById('mission-info').classList.remove('hidden');
        document.getElementById('mission-description').textContent = `მისია ${gameLevel}: შეაგროვე ${gameLevel * 10} ვარსკვლავი`;
    });
}

// Event listeners
document.getElementById('next-btn').addEventListener('click', () => {
    if (currentQuiz === quizData.length - 1) {
        showResults();
    } else {
        currentQuiz++;
        loadQuiz();
    }
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentQuiz > 0) {
        currentQuiz--;
        loadQuiz();
    }
});

document.querySelector('[data-section="quiz"]').addEventListener('click', initQuiz);

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    initNavigation();
    loadQuiz();
    initGame();

    document.getElementById('home').classList.remove('hidden');
    setTimeout(() => document.getElementById('home').classList.add('active'), 10);
});





document.addEventListener('DOMContentLoaded', () => {
    // Show home section by default
    document.getElementById('home').classList.remove('hidden');
    
    // Navigation buttons logic
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.dataset.section;
            
            sections.forEach(section => {
                section.classList.add('hidden');
            });
            
            document.getElementById(sectionId).classList.remove('hidden');
        });
    });

    // Modal logic for gallery images
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeModal = document.getElementById('closeModal');

    // Add click event to all gallery items
    document.querySelectorAll('#gallery-grid > div').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.querySelector('p');
            
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            modalCaption.textContent = caption.textContent;
            imageModal.classList.remove('hidden');
        });
    });

    // Close modal on button click
    closeModal.addEventListener('click', () => {
        imageModal.classList.add('hidden');
    });

    // Close modal on outside click
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            imageModal.classList.add('hidden');
        }
    });

    // Close modal on ESC key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !imageModal.classList.contains('hidden')) {
            imageModal.classList.add('hidden');
        }
    });
});









// Add this to your existing script
document.addEventListener('DOMContentLoaded', () => {
    // Show home section and animate content
    const home = document.getElementById('home');
    const featuresGrid = document.getElementById('features-grid');
    const coursesGrid = document.getElementById('courses-grid');
    
    // Remove hidden class and add active class
    home.classList.remove('hidden');
    home.classList.add('active');
    
    // Animate features and courses with a slight delay
    setTimeout(() => {
        featuresGrid.style.opacity = '1';
        featuresGrid.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            coursesGrid.style.opacity = '1';
            coursesGrid.style.transform = 'translateY(0)';
        }, 200);
    }, 100);

    // Rest of your existing initialization code...
    createStars();
    initNavigation();
    loadQuiz();
    initGame();
});

// Update your initNavigation function
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionId = btn.dataset.section;
            sections.forEach(section => {
                if (section.id === sectionId) {
                    section.classList.remove('hidden');
                    section.classList.add('active');
                } else {
                    section.classList.add('hidden');
                    section.classList.remove('active');
                }
            });
        });
    });
}