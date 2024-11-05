document.addEventListener('DOMContentLoaded', function() {
    const historyGrid = document.getElementById('historyGrid');
    const loadMoreButton = document.getElementById('loadMoreButton');
    const modal = document.getElementById('detailModal');
    const closeModal = document.getElementById('closeModal');
    const printReportButton = document.getElementById('printReportButton');
    const accordionToggle = document.querySelector('.accordion-toggle');
    const accordionContent = document.querySelector('.accordion-content');

    let currentPage = 1;
    const recordsPerPage = 10;

    // Simulated data for demonstration
    const mockData = [
        { id: 1, disease: "Eczema", date: "2023-05-15", summary: "Mild case of eczema on the forearm.", image: "/placeholder.svg?height=150&width=250" },
        { id: 2, disease: "Psoriasis", date: "2023-06-02", summary: "Moderate psoriasis patches on elbows.", image: "/placeholder.svg?height=150&width=250" },
        { id: 3, disease: "Acne", date: "2023-06-20", summary: "Mild acne breakout on the face.", image: "/placeholder.svg?height=150&width=250" },
        // Add more mock data as needed
    ];

    function loadHistoryCards(page) {
        const start = (page - 1) * recordsPerPage;
        const end = start + recordsPerPage;
        const pageData = mockData.slice(start, end);

        pageData.forEach(record => {
            const card = createHistoryCard(record);
            historyGrid.appendChild(card);
        });

        if (end >= mockData.length) {
            loadMoreButton.style.display = 'none';
        }
    }

    function createHistoryCard(record) {
        const card = document.createElement('div');
        card.className = 'history-card';
        card.innerHTML = `
            <img src="${record.image}" alt="${record.disease} image">
            <div class="history-card-content">
                <h3>${record.disease}</h3>
                <p class="date">${record.date}</p>
                <p>${record.summary}</p>
                <button class="details-button" data-id="${record.id}">View Details</button>
            </div>
        `;

        card.querySelector('.details-button').addEventListener('click', () => showModal(record));

        return card;
    }

    function showModal(record) {
        document.getElementById('modalDiseaseName').textContent = record.disease;
        document.getElementById('modalDate').textContent = record.date;
        document.getElementById('modalImage').src = record.image;
        document.getElementById('modalDetailedAnalysis').textContent = `Detailed analysis for ${record.disease}. This would typically include more information about symptoms, causes, and potential treatments.`;
        document.getElementById('modalRecommendations').textContent = `We recommend consulting with a dermatologist for a professional diagnosis and treatment plan for your ${record.disease}.`;

        modal.style.display = 'block';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    loadMoreButton.addEventListener('click', () => {
        currentPage++;
        loadHistoryCards(currentPage);
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        }
    });

    printReportButton.addEventListener('click', () => {
        window.print();
    });

    accordionToggle.addEventListener('click', () => {
        const expanded = accordionToggle.getAttribute('aria-expanded') === 'true' || false;
        accordionToggle.setAttribute('aria-expanded', !expanded);
        accordionContent.classList.toggle('show');
    });

    // Mobile menu toggle
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');
    menuIcon.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });

    // Initial load
    loadHistoryCards(currentPage);
});