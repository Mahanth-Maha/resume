document.addEventListener('DOMContentLoaded', () => {
    const resumeContent = document.getElementById('resume-content');
    const themeToggleButton = document.getElementById('theme-toggle');
    const downloadButton = document.getElementById('download-btn');
    const printButton = document.getElementById('print-btn');

    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggleButton.textContent = currentTheme === 'light' ? '🌙' : '☀️';

    themeToggleButton.addEventListener('click', () => {
        let newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggleButton.textContent = newTheme === 'light' ? '🌙' : '☀️';
    });

    fetch('resume.md')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(markdown => {
            resumeContent.innerHTML = marked.parse(markdown);
        })
        .catch(error => {
            console.error('Error fetching or parsing resume.md:', error);
            resumeContent.innerHTML = `<p style="color: red; text-align: center;">Could not load resume. Please check the console for errors.</p>`;
        });

    downloadButton.addEventListener('click', () => {
        const element = document.getElementById('resume-content');
        const name = document.querySelector('#resume-content h1').textContent || 'resume';
        const filename = `${name.replace(/\s+/g, '-')}-Resume.pdf`;
        
        const opt = {
            margin:       [0.5, 0.5, 0.5, 0.5],
            filename:     filename,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(element).set(opt).save()
            .then(() => {
                window.scrollTo(0, 0);
            });
    });
    printButton.addEventListener('click', () => {
        window.print();
    });
});