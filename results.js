// Dynamic Client Results Image Loader
// Automatically loads image pairs from the results folder (1-old.jpg, 1-new.jpg, etc.)

document.addEventListener('DOMContentLoaded', function() {
    const resultsContainer = document.getElementById('results-container');
    if (!resultsContainer) return;

    let currentIndex = 1;
    let resultPairs = [];

    // Function to check if an image exists
    function imageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    // Function to load all available image pairs
    async function loadImagePairs() {
        let index = 1;

        while (true) {
            const oldImage = `results/${index}-old.jpg`;
            const newImage = `results/${index}-new.jpg`;

            // Check if both old and new images exist
            const oldExists = await imageExists(oldImage);
            const newExists = await imageExists(newImage);

            if (oldExists && newExists) {
                resultPairs.push({
                    index: index,
                    old: oldImage,
                    new: newImage
                });
                index++;
            } else {
                // Stop when we can't find the next pair
                break;
            }
        }

        // Display all found pairs
        displayResults();
    }

    // Function to create a result comparison viewer
    function createResultViewer(pair, displayIndex) {
        const viewer = document.createElement('div');
        viewer.className = 'result-viewer';
        viewer.innerHTML = `
            <div class="result-image-container">
                <img src="${pair.old}" alt="Before Credit Repair" class="result-image active" data-type="old">
                <img src="${pair.new}" alt="After Credit Repair" class="result-image" data-type="new">
                <button class="result-arrow result-arrow-left" data-action="prev">‹</button>
                <button class="result-arrow result-arrow-right" data-action="next">›</button>
            </div>
        `;

        // Get elements
        const images = viewer.querySelectorAll('.result-image');
        const buttons = viewer.querySelectorAll('.result-arrow');

        let currentState = 'old';
        let autoRotateInterval;

        // Function to switch between old and new
        function switchImage(state) {
            currentState = state;

            images.forEach(img => {
                if (img.dataset.type === state) {
                    img.classList.add('active');
                } else {
                    img.classList.remove('active');
                }
            });
        }

        // Auto-rotate between before and after every 5 seconds
        function startAutoRotate() {
            autoRotateInterval = setInterval(() => {
                currentState = currentState === 'old' ? 'new' : 'old';
                switchImage(currentState);
            }, 5000);
        }

        // Stop auto-rotate
        function stopAutoRotate() {
            if (autoRotateInterval) {
                clearInterval(autoRotateInterval);
            }
        }

        // Button controls - arrows toggle between old and new
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                stopAutoRotate();

                // Toggle between old and new regardless of which arrow is clicked
                currentState = currentState === 'old' ? 'new' : 'old';
                switchImage(currentState);

                // Restart auto-rotate after user interaction
                setTimeout(() => {
                    startAutoRotate();
                }, 10000); // Restart after 10 seconds
            });
        });

        // Start auto-rotation
        startAutoRotate();

        return viewer;
    }

    // Function to display all results
    function displayResults() {
        if (resultPairs.length === 0) {
            resultsContainer.innerHTML = '<p style="text-align: center; color: #666;">No client results available at this time.</p>';
            return;
        }

        resultPairs.forEach((pair, index) => {
            const viewer = createResultViewer(pair, index + 1);
            resultsContainer.appendChild(viewer);
        });
    }

    // Initialize
    loadImagePairs();
});
