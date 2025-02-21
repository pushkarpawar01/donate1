import React, { useState } from 'react';
import './SupportForm.css';

export default function SupportForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      setIsValid(false);
      form.classList.add('validated-form');
      return;
    }

    try {
      setFormStatus('Sending message...');
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: '80b522a5-af83-42c3-bd69-801db9beaf63',
          subject: 'New Submission from Web3Forms',
          ...formData
        })
      });
      const result = await response.json();
      if (response.status === 200) {
        setFormStatus('Message sent successfully!');
        setIsValid(true);
      } else {
        setFormStatus(result.message);
      }
    } catch (error) {
      console.error(error);
      setFormStatus('Something went wrong!');
    }
    setTimeout(() => {
      setFormStatus('');
    }, 5000);
    form.reset();
  };

  return (

    <div className="support-container">
      
      <form
        onSubmit={handleSubmit}
        className={`support-form ${isValid ? '' : 'validated-form'}`}
        noValidate
      >
        <input type="hidden" name="access_key" value="80b522a5-af83-42c3-bd69-801db9beaf63" />
        <input type="hidden" name="subject" value="New Submission from Web3Forms" />
        
        <div className="input-row">
          <div className="field-group">
            <label htmlFor="firstName" className="field-label">First Name</label>
            <input type="text" name="firstName" id="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required className="field-input" />
            <div className="error-message">Please provide your first name.</div>
          </div>
          <div className="field-group">
            <label htmlFor="lastName" className="field-label">Last Name</label>
            <input type="text" name="lastName" id="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required className="field-input" />
            <div className="error-message">Please provide your last name.</div>
          </div>
        </div>

        <div className="input-row">
          <div className="field-group">
            <label htmlFor="email" className="field-label">Email Address</label>
            <input type="email" name="email" id="email" placeholder="abc@xyz.com" value={formData.email} onChange={handleChange} required className="field-input" />
            <div className="error-message">Please provide a valid email address.</div>
          </div>
          <div className="field-group">
            <label htmlFor="phone" className="field-label">Phone Number</label>
            <input type="text" name="phone" id="phone" placeholder="+91 1234567890" value={formData.phone} onChange={handleChange} required className="field-input" />
            <div className="error-message">Please provide your phone number.</div>
          </div>
        </div>

        <div className="field-group">
          <label htmlFor="message" className="field-label">Your Message</label>
          <textarea rows="5" name="message" id="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required className="field-input"></textarea>
          <div className="error-message">Please enter your message.</div>
        </div>

        <div className="submit-section">
          <button type="submit" className="submit-button">Send Message</button>
        </div>
        {formStatus && <p className="status-text">{formStatus}</p>}
      </form>
    </div>
  );
}
