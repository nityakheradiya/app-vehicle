// Global Variables
var currentStep = 1
var totalSteps = 4
var formData = {}

// Utility function to safely get elements
function safeGetElement(id) {
  try {
    return document.getElementById(id)
  } catch (error) {
    console.warn("Element not found:", id)
    return null
  }
}

// Utility function to safely query elements
function safeQuerySelector(selector) {
  try {
    return document.querySelector(selector)
  } catch (error) {
    console.warn("Selector not found:", selector)
    return null
  }
}

// Utility function to safely query all elements
function safeQuerySelectorAll(selector) {
  try {
    return document.querySelectorAll(selector)
  } catch (error) {
    console.warn("Selector not found:", selector)
    return []
  }
}

// DOM Elements
const loadingScreen = safeGetElement("loading-screen")
const navToggle = safeGetElement("nav-toggle")
const navMenu = safeGetElement("nav-menu")
const registrationForm = safeGetElement("registration-form")
const prevBtn = safeGetElement("prev-btn")
const nextBtn = safeGetElement("next-btn")
const submitBtn = safeGetElement("submit-btn")
const successModal = safeGetElement("success-modal")

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  try {
    // Hide loading screen after 2 seconds
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.style.opacity = "0"
        setTimeout(() => {
          loadingScreen.style.display = "none"
        }, 500)
      }
    }, 2000)

    // Initialize all components
    initializeNavigation()
    initializeHeroAnimations()
    initializeFormHandling()
    initializeVehicleSelection()
    initializeFileUploads()
    initializeContactForm()
    initializeScrollAnimations()
  } catch (error) {
    console.error("Initialization error:", error)
  }
})

// Navigation Functions
function initializeNavigation() {
  try {
    if (navToggle && navMenu) {
      navToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active")
        navToggle.classList.toggle("active")
      })
    }

    // Close mobile menu when clicking on links
    const navLinks = safeQuerySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (navMenu) navMenu.classList.remove("active")
        if (navToggle) navToggle.classList.remove("active")
      })
    })

    // Header scroll effect
    window.addEventListener("scroll", () => {
      const header = safeQuerySelector(".header")
      if (header) {
        if (window.scrollY > 100) {
          header.style.background = "rgba(10, 10, 10, 0.98)"
          header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.5)"
        } else {
          header.style.background = "rgba(10, 10, 10, 0.95)"
          header.style.boxShadow = "none"
        }
      }
    })
  } catch (error) {
    console.error("Navigation initialization error:", error)
  }
}

// Hero Section Animations
function initializeHeroAnimations() {
  try {
    // Animate statistics counters
    function animateCounter(element) {
      const target = Number.parseInt(element.getAttribute("data-target"))
      const increment = target / 100
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          element.textContent = target.toLocaleString()
          clearInterval(timer)
        } else {
          element.textContent = Math.floor(current).toLocaleString()
        }
      }, 20)
    }

    // Intersection Observer for counter animation
    if (window.IntersectionObserver) {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector(".stat-number")
            if (statNumber && !statNumber.classList.contains("animated")) {
              statNumber.classList.add("animated")
              animateCounter(statNumber)
            }
          }
        })
      })

      const statItems = safeQuerySelectorAll(".stat-item")
      statItems.forEach((item) => {
        counterObserver.observe(item)
      })
    }
  } catch (error) {
    console.error("Hero animations error:", error)
  }
}

// Form Handling Functions
function initializeFormHandling() {
  try {
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (currentStep > 1) {
          currentStep--
          updateFormStep()
        }
      })
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (validateCurrentStep()) {
          if (currentStep < totalSteps) {
            currentStep++
            updateFormStep()
          }
        }
      })
    }

    if (registrationForm) {
      registrationForm.addEventListener("submit", handleFormSubmission)
    }

    // Real-time validation
    const inputs = safeQuerySelectorAll(
      "#registration-form input, #registration-form select, #registration-form textarea",
    )
    inputs.forEach((input) => {
      input.addEventListener("blur", validateField)
      input.addEventListener("input", clearFieldError)
    })
  } catch (error) {
    console.error("Form handling error:", error)
  }
}

function updateFormStep() {
  try {
    // Hide all steps
    const formSteps = safeQuerySelectorAll(".form-step")
    formSteps.forEach((step) => {
      step.classList.remove("active")
    })

    // Show current step
    const currentStepElement = safeQuerySelector('[data-step="' + currentStep + '"]')
    if (currentStepElement) {
      currentStepElement.classList.add("active")
    }

    // Update progress indicator
    const progressSteps = safeQuerySelectorAll(".progress-step")
    progressSteps.forEach((step, index) => {
      const stepNumber = index + 1
      step.classList.remove("active", "completed")

      if (stepNumber === currentStep) {
        step.classList.add("active")
      } else if (stepNumber < currentStep) {
        step.classList.add("completed")
      }
    })

    // Update navigation buttons
    if (prevBtn) {
      prevBtn.style.display = currentStep === 1 ? "none" : "inline-flex"
    }
    if (nextBtn) {
      nextBtn.style.display = currentStep === totalSteps ? "none" : "inline-flex"
    }
    if (submitBtn) {
      submitBtn.style.display = currentStep === totalSteps ? "inline-flex" : "none"
    }

    // Update review section if on last step
    if (currentStep === totalSteps) {
      updateReviewSection()
    }

    // Smooth scroll to form
    scrollToSection("register")
  } catch (error) {
    console.error("Update form step error:", error)
  }
}

function validateCurrentStep() {
  try {
    const currentStepElement = safeQuerySelector('[data-step="' + currentStep + '"]')
    if (!currentStepElement) return true

    const requiredFields = currentStepElement.querySelectorAll("[required]")
    let isValid = true

    requiredFields.forEach((field) => {
      if (!validateField({ target: field })) {
        isValid = false
      }
    })

    return isValid
  } catch (error) {
    console.error("Validation error:", error)
    return false
  }
}

function validateField(event) {
  try {
    const field = event.target
    const value = field.value.trim()
    let isValid = true
    let errorMessage = ""

    // Remove existing error styling
    field.classList.remove("error")
    const existingError = field.parentNode.querySelector(".error-message")
    if (existingError) {
      existingError.remove()
    }

    // Required field validation
    if (field.hasAttribute("required") && !value) {
      isValid = false
      errorMessage = "This field is required"
    }

    // Email validation
    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        isValid = false
        errorMessage = "Please enter a valid email address"
      }
    }

    // Phone validation
    if (field.type === "tel" && value) {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(value.replace(/[\s\-()]/g, ""))) {
        isValid = false
        errorMessage = "Please enter a valid phone number"
      }
    }

    // Year validation
    if (field.name === "year" && value) {
      const year = Number.parseInt(value)
      const currentYear = new Date().getFullYear()
      if (year < 1900 || year > currentYear) {
        isValid = false
        errorMessage = "Year must be between 1900 and " + currentYear
      }
    }

    // VIN validation
    if (field.name === "vin" && value) {
      if (value.length !== 17) {
        isValid = false
        errorMessage = "VIN must be exactly 17 characters"
      }
    }

    // Display error if validation failed
    if (!isValid) {
      field.classList.add("error")
      const errorElement = document.createElement("div")
      errorElement.className = "error-message"
      errorElement.textContent = errorMessage
      field.parentNode.appendChild(errorElement)
    }

    return isValid
  } catch (error) {
    console.error("Field validation error:", error)
    return false
  }
}

function clearFieldError(event) {
  try {
    const field = event.target
    field.classList.remove("error")
    const errorMessage = field.parentNode.querySelector(".error-message")
    if (errorMessage) {
      errorMessage.remove()
    }
  } catch (error) {
    console.error("Clear field error:", error)
  }
}

function updateReviewSection() {
  try {
    const registrationForm = safeGetElement("registration-form")
    if (!registrationForm) return

    const formData = new FormData(registrationForm)

    // Personal Information Review
    const personalReview = safeGetElement("review-personal")
    if (personalReview) {
      personalReview.innerHTML =
        '<div class="review-item">' +
        '<span class="review-label">Name:</span>' +
        '<span class="review-value">' +
        (formData.get("firstName") || "") +
        " " +
        (formData.get("lastName") || "") +
        "</span>" +
        "</div>" +
        '<div class="review-item">' +
        '<span class="review-label">Email:</span>' +
        '<span class="review-value">' +
        (formData.get("email") || "") +
        "</span>" +
        "</div>" +
        '<div class="review-item">' +
        '<span class="review-label">Phone:</span>' +
        '<span class="review-value">' +
        (formData.get("phone") || "") +
        "</span>" +
        "</div>" +
        '<div class="review-item">' +
        '<span class="review-label">Address:</span>' +
        '<span class="review-value">' +
        (formData.get("address") || "") +
        "</span>" +
        "</div>"
    }

    // Vehicle Details Review
    const vehicleReview = safeGetElement("review-vehicle")
    if (vehicleReview) {
      vehicleReview.innerHTML =
        '<div class="review-item">' +
        '<span class="review-label">Make:</span>' +
        '<span class="review-value">' +
        (formData.get("make") || "") +
        "</span>" +
        "</div>" +
        '<div class="review-item">' +
        '<span class="review-label">Model:</span>' +
        '<span class="review-value">' +
        (formData.get("model") || "") +
        "</span>" +
        "</div>" +
        '<div class="review-item">' +
        '<span class="review-label">Year:</span>' +
        '<span class="review-value">' +
        (formData.get("year") || "") +
        "</span>" +
        "</div>" +
        '<div class="review-item">' +
        '<span class="review-label">Color:</span>' +
        '<span class="review-value">' +
        (formData.get("color") || "") +
        "</span>" +
        "</div>" +
        '<div class="review-item">' +
        '<span class="review-label">VIN:</span>' +
        '<span class="review-value">' +
        (formData.get("vin") || "") +
        "</span>" +
        "</div>" +
        '<div class="review-item">' +
        '<span class="review-label">Engine:</span>' +
        '<span class="review-value">' +
        (formData.get("engine") || "") +
        "</span>" +
        "</div>"
    }

    // Documents Review
    const documentsReview = safeGetElement("review-documents")
    if (documentsReview) {
      const uploadedDocs = []
      const uploadedBoxes = safeQuerySelectorAll(".upload-box.uploaded")

      uploadedBoxes.forEach((box) => {
        const docType = box.querySelector("h4")
        if (docType) {
          uploadedDocs.push(docType.textContent)
        }
      })

      documentsReview.innerHTML = uploadedDocs
        .map(
          (doc) =>
            '<div class="review-item">' +
            '<span class="review-label">' +
            doc +
            ":</span>" +
            '<span class="review-value" style="color: var(--success-color);">✓ Uploaded</span>' +
            "</div>",
        )
        .join("")
    }
  } catch (error) {
    console.error("Update review section error:", error)
  }
}

function handleFormSubmission(event) {
  try {
    event.preventDefault()

    if (submitBtn) {
      // Show loading state
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'
      submitBtn.disabled = true
    }

    // Simulate form submission delay
    setTimeout(() => {
      // Generate registration ID
      const regId = "VR" + Date.now().toString().slice(-8)
      const regIdElement = safeGetElement("reg-id")
      if (regIdElement) {
        regIdElement.textContent = regId
      }

      // Show success modal
      const successModal = safeGetElement("success-modal")
      if (successModal) {
        successModal.classList.add("show")
      }

      // Reset form
      if (registrationForm) {
        registrationForm.reset()
      }
      currentStep = 1
      updateFormStep()

      // Reset button state
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Submit Registration'
        submitBtn.disabled = false
      }
    }, 2000)
  } catch (error) {
    console.error("Form submission error:", error)
  }
}

// Vehicle Selection Functions
function initializeVehicleSelection() {
  try {
    const vehicleCards = safeQuerySelectorAll(".vehicle-card")

    vehicleCards.forEach((card) => {
      card.addEventListener("click", () => {
        // Remove selected class from all cards
        vehicleCards.forEach((c) => {
          c.classList.remove("selected")
        })

        // Add selected class to clicked card
        card.classList.add("selected")

        // Store selected vehicle type
        const vehicleType = card.getAttribute("data-type")
        if (typeof Storage !== "undefined") {
          localStorage.setItem("selectedVehicleType", vehicleType)
        }

        // Add animation effect
        card.style.transform = "scale(0.95)"
        setTimeout(() => {
          card.style.transform = "scale(1)"
        }, 150)

        // Auto-scroll to registration form after selection
        setTimeout(() => {
          scrollToSection("register")
        }, 500)
      })
    })
  } catch (error) {
    console.error("Vehicle selection error:", error)
  }
}

// File Upload Functions
function initializeFileUploads() {
  try {
    const uploadBoxes = safeQuerySelectorAll(".upload-box")

    uploadBoxes.forEach((box) => {
      const input = box.querySelector('input[type="file"]')
      const statusElement = box.querySelector(".upload-status")

      if (input && statusElement) {
        // Handle file selection
        input.addEventListener("change", (event) => {
          const file = event.target.files[0]
          if (file) {
            handleFileUpload(box, file, statusElement)
          }
        })

        // Handle drag and drop
        box.addEventListener("dragover", (event) => {
          event.preventDefault()
          box.style.borderColor = "var(--primary-color)"
          box.style.background = "rgba(0, 212, 255, 0.1)"
        })

        box.addEventListener("dragleave", () => {
          box.style.borderColor = "var(--border-color)"
          box.style.background = "var(--bg-tertiary)"
        })

        box.addEventListener("drop", (event) => {
          event.preventDefault()
          const file = event.dataTransfer.files[0]
          if (file) {
            input.files = event.dataTransfer.files
            handleFileUpload(box, file, statusElement)
          }
          box.style.borderColor = "var(--border-color)"
          box.style.background = "var(--bg-tertiary)"
        })
      }
    })
  } catch (error) {
    console.error("File upload initialization error:", error)
  }
}

function handleFileUpload(box, file, statusElement) {
  try {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"]
    if (allowedTypes.indexOf(file.type) === -1) {
      statusElement.textContent = "Invalid file type. Please upload an image or PDF."
      statusElement.style.color = "var(--error-color)"
      return
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      statusElement.textContent = "File too large. Maximum size is 5MB."
      statusElement.style.color = "var(--error-color)"
      return
    }

    // Show upload progress
    statusElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...'
    statusElement.style.color = "var(--primary-color)"

    // Simulate upload process
    setTimeout(() => {
      box.classList.add("uploaded")
      statusElement.innerHTML = '<i class="fas fa-check-circle"></i> Upload successful'
      statusElement.style.color = "var(--success-color)"
      statusElement.classList.add("success")

      // Update box appearance
      box.style.borderColor = "var(--success-color)"
      box.style.background = "rgba(16, 185, 129, 0.1)"

      // Show file name
      const fileName = file.name.length > 20 ? file.name.substring(0, 20) + "..." : file.name
      setTimeout(() => {
        statusElement.innerHTML = '<i class="fas fa-check-circle"></i> ' + fileName
      }, 1000)
    }, 1500)
  } catch (error) {
    console.error("File upload error:", error)
  }
}

// Contact Form Functions
function initializeContactForm() {
  try {
    const contactForm = safeGetElement("contact-form")

    if (contactForm) {
      contactForm.addEventListener("submit", (event) => {
        event.preventDefault()

        const submitButton = contactForm.querySelector('button[type="submit"]')
        if (submitButton) {
          const originalText = submitButton.innerHTML

          // Show loading state
          submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
          submitButton.disabled = true

          // Simulate form submission
          setTimeout(() => {
            // Show success message
            submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!'
            submitButton.style.background = "var(--success-color)"

            // Reset form
            contactForm.reset()

            // Reset button after delay
            setTimeout(() => {
              submitButton.innerHTML = originalText
              submitButton.style.background = ""
              submitButton.disabled = false
            }, 3000)
          }, 2000)
        }
      })
    }
  } catch (error) {
    console.error("Contact form error:", error)
  }
}

// Scroll Animations
function initializeScrollAnimations() {
  try {
    const animatedElements = safeQuerySelectorAll(".service-card, .vehicle-card, .contact-item")

    if (window.IntersectionObserver) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = "1"
              entry.target.style.transform = "translateY(0)"
            }
          })
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px",
        },
      )

      animatedElements.forEach((element) => {
        element.style.opacity = "0"
        element.style.transform = "translateY(30px)"
        element.style.transition = "opacity 0.6s ease, transform 0.6s ease"
        observer.observe(element)
      })
    }
  } catch (error) {
    console.error("Scroll animations error:", error)
  }
}

// Utility Functions
function scrollToSection(sectionId) {
  try {
    const section = safeGetElement(sectionId)
    if (section) {
      const header = safeQuerySelector(".header")
      const headerHeight = header ? header.offsetHeight : 0
      const sectionTop = section.offsetTop - headerHeight - 20

      window.scrollTo({
        top: sectionTop,
        behavior: "smooth",
      })
    }
  } catch (error) {
    console.error("Scroll to section error:", error)
  }
}

function closeModal() {
  try {
    const successModal = safeGetElement("success-modal")
    if (successModal) {
      successModal.classList.remove("show")
    }

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  } catch (error) {
    console.error("Close modal error:", error)
  }
}

// Keyboard Navigation
document.addEventListener("keydown", (event) => {
  try {
    // Close modal with Escape key
    if (event.key === "Escape") {
      const successModal = safeGetElement("success-modal")
      if (successModal && successModal.classList.contains("show")) {
        closeModal()
      }
    }

    // Form navigation with arrow keys
    if (document.activeElement && document.activeElement.closest(".registration-form")) {
      if (event.key === "ArrowRight" && currentStep < totalSteps) {
        if (validateCurrentStep()) {
          currentStep++
          updateFormStep()
        }
      } else if (event.key === "ArrowLeft" && currentStep > 1) {
        currentStep--
        updateFormStep()
      }
    }
  } catch (error) {
    console.error("Keyboard navigation error:", error)
  }
})

// Performance Optimizations
function debounce(func, wait) {
  var timeout
  return function executedFunction() {
    
    var args = arguments
    var later = () => {
      clearTimeout(timeout)
      func.apply(this, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
  const header = safeQuerySelector(".header")
  if (header && window.scrollY > 100) {
    header.style.background = "rgba(10, 10, 10, 0.98)"
    header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.5)"
  } else if (header) {
    header.style.background = "rgba(10, 10, 10, 0.95)"
    header.style.boxShadow = "none"
  }
}, 10)

window.addEventListener("scroll", optimizedScrollHandler)

// Error Handling
window.addEventListener("error", (event) => {
  console.error("JavaScript Error:", event.error)

  // Show user-friendly error message
  try {
    const errorToast = document.createElement("div")
    errorToast.className = "error-toast"
    errorToast.innerHTML =
      '<i class="fas fa-exclamation-triangle"></i>' +
      "<span>Something went wrong. Please refresh the page and try again.</span>"

    errorToast.style.cssText =
      "position: fixed;" +
      "top: 20px;" +
      "right: 20px;" +
      "background: var(--error-color);" +
      "color: white;" +
      "padding: 15px 20px;" +
      "border-radius: 8px;" +
      "box-shadow: var(--shadow-lg);" +
      "z-index: 10001;" +
      "display: flex;" +
      "align-items: center;" +
      "gap: 10px;" +
      "animation: slideInRight 0.3s ease;"

    document.body.appendChild(errorToast)

    // Remove error toast after 5 seconds
    setTimeout(() => {
      if (errorToast && errorToast.parentNode) {
        errorToast.parentNode.removeChild(errorToast)
      }
    }, 5000)
  } catch (toastError) {
    console.error("Error creating error toast:", toastError)
  }
})

// Add CSS for error toast animation
try {
  const style = document.createElement("style")
  style.textContent =
    "@keyframes slideInRight {" +
    "from {" +
    "opacity: 0;" +
    "transform: translateX(100%);" +
    "}" +
    "to {" +
    "opacity: 1;" +
    "transform: translateX(0);" +
    "}" +
    "}"
  document.head.appendChild(style)
} catch (styleError) {
  console.error("Error adding styles:", styleError)
}
