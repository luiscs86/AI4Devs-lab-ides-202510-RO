const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010/api';

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface CandidateData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  educations?: Education[];
  workExperiences?: WorkExperience[];
  cv?: File;
}

export interface Candidate extends Omit<CandidateData, 'cv'> {
  id: number;
  cvPath?: string;
  createdAt: string;
  updatedAt: string;
  educations?: Education[];
  workExperiences?: WorkExperience[];
}

export const candidateService = {
  async createCandidate(data: CandidateData): Promise<{ message: string; candidate: Candidate }> {
    const formData = new FormData();
    
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    
    if (data.phone) formData.append('phone', data.phone);
    if (data.address) formData.append('address', data.address);
    if (data.cv) formData.append('cv', data.cv);
    
    if (data.educations && data.educations.length > 0) {
      formData.append('educations', JSON.stringify(data.educations));
    }
    
    if (data.workExperiences && data.workExperiences.length > 0) {
      formData.append('workExperiences', JSON.stringify(data.workExperiences));
    }

    const response = await fetch(`${API_BASE_URL}/candidates`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create candidate');
    }

    return response.json();
  },

  async getCandidates(): Promise<Candidate[]> {
    const response = await fetch(`${API_BASE_URL}/candidates`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch candidates');
    }

    return response.json();
  },

  async getCandidateById(id: number): Promise<Candidate> {
    const response = await fetch(`${API_BASE_URL}/candidates/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch candidate');
    }

    return response.json();
  }
};
