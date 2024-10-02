document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('response-form');
    const toneSelect = document.getElementById('tone');
    const responseOutput = document.getElementById('response-output');
    const responseText = document.getElementById('response-text');
    const copyButton = document.getElementById('copy-button');

    // Fetch tones from the backend
    async function fetchTones() {
        try {
            const response = await fetch('https://nudge-8two.onrender.com/api/tones');
            const data = await response.json();
            if (data && data.data) {
                populateTones(data.data.tones);
            }
        } catch (error) {
            console.error('Error fetching tones:', error);
        }
    }

    // Populate tones in the select dropdown
    function populateTones(tones) {
        tones.forEach(tone => {
            const option = document.createElement('option');
            option.value = tone;
            option.textContent = tone.charAt(0).toUpperCase() + tone.slice(1);
            toneSelect.appendChild(option);
        });
    }

    // Handle form submission
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        const text = document.getElementById('text').value;
        const tone = toneSelect.value;

        try {
            const response = await fetch('https://nudge-8two.onrender.com/api/analyze-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, tone }),
            });
            const result = await response.json();
            if (result && result.data) {
                displayResponse(result.data);
            } else {
                displayResponse('Failed to generate a response. Try again.');
            }
        } catch (error) {
            displayResponse('An error occurred. Please try again later.');
        }
    });

    // Display the generated response
    function displayResponse(text) {
        responseText.textContent = text;
        responseOutput.style.display = 'block';
    }

    // Copy the generated response to clipboard
    copyButton.addEventListener('click', function() {
        const responseContent = responseText.textContent;
        if (responseContent) {
            navigator.clipboard.writeText(responseContent).then(() => {
                alert('Response copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy response:', err);
            });
        }
    });

    // Initial call to fetch available tones
    fetchTones();
});
