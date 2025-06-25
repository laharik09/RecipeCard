const recipePreviewContainer = document.getElementById("recipePreviewContainer");
const detailedRecipeCard = document.getElementById("detailedRecipeCard");
const backToPreviewsBtn = document.getElementById("backToPreviewsBtn");
const recipeTitle = document.getElementById("recipeTitle");
const recipeImage = document.getElementById("recipeImage");
const prepTimeSpan = document.getElementById("prepTime");
const servingsSpan = document.getElementById("servings");
const toggleIngredients = document.getElementById("toggleIngredients");
const ingredientsList = document.getElementById("ingredients");
const toggleSteps = document.getElementById("toggleSteps");
const stepsList = document.getElementById("steps");
const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");
const timerDisplay = document.getElementById("timeRemaining");
const confettiContainer = document.getElementById('confetti-container');

let currentStepIndex = 0;
let currentCookingSteps = [];
let timerInterval;

const recipes = {
    chocolate: {
        title: "Chocolate Cake",
        image: "https://assets.oyegifts.com/flowers-n-gifts/vendordata/product/choco-truffle-cake-2-cake896choc-AAA.jpg",
        prepTime: "45 minutes",
        servings: "6 people",
        ingredients: [
            "2 cups all-purpose flour",
            "1 and 1/2 cups sugar",
            "3/4 cup cocoa powder",
            "1 and 1/2 tsp baking powder",
            "2 eggs",
            "1 cup milk",
            "1/2 cup vegetable oil",
            "1 tsp vanilla extract"
        ],
        steps: [
            "Preheat your oven to 350°F (175°C).",
            "Mix all dry ingredients together.",
            "Add eggs, milk, oil, and vanilla.",
            "Stir until smooth batter forms.",
            "Pour into a greased cake pan.",
            "Bake for 30–35 minutes.",
            "Let it cool before serving."
        ]
    },
    pasta: {
        title: "Creamy Pasta",
        image: "https://i.pinimg.com/736x/e7/67/94/e76794508f24959797d04e4df319a3af.jpg",
        prepTime: "25 minutes",
        servings: "2 people",
        ingredients: [
            "200g pasta",
            "1 cup cream",
            "1/2 cup grated cheese",
            "2 cloves garlic",
            "Salt and pepper to taste"
        ],
        steps: [
            "Boil the pasta until al dente.",
            "Heat cream and garlic in a pan.",
            "Add cooked pasta and cheese.",
            "Mix well and season.",
            "Serve hot."
        ]
    },
    pancakes: {
        title: "Pancakes",
        image: "https://i.pinimg.com/736x/98/6e/80/986e8020d901fe1c313e9460495ec5c3.jpg",
        prepTime: "15 minutes",
        servings: "4 people",
        ingredients: [
            "1 cup flour",
            "1 tbsp sugar",
            "1 egg",
            "3/4 cup milk",
            "1 tsp baking powder"
        ],
        steps: [
            "Mix all ingredients to form batter.",
            "Heat a pan and pour batter.",
            "Cook both sides until golden.",
            "Serve with syrup."
        ]
    },
    burger: {
        title: "Cheeseburger",
        image: "https://i.pinimg.com/736x/c5/a7/3e/c5a73e03f4256a6de239965003d7387d.jpg",
        prepTime: "20 minutes",
        servings: "1 person",
        ingredients: [
            "1 burger bun",
            "1/4 lb ground beef patty",
            "1 slice cheddar cheese",
            "1 leaf lettuce",
            "2 slices tomato",
            "2 slices onion",
            "Ketchup and mustard, to taste",
            "Salt and pepper, to taste"
        ],
        steps: [
            "Season ground beef patty with salt and pepper.",
            "Heat a grill or skillet over medium-high heat.",
            "Cook patty for 3-5 minutes per side for medium-rare, or until desired doneness.",
            "During the last minute of cooking, place cheese slice on patty to melt.",
            "Lightly toast burger bun halves.",
            "Assemble burger: bottom bun, lettuce, tomato, onion, cheeseburger patty.",
            "Add ketchup and mustard as desired.",
            "Top with the other bun half and serve immediately."
        ]

    }
};


function startTimer(minutes) {
    clearInterval(timerInterval);
    let totalSeconds = minutes * 60;

    timerDisplay.textContent = `${minutes}:00`;

    timerInterval = setInterval(() => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, "0")}`;

        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = "⏰ Time's up!";
        }

        totalSeconds--;
    }, 1000);
}

function resetCookingProgress() {
    currentStepIndex = 0;
    if (currentCookingSteps.length > 0) {
        currentCookingSteps.forEach(step => step.style.background = "none");
    }
    progressBar.style.width = "0%";
    nextBtn.classList.add("hidden");
    nextBtn.disabled = false;
    nextBtn.textContent = "Next Step";
    timerDisplay.textContent = "--";
    clearInterval(timerInterval);
    ingredientsList.classList.add("hidden");
    toggleIngredients.textContent = "Show Ingredients";
    stepsList.classList.add("hidden");
    toggleSteps.textContent = "Show Steps";
}


// --- View Management Functions ---

function showDetailedRecipe(recipeData) {
    // Populate the detailed recipe card
    recipeTitle.textContent = recipeData.title;
    recipeImage.src = recipeData.image;
    prepTimeSpan.textContent = recipeData.prepTime;
    servingsSpan.textContent = recipeData.servings;

    // Clear and populate ingredients
    ingredientsList.innerHTML = '';
    recipeData.ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        ingredientsList.appendChild(li);
    });

    // Clear and populate steps
    stepsList.innerHTML = '';
    recipeData.steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        stepsList.appendChild(li);
    });

    // Update the steps reference for cooking
    currentCookingSteps = stepsList.querySelectorAll("li");

    resetCookingProgress(); // Reset cooking state for the new detailed recipe

    // Animate transition
    recipePreviewContainer.style.opacity = '0';
    recipePreviewContainer.style.transform = 'translateY(-50px)';
    setTimeout(() => {
        recipePreviewContainer.classList.add('hidden'); // Hide preview container after animation
        detailedRecipeCard.classList.remove('hidden'); // Show detailed card
        detailedRecipeCard.style.opacity = '1';
        detailedRecipeCard.style.transform = 'translateX(-50%) scale(1)';
    }, 500); // Match CSS transition duration
}

function showRecipePreviews() {
    detailedRecipeCard.style.opacity = '0';
    detailedRecipeCard.style.transform = 'translateX(-50%) scale(0.8)';
    setTimeout(() => {
        detailedRecipeCard.classList.add('hidden'); // Hide detailed card after animation
        recipePreviewContainer.classList.remove('hidden'); // Show preview container
        recipePreviewContainer.style.opacity = '1';
        recipePreviewContainer.style.transform = 'translateY(0)';
    }, 500); // Match CSS transition duration

    resetCookingProgress(); // Reset cooking state when going back to previews
}


// --- Event Listeners ---

// Toggle Ingredients
toggleIngredients.addEventListener("click", () => {
    ingredientsList.classList.toggle("hidden");
    toggleIngredients.textContent = ingredientsList.classList.contains("hidden") ? "Show Ingredients" : "Hide Ingredients";
});

// Toggle Steps
toggleSteps.addEventListener("click", () => {
    stepsList.classList.toggle("hidden");
    toggleSteps.textContent = stepsList.classList.contains("hidden") ? "Show Steps" : "Hide Steps";
});

// Start Cooking
startBtn.addEventListener("click", () => {
    if (currentCookingSteps.length === 0) return;

    currentStepIndex = 0;
    currentCookingSteps.forEach(step => step.style.background = "none");
    currentCookingSteps[currentStepIndex].style.background = "#c0f5c0";
    progressBar.style.width = `${(1 / currentCookingSteps.length) * 100}%`;

    nextBtn.classList.remove("hidden");

    const currentRecipePrepTimeText = prepTimeSpan.textContent; // Get time from displayed recipe
    const minutesMatch = currentRecipePrepTimeText.match(/(\d+)\s*minutes/);
    if (minutesMatch && minutesMatch[1]) {
        const minutes = parseInt(minutesMatch[1]);
        startTimer(minutes);
    }
});

// Next Step (Modified for confetti feature)
nextBtn.addEventListener("click", () => {
    if (currentStepIndex < currentCookingSteps.length) {
        currentCookingSteps[currentStepIndex].style.background = "none";
    }
    currentStepIndex++;

    if (currentStepIndex < currentCookingSteps.length) {
        currentCookingSteps[currentStepIndex].style.background = "#c0f5c0";
        progressBar.style.width = `${((currentStepIndex + 1) / currentCookingSteps.length) * 100}%`;
    } else {
        // All steps completed
        progressBar.style.width = "100%";
        nextBtn.disabled = true;
        nextBtn.textContent = "Completed!";
        clearInterval(timerInterval);

        // --- TRIGGER CONFFETTI ON COMPLETION ---
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 }
        });
        // --- END CONFFETTI ---
    }
});

// Back to Previews Button
backToPreviewsBtn.addEventListener("click", showRecipePreviews);


// --- Initial Setup: Create Preview Cards ---
document.addEventListener("DOMContentLoaded", () => {
    for (const key in recipes) {
        const recipe = recipes[key];
        const previewCard = document.createElement("div");
        previewCard.classList.add("recipe-preview-card");
        previewCard.dataset.recipeKey = key; // Store the key to easily retrieve recipe data

        previewCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <p>Prep: ${recipe.prepTime}</p>
            <p>Servings: ${recipe.servings}</p>
        `;

        previewCard.addEventListener("click", () => {
            showDetailedRecipe(recipe);
        });

        recipePreviewContainer.appendChild(previewCard);
    }

    // Ensure the detailed card is hidden and previews are visible initially
    detailedRecipeCard.classList.add('hidden');
    recipePreviewContainer.classList.remove('hidden');
});