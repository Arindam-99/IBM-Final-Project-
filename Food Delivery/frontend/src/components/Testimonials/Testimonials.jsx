import React, { useState, useEffect } from "react";
import "./Testimonials.css";

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Arindam Das ",
      role: "Food Blogger",
      image: "https://m.media-amazon.com/images/M/MV5BMTI5ODY5NTUzMF5BMl5BanBnXkFtZTcwOTAzNTIzMw@@._V1_.jpg",
      rating: 5,
      text: "Amazing food delivery service! The quality is consistently excellent and delivery is always on time. My go-to app for ordering food.",
      location: "New York, NY"
    },
    {
      id: 2,
      name: "Sujata Kayal ",
      role: "Software Engineer",
      image: "https://upload.wikimedia.org/wikipedia/en/d/d9/Elizabeth_Olsen_as_Wanda_Maximoff.jpg",
      rating: 5,
      text: "Love the variety of restaurants available. The app is user-friendly and the customer service is top-notch. Highly recommended!",
      location: "San Francisco, CA"
    },
    {
      id: 3,
      name: "Subham Bose",
      role: "Marketing Manager",
      image: "https://www.cnet.com/a/img/resize/ee6abd26861d2a4eaba6d4586f1baca489f075f2/hub/2016/10/24/4c7b8f36-6f0e-427b-9884-59e1f7209591/strange1.jpg?auto=webp&width=1200",
      rating: 5,
      text: "Fast delivery, hot food, and great prices. The tracking feature is fantastic - I always know exactly when my food will arrive.",
      location: "Los Angeles, CA"
    },
    {
      id: 4,
      name: "Ankita Seth ",
      role: "Business Owner",
      image: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Scarlett_Johansson_as_Black_Widow.jpg/250px-Scarlett_Johansson_as_Black_Widow.jpg",
      rating: 5,
      text: "Perfect for busy professionals like me. The food quality is restaurant-grade and the convenience is unmatched. 5 stars!",
      location: "Chicago, IL"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`star ${index < rating ? 'filled' : ''}`}
      >
        ⭐
      </span>
    ));
  };

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index);
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="section-header fade-in">
          <h2>What Our Customers Say</h2>
          <p>Real reviews from real customers who love our service</p>
        </div>

        <div className="testimonials-container">
          <button 
            className="nav-btn prev-btn" 
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
          >
            ‹
          </button>

          <div className="testimonial-slider">
            <div 
              className="testimonials-track"
              style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`testimonial-card ${index === currentTestimonial ? 'active' : ''}`}
                >
                  <div className="testimonial-content">
                    <div className="quote-icon">"</div>
                    <p className="testimonial-text">{testimonial.text}</p>
                    <div className="rating">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                  
                  <div className="testimonial-author">
                    <div className="author-image">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        loading="lazy"
                      />
                    </div>
                    <div className="author-info">
                      <h4>{testimonial.name}</h4>
                      <p className="author-role">{testimonial.role}</p>
                      <p className="author-location">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="nav-btn next-btn" 
            onClick={nextTestimonial}
            aria-label="Next testimonial"
          >
            ›
          </button>
        </div>

        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentTestimonial ? 'active' : ''}`}
              onClick={() => goToTestimonial(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-item fade-in">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-item fade-in">
              <div className="stat-number">4.9</div>
              <div className="stat-label">Average Rating</div>
            </div>
            <div className="stat-item fade-in">
              <div className="stat-number">1M+</div>
              <div className="stat-label">Orders Delivered</div>
            </div>
            <div className="stat-item fade-in">
              <div className="stat-number">500+</div>
              <div className="stat-label">Restaurant Partners</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
