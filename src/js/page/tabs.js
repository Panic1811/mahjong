class TabSystem {
    constructor() {
        this.tabs = document.querySelectorAll('.tab-button');
        this.tutorialTabs = document.querySelectorAll('.tutorial-tab');
        this.init();
    }

    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.openTab(tab));
        });

        this.tutorialTabs.forEach(tab => {
            tab.addEventListener('click', () => this.openTutorialTab(tab));
        });
    }

    openTab(tab) {
        const tabName = tab.getAttribute('data-tab');
        
        this.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });

        document.getElementById(`${tabName}-tab`).style.display = 'block';

        if (tabName === 'tutorial') {
            this.openTutorialTab(this.tutorialTabs[0]);
        }
    }

    openTutorialTab(tab) {
        const tutorialName = tab.getAttribute('data-tutorial');
        
        this.tutorialTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        this.loadTutorialContent(tutorialName);
    }

    loadTutorialContent(tutorialName) {
        fetch(`src/tutorials/${tutorialName}.html`)
            .then(response => response.text())
            .then(html => {
                const tutorialContent = document.getElementById('tutorial-content');
                tutorialContent.innerHTML = html;
                
                // Add this line to create the TOC container if it doesn't exist
                this.createTocContainer(tutorialContent);
                
                this.generateTableOfContents(tutorialContent);
                this.setupTocToggle();
            })
            .catch(error => {
                console.error('Error loading tutorial content:', error);
            });
    }

    createTocContainer(tutorialContent) {
        if (!tutorialContent.querySelector('.toc-container')) {
            const tocContainer = document.createElement('div');
            tocContainer.className = 'toc-container';
            tocContainer.innerHTML = `
                <h2>Table of Contents</h2>
                <button class="toc-toggle">Hide</button>
                <ul class="toc-list"></ul>
            `;
            tutorialContent.insertBefore(tocContainer, tutorialContent.firstChild);
        }
    }

    generateTableOfContents(tutorialContent) {
        const headings = tutorialContent.querySelectorAll('h1, h2, h3');
        const tocList = tutorialContent.querySelector('.toc-list');
        
        if (!tocList) {
            console.error('TOC list not found');
            return;
        }
        
        tocList.innerHTML = '';

        headings.forEach((heading, index) => {
            const id = `heading-${index}`;
            heading.id = id;

            const li = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = heading.textContent;
            a.href = `#${id}`;
            li.appendChild(a);
            tocList.appendChild(li);

            // Add indentation for subheadings
            if (heading.tagName === 'H2') {
                li.style.marginLeft = '20px';
            } else if (heading.tagName === 'H3') {
                li.style.marginLeft = '40px';
            }
        });
    }

    setupTocToggle() {
        const tocToggle = document.querySelector('.toc-toggle');
        const tocList = document.querySelector('.toc-list');

        tocToggle.addEventListener('click', () => {
            tocList.classList.toggle('collapsed');
            tocToggle.textContent = tocList.classList.contains('collapsed') ? 'Show' : 'Hide';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TabSystem();
});