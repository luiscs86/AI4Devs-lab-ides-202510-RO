import React, { useState, FormEvent, ChangeEvent } from 'react';
import { candidateService, CandidateData, Education, WorkExperience } from '../services/candidateService';
import './AddCandidate.css';

interface AddCandidateProps {
  onSuccess?: () => void;
}

const AddCandidate: React.FC<AddCandidateProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<CandidateData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    educations: [],
    workExperiences: []
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Education form state
  const [currentEducation, setCurrentEducation] = useState<Education>({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: ''
  });

  // Work experience form state
  const [currentWorkExp, setCurrentWorkExp] = useState<WorkExperience>({
    company: '',
    position: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, cv: 'Only PDF and DOCX files are allowed' }));
        setCvFile(null);
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setErrors(prev => ({ ...prev, cv: 'File size must be less than 5MB' }));
        setCvFile(null);
        return;
      }

      setCvFile(file);
      setErrors(prev => ({ ...prev, cv: '' }));
    }
  };

  const addEducation = () => {
    if (currentEducation.institution && currentEducation.degree) {
      setFormData(prev => ({
        ...prev,
        educations: [...(prev.educations || []), { ...currentEducation }]
      }));
      setCurrentEducation({
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: ''
      });
    }
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      educations: prev.educations?.filter((_, i) => i !== index)
    }));
  };

  const addWorkExperience = () => {
    if (currentWorkExp.company && currentWorkExp.position) {
      setFormData(prev => ({
        ...prev,
        workExperiences: [...(prev.workExperiences || []), { ...currentWorkExp }]
      }));
      setCurrentWorkExp({
        company: '',
        position: '',
        description: '',
        startDate: '',
        endDate: ''
      });
    }
  };

  const removeWorkExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workExperiences: prev.workExperiences?.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors in the form' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const dataToSubmit: CandidateData = {
        ...formData,
        cv: cvFile || undefined
      };

      const response = await candidateService.createCandidate(dataToSubmit);
      
      setMessage({ 
        type: 'success', 
        text: response.message || 'Candidate successfully added to the system!' 
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        educations: [],
        workExperiences: []
      });
      setCvFile(null);
      setErrors({});

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Call success callback if provided (e.g., to navigate back to list)
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500); // Give user time to see success message
      }

    } catch (error: any) {
      console.error('Error creating candidate:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'An error occurred while adding the candidate. Please try again later.' 
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-candidate-container">
      <h1>Add New Candidate</h1>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="candidate-form">
        {/* Personal Information */}
        <section className="form-section">
          <h2>Personal Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name <span className="required">*</span></label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name <span className="required">*</span></label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email <span className="required">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cv">CV (PDF or DOCX, max 5MB)</label>
            <input
              type="file"
              id="cv"
              name="cv"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className={errors.cv ? 'error' : ''}
            />
            {cvFile && <span className="file-name">Selected: {cvFile.name}</span>}
            {errors.cv && <span className="error-message">{errors.cv}</span>}
          </div>
        </section>

        {/* Education */}
        <section className="form-section">
          <h2>Education</h2>
          
          <div className="dynamic-form">
            <div className="form-row">
              <div className="form-group">
                <label>Institution</label>
                <input
                  type="text"
                  value={currentEducation.institution}
                  onChange={(e) => setCurrentEducation(prev => ({ ...prev, institution: e.target.value }))}
                  placeholder="e.g., Harvard University"
                />
              </div>

              <div className="form-group">
                <label>Degree</label>
                <input
                  type="text"
                  value={currentEducation.degree}
                  onChange={(e) => setCurrentEducation(prev => ({ ...prev, degree: e.target.value }))}
                  placeholder="e.g., Bachelor's"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Field of Study</label>
                <input
                  type="text"
                  value={currentEducation.fieldOfStudy}
                  onChange={(e) => setCurrentEducation(prev => ({ ...prev, fieldOfStudy: e.target.value }))}
                  placeholder="e.g., Computer Science"
                />
              </div>

              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={currentEducation.startDate}
                  onChange={(e) => setCurrentEducation(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={currentEducation.endDate}
                  onChange={(e) => setCurrentEducation(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            <button type="button" onClick={addEducation} className="add-btn">
              + Add Education
            </button>
          </div>

          {formData.educations && formData.educations.length > 0 && (
            <div className="added-items">
              <h3>Added Education</h3>
              {formData.educations.map((edu, index) => (
                <div key={index} className="added-item">
                  <div>
                    <strong>{edu.degree}</strong> - {edu.institution}
                    {edu.fieldOfStudy && <span> ({edu.fieldOfStudy})</span>}
                  </div>
                  <button type="button" onClick={() => removeEducation(index)} className="remove-btn">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Work Experience */}
        <section className="form-section">
          <h2>Work Experience</h2>
          
          <div className="dynamic-form">
            <div className="form-row">
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  value={currentWorkExp.company}
                  onChange={(e) => setCurrentWorkExp(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="e.g., Google"
                />
              </div>

              <div className="form-group">
                <label>Position</label>
                <input
                  type="text"
                  value={currentWorkExp.position}
                  onChange={(e) => setCurrentWorkExp(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="e.g., Software Engineer"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={currentWorkExp.description}
                onChange={(e) => setCurrentWorkExp(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe responsibilities and achievements..."
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={currentWorkExp.startDate}
                  onChange={(e) => setCurrentWorkExp(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={currentWorkExp.endDate}
                  onChange={(e) => setCurrentWorkExp(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            <button type="button" onClick={addWorkExperience} className="add-btn">
              + Add Work Experience
            </button>
          </div>

          {formData.workExperiences && formData.workExperiences.length > 0 && (
            <div className="added-items">
              <h3>Added Work Experience</h3>
              {formData.workExperiences.map((exp, index) => (
                <div key={index} className="added-item">
                  <div>
                    <strong>{exp.position}</strong> at {exp.company}
                  </div>
                  <button type="button" onClick={() => removeWorkExperience(index)} className="remove-btn">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Add Candidate'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCandidate;
