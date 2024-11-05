
document.addEventListener('DOMContentLoaded', function() {
    const adminName = document.getElementById('admin-name');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const loadingSpinner = document.getElementById('loading-spinner');
    const popupOverlay = document.querySelector('.popup-overlay');
    const popupWindows = document.querySelectorAll('.popup-window');
    const manageButtons = document.querySelectorAll('.manage-button');

    // Set admin name (replace with actual admin name fetching logic)
    adminName.textContent = 'John Doe';

    // Sidebar toggle
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });

    // Simulated data fetching with loading spinner
    function fetchData() {
        loadingSpinner.classList.add('active');
        
        setTimeout(() => {
            // Simulated data (replace with actual API calls)
            document.getElementById('total-users').textContent = '1,234';
            document.getElementById('active-users').textContent = '987';
            document.getElementById('total-doctors').textContent = '56';
            document.getElementById('pending-approvals').textContent = '7';
            document.getElementById('active-testimonials').textContent = '89';

            loadingSpinner.classList.remove('active');
            renderCharts();
        }, 1500);
    }

    // Render charts
    function renderCharts() {
        // Disease distribution chart
        new Chart(document.getElementById('disease-chart'), {
            type: 'pie',
            data: {
                labels: ['Acne', 'Eczema', 'Psoriasis', 'Rosacea', 'Other'],
                datasets: [{
                    data: [30, 25, 20, 15, 10],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Disease Distribution'
                    }
                }
            }
        });

        // User growth chart
        new Chart(document.getElementById('user-growth-chart'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'User Growth',
                    data: [65, 59, 80, 81, 56, 55],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'User Growth Over Time'
                    }
                }
            }
        });
    }

    // Initialize dashboard
    fetchData();

    // Sticky header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        header.classList.toggle('sticky', window.scrollY > 0);
    });

    // Pop-up sliding window functionality
    function openPopup(popupId) {
        popupOverlay.style.display = 'block';
        document.getElementById(popupId).classList.add('active');
    }

    function closePopup() {
        popupOverlay.style.display = 'none';
        popupWindows.forEach(window => window.classList.remove('active'));
    }

    manageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const popupId = this.id.replace('-btn', '-popup');
            openPopup(popupId);
            populatePopup(popupId);
        });
    });

    popupOverlay.addEventListener('click', closePopup);

    // Populate pop-up windows with data
    function populatePopup(popupId) {
        const popupContent = document.querySelector(`#${popupId} .popup-content`);
        popupContent.innerHTML = ''; // Clear existing content

        let data;
        switch(popupId) {
            case 'users-popup':
                data = [
                    { name: 'Alice Johnson', email: 'alice@example.com', contact: '123-456-7890' },
                    { name: 'Bob Smith', email: 'bob@example.com', contact: '234-567-8901' },
                    { name: 'Charlie Brown', email: 'charlie@example.com', contact: '345-678-9012' }
                ];
                break;
            case 'doctors-popup':
                data = [
                    { name: 'Dr. Emily White', email: 'emily@example.com', contact: '456-789-0123', specialty: 'Dermatology' },
                    { name: 'Dr. David Lee', email: 'david@example.com', contact: '567-890-1234', specialty: 'Pediatric Dermatology' },
                    { name: 'Dr. Sarah Johnson', email: 'sarah@example.com', contact: '678-901-2345', specialty: 'Cosmetic Dermatology' }
                ];
                break;
            case 'testimonials-popup':
                data = [
                    { name: 'John Doe', content: 'Great service! Highly recommended.', date: '2024-03-15' },
                    { name: 'Jane Smith', content: 'The doctors are very knowledgeable and caring.', date: '2024-03-10' },
                    { name: 'Mike Johnson', content: 'Excellent platform for skin disease diagnosis.', date: '2024-03-05' }
                ];
                break;
        }

        data.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'popup-item';
            itemElement.innerHTML = `
                <h3>${item.name}</h3>
                ${item.email ? `<p>Email: ${item.email}</p>` : ''}
                ${item.contact ? `<p>Contact: ${item.contact}</p>` : ''}
                ${item.specialty ? `<p>Specialty: ${item.specialty}</p>` : ''}
                ${item.content ? `<p>Content: ${item.content}</p>` : ''}
                ${item.date ? `<p>Date: ${item.date}</p>` : ''}
                <button class="delete-btn">Delete</button>
            `;
            popupContent.appendChild(itemElement);
        });

        // Add delete functionality
        popupContent.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('.popup-item').remove();
                // Here you would typically also send a request to your backend to delete the item
            });
        });
    }
});