document.addEventListener('DOMContentLoaded', () => {
    const tutorialContent = document.getElementById('tutorial-content');
    
    function loadTutorial(ruleset) {
        console.log('Loading tutorial for:', ruleset);
        fetch(`tutorials/${ruleset}.md`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
            .then(text => {
                console.log('Tutorial content loaded');
                const html = marked.parse(text); // Make sure you have the 'marked' library included
            tutorialContent.innerHTML = html;
                createTableOfContents();
        })
        .catch(error => {
            console.error('Error loading tutorial:', error);
            tutorialContent.innerHTML = `<p>Error loading tutorial content for ${ruleset}.</p>`;
        });
    }

    function createTableOfContents() {
    const headings = tutorialContent.querySelectorAll('h2, h3');
        const toc = document.createElement('nav');
        toc.className = 'table-of-contents';
    const tocList = document.createElement('ul');
    
    headings.forEach((heading, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = heading.textContent;
        a.href = `#heading-${index}`;
        heading.id = `heading-${index}`;
        li.appendChild(a);
            tocList.appendChild(li);
    });
    
    toc.appendChild(tocList);
        tutorialContent.insertBefore(toc, tutorialContent.firstChild);
    }
    
    // Add event listeners to tutorial tabs
    const tutorialTabs = document.querySelectorAll('.tutorial-tab');
    tutorialTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const ruleset = tab.getAttribute('data-tutorial');
            loadTutorial(ruleset);
        });
    });
    
    // Load the default tutorial when the page loads
    if (tutorialTabs.length > 0) {
        loadTutorial(tutorialTabs[0].getAttribute('data-tutorial'));
    }
});

// Make loadTutorial function globally accessible
window.loadTutorial = loadTutorial;