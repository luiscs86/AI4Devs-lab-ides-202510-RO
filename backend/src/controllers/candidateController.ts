import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface EducationInput {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
}

interface WorkExperienceInput {
  company: string;
  position: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

interface CreateCandidateBody {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  educations?: EducationInput[];
  workExperiences?: WorkExperienceInput[];
}

// Validation helper
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const createCandidate = async (req: Request, res: Response) => {
  try {
    const body: CreateCandidateBody = req.body;
    
    // Parse educations and workExperiences if they come as strings
    if (typeof body.educations === 'string') {
      body.educations = JSON.parse(body.educations);
    }
    if (typeof body.workExperiences === 'string') {
      body.workExperiences = JSON.parse(body.workExperiences);
    }

    // Validation
    if (!body.firstName || !body.lastName || !body.email) {
      return res.status(400).json({ 
        error: 'Missing required fields: firstName, lastName, and email are required' 
      });
    }

    if (!validateEmail(body.email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    // Check if email already exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { email: body.email }
    });

    if (existingCandidate) {
      return res.status(409).json({ 
        error: 'A candidate with this email already exists' 
      });
    }

    // Get CV path from uploaded file
    const cvPath = req.file ? req.file.path : undefined;

    // Create candidate with related data
    const candidate = await prisma.candidate.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        cvPath: cvPath,
        educations: body.educations ? {
          create: body.educations.map(edu => ({
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          }))
        } : undefined,
        workExperiences: body.workExperiences ? {
          create: body.workExperiences.map(exp => ({
            company: exp.company,
            position: exp.position,
            description: exp.description,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          }))
        } : undefined,
      },
      include: {
        educations: true,
        workExperiences: true,
      }
    });

    res.status(201).json({
      message: 'Candidate successfully added to the system',
      candidate
    });

  } catch (error: any) {
    console.error('Error creating candidate:', error);
    
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        error: 'A candidate with this email already exists' 
      });
    }
    
    res.status(500).json({ 
      error: 'An error occurred while adding the candidate. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getCandidates = async (req: Request, res: Response) => {
  try {
    const candidates = await prisma.candidate.findMany({
      include: {
        educations: true,
        workExperiences: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json(candidates);
  } catch (error: any) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ 
      error: 'An error occurred while fetching candidates',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getCandidateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const candidate = await prisma.candidate.findUnique({
      where: { id: parseInt(id) },
      include: {
        educations: true,
        workExperiences: true,
      }
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.status(200).json(candidate);
  } catch (error: any) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({ 
      error: 'An error occurred while fetching the candidate',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
