document.addEventListener('DOMContentLoaded', function() {
  const fileInput = document.getElementById('fileInput');
  const dropZone = document.getElementById('dropZone');
  const filePreview = document.getElementById('filePreview');
  const uploadButton = document.querySelector('.upload-button');
  const loadingOverlay = document.querySelector('.loading-overlay');
  const resultSection = document.getElementById('resultSection');
  const diseaseName = document.getElementById('diseaseName');
  const summary = document.getElementById('summary');
  const additionalSymptoms = document.getElementById('additionalSymptoms');
  const confidenceScore = document.getElementById('confidenceScore');
  const printButton = document.getElementById('printButton');
  const accordionToggle = document.querySelector('.accordion-toggle');
  const accordionContent = document.querySelector('.accordion-content');

  // File upload handling
  dropZone.addEventListener('click', () => fileInput.click());

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener('change', () => {
    handleFiles(fileInput.files);
  });

  function handleFiles(files) {
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          filePreview.innerHTML = `
            <img src="${e.target.result}" alt="Uploaded image">
            <button class="delete-btn" aria-label="Delete uploaded image">×</button>
          `;
          filePreview.querySelector('.delete-btn').addEventListener('click', clearPreview);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please upload an image file.');
      }
    }
  }

  function clearPreview() {
    filePreview.innerHTML = '';
    fileInput.value = '';
  }

  // Updated upload button functionality to match Flask backend response
  uploadButton.addEventListener('click', async () => {
    if (fileInput.files.length === 0) {
      alert('Please select an image to upload.');
      return;
    }

    showLoading();
    
    try {
      const formData = new FormData();
      formData.append('file', fileInput.files[0]);
      
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Parse and format the detailed information
      const detailedInfo = parseDetailedInformation(result.detailed_information);
      
      // Display results
      displayResults(
        result.disease,
        detailedInfo.description,
        detailedInfo.symptoms,
        result.confidence_score
      );
      
      hideLoading();
      resultSection.style.display = 'block';
      
    } catch (error) {
      console.error('Error:', error);
      hideLoading();
      alert('Error processing image: ' + error.message);
    }
  });

  // Helper function to parse the detailed information from Gemini
  function parseDetailedInformation(detailedText) {
    try {
      const sections = detailedText.split(/\d\.\s+/);
      return {
        description: sections[1]?.trim() || 'Description not available',
        symptoms: sections[2]?.trim() || 'Symptoms not available',
        riskFactors: sections[3]?.trim() || 'Risk factors not available',
        prevention: sections[4]?.trim() || 'Prevention methods not available',
        whenToSeeDoctor: sections[5]?.trim() || 'Consultation advice not available',
        treatment: sections[6]?.trim() || 'Treatment options not available'
      };
    } catch (error) {
      console.error('Error parsing detailed information:', error);
      return {
        description: 'Error parsing disease information',
        symptoms: 'Information not available'
      };
    }
  }

  // Updated display results function
  function displayResults(name, description, symptoms, confidence) {
    diseaseName.textContent = name;
    summary.textContent = description;
    additionalSymptoms.textContent = symptoms;
    
    if (confidenceScore) {
      confidenceScore.textContent = `${(confidence * 100).toFixed(1)}%`;
    }

    // Add animation to the results
    const recommendations = document.querySelector('.recommendations');
    if (recommendations) {
      recommendations.style.animation = 'bounce 0.5s';
      setTimeout(() => {
        recommendations.style.animation = '';
      }, 500);
    }
  }

  function showLoading() {
    loadingOverlay.classList.add('show');
  }

  function hideLoading() {
    loadingOverlay.classList.remove('show');
  }

  // Print functionality
  printButton?.addEventListener('click', () => {
    window.print();
  });

  // Accordion interactivity
  accordionToggle?.addEventListener('click', () => {
    const expanded = accordionToggle.getAttribute('aria-expanded') === 'true' || false;
    accordionToggle.setAttribute('aria-expanded', !expanded);
    accordionContent.classList.toggle('show');
  });

  // Mobile menu toggle
  const menuIcon = document.querySelector('.menu-icon');
  const navLinks = document.querySelector('.nav-links');
  menuIcon?.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });

  // Add bounce animation
  function addBounceAnimation() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
        40% {transform: translateY(-10px);}
        60% {transform: translateY(-5px);}
      }
    `;
    document.head.appendChild(style);
  }

  addBounceAnimation();
});