import React, { useEffect, useState } from 'react';
import { candidateService, Candidate } from '../services/candidateService';
import './CandidateList.css';

const CandidateList: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await candidateService.getCandidates();
      setCandidates(data);
    } catch (err: any) {
      console.error('Error loading candidates:', err);
      setError('Failed to load candidates. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="candidate-list-container">
        <div className="loading">Loading candidates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="candidate-list-container">
        <div className="error-box">
          <p>{error}</p>
          <button onClick={loadCandidates} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="candidate-list-container">
      <div className="list-header">
        <h2>Candidates ({candidates.length})</h2>
        <button onClick={loadCandidates} className="refresh-btn">
          ↻ Refresh
        </button>
      </div>

      {candidates.length === 0 ? (
        <div className="empty-state">
          <h3>No candidates yet</h3>
          <p>Start by adding your first candidate to the system.</p>
        </div>
      ) : (
        <div className="candidates-grid">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="candidate-card">
              <div className="candidate-header">
                <div className="candidate-name">
                  <h3>{candidate.firstName} {candidate.lastName}</h3>
                  <span className="candidate-id">ID: {candidate.id}</span>
                </div>
                {candidate.cvPath && (
                  <span className="cv-badge" title="CV uploaded">📄</span>
                )}
              </div>

              <div className="candidate-details">
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <a href={`mailto:${candidate.email}`} className="detail-value">
                    {candidate.email}
                  </a>
                </div>

                {candidate.phone && (
                  <div className="detail-item">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{candidate.phone}</span>
                  </div>
                )}

                {candidate.address && (
                  <div className="detail-item">
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">{candidate.address}</span>
                  </div>
                )}
              </div>

              {candidate.educations && candidate.educations.length > 0 && (
                <div className="candidate-section">
                  <h4>Education ({candidate.educations.length})</h4>
                  {candidate.educations.map((edu, index) => (
                    <div key={index} className="section-item">
                      <strong>{edu.degree}</strong> - {edu.institution}
                      {edu.fieldOfStudy && <span> ({edu.fieldOfStudy})</span>}
                    </div>
                  ))}
                </div>
              )}

              {candidate.workExperiences && candidate.workExperiences.length > 0 && (
                <div className="candidate-section">
                  <h4>Work Experience ({candidate.workExperiences.length})</h4>
                  {candidate.workExperiences.map((exp, index) => (
                    <div key={index} className="section-item">
                      <strong>{exp.position}</strong> at {exp.company}
                    </div>
                  ))}
                </div>
              )}

              <div className="candidate-footer">
                <span className="date-added">
                  Added: {formatDate(candidate.createdAt)}
                </span>
                {candidate.cvPath && (
                  <a 
                    href={`http://localhost:3010/${candidate.cvPath}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="view-cv-btn"
                  >
                    View CV
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateList;
