# Add Candidate Feature - Implementation Documentation

## Overview
This document describes the implementation of the "Add Candidate to the System" feature for the LTI (Talent Tracking System) application.

## Architecture

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **Backend**: Node.js with Express and TypeScript
- **Database**: PostgreSQL (via Docker)
- **ORM**: Prisma
- **File Upload**: Multer
- **CORS**: Enabled for cross-origin requests

## Implementation Details

### 1. Database Layer

#### Prisma Schema (`backend/prisma/schema.prisma`)

Three models were created:

**Candidate Model:**
```prisma
model Candidate {
  id              Int               @id @default(autoincrement())
  firstName       String
  lastName        String
  email           String            @unique
  phone           String?
  address         String?
  cvPath          String?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  educations      Education[]
  workExperiences WorkExperience[]
}
```

**Education Model:**
```prisma
model Education {
  id           Int       @id @default(autoincrement())
  institution  String
  degree       String
  fieldOfStudy String?
  startDate    DateTime?
  endDate      DateTime?
  candidateId  Int
  candidate    Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)
}
```

**WorkExperience Model:**
```prisma
model WorkExperience {
  id          Int       @id @default(autoincrement())
  company     String
  position    String
  description String?
  startDate   DateTime?
  endDate     DateTime?
  candidateId Int
  candidate   Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)
}
```

#### Key Features:
- One-to-many relationships between Candidate and Education/WorkExperience
- Cascade delete to maintain referential integrity
- Timestamps for audit trail
- Email uniqueness constraint

### 2. Backend Layer

#### File Structure
```
backend/src/
├── controllers/
│   └── candidateController.ts
├── routes/
│   └── candidateRoutes.ts
├── index.ts
└── uploads/ (created at runtime)
```

#### Routes (`backend/src/routes/candidateRoutes.ts`)
- `POST /api/candidates` - Create new candidate with file upload
- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/:id` - Get candidate by ID

#### File Upload Configuration
- **Allowed formats**: PDF, DOC, DOCX
- **Max file size**: 5MB
- **Storage**: Local disk in `backend/uploads/`
- **Naming**: `cv-{timestamp}-{random}.{ext}`

#### Validation
- Required fields: firstName, lastName, email
- Email format validation (regex)
- Duplicate email detection
- File type validation
- File size validation

#### Error Handling
- 400: Bad Request (validation errors, invalid file)
- 409: Conflict (duplicate email)
- 500: Internal Server Error (with development details)

### 3. Frontend Layer

#### File Structure
```
frontend/src/
├── components/
│   ├── AddCandidate.tsx
│   └── AddCandidate.css
├── services/
│   └── candidateService.ts
├── App.tsx
└── App.css
```

#### Components

**App Component:**
- Main application container
- Navigation bar with dashboard and "Add Candidate" button
- View routing (home/add-candidate)
- Responsive design

**AddCandidate Component:**
Features:
- Multi-section form (Personal Info, Education, Work Experience)
- Dynamic education and work experience entries
- Real-time validation
- File upload with preview
- Success/error message display
- Form reset after successful submission
- Responsive layout

#### Services

**candidateService.ts:**
- API communication layer
- FormData construction for multipart uploads
- Type-safe interfaces
- Error handling

#### Styling
- Modern, clean design
- Color scheme: Primary blue (#007bff), Success green (#28a745), Error red (#dc3545)
- Responsive grid layouts
- Mobile-friendly (< 768px breakpoint)
- Accessible form inputs with proper labels

## API Endpoints

### POST /api/candidates
Create a new candidate with optional CV upload.

**Request:**
```typescript
Content-Type: multipart/form-data

{
  firstName: string (required)
  lastName: string (required)
  email: string (required, unique, valid format)
  phone?: string
  address?: string
  educations?: JSON string of Education[]
  workExperiences?: JSON string of WorkExperience[]
  cv?: File (PDF/DOCX, max 5MB)
}
```

**Response (201):**
```json
{
  "message": "Candidate successfully added to the system",
  "candidate": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0123",
    "address": "123 Main St",
    "cvPath": "uploads/cv-1699722345678-123456789.pdf",
    "createdAt": "2025-11-11T17:00:00.000Z",
    "updatedAt": "2025-11-11T17:00:00.000Z",
    "educations": [...],
    "workExperiences": [...]
  }
}
```

**Error Responses:**
- 400: Validation error
- 409: Email already exists
- 500: Server error

### GET /api/candidates
Retrieve all candidates with their education and work experience.

**Response (200):**
```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    // ... full candidate data
  }
]
```

### GET /api/candidates/:id
Retrieve a specific candidate by ID.

**Response (200):**
```json
{
  "id": 1,
  "firstName": "John",
  // ... full candidate data
}
```

**Error Response:**
- 404: Candidate not found

## Security Considerations

1. **File Upload Security:**
   - File type validation (whitelist approach)
   - File size limits
   - Unique filename generation
   - Files stored outside web root

2. **Data Validation:**
   - Server-side validation (never trust client)
   - Email format validation
   - SQL injection prevention (Prisma ORM)

3. **CORS:**
   - Configured for local development
   - Should be restricted in production

4. **Error Messages:**
   - Generic messages in production
   - Detailed messages only in development mode

## Deployment Checklist

### Environment Variables
Create `.env` file in backend:
```env
DATABASE_URL="postgresql://LTIdbUser:D1ymf8wyQEGthFR1E9xhCq@localhost:5432/LTIdb"
NODE_ENV=production
```

### Production Considerations
1. **File Storage:**
   - Consider cloud storage (S3, Azure Blob) instead of local disk
   - Implement file cleanup for deleted candidates

2. **CORS:**
   - Restrict to specific origins
   ```typescript
   app.use(cors({ origin: 'https://yourdomain.com' }));
   ```

3. **File Size:**
   - Implement streaming for large files
   - Consider CDN for CV downloads

4. **Database:**
   - Use connection pooling
   - Implement database backups
   - Consider read replicas for scaling

5. **Monitoring:**
   - Add logging (Winston, Morgan)
   - Error tracking (Sentry)
   - Performance monitoring

## Future Enhancements

1. **Candidate List View:**
   - Display all candidates in a table
   - Search and filter functionality
   - Pagination

2. **Candidate Detail View:**
   - View full candidate profile
   - Download CV
   - Edit candidate information

3. **Advanced Features:**
   - CV parsing (extract information automatically)
   - Duplicate detection (similar candidates)
   - Email notifications
   - Candidate status workflow
   - Interview scheduling
   - Notes and comments

4. **Authentication & Authorization:**
   - User login system
   - Role-based access control (Recruiter, HR Manager, Admin)
   - Audit trail for changes

5. **Search & Analytics:**
   - Full-text search
   - Skill matching
   - Recruitment pipeline analytics
   - Reports and dashboards

## Troubleshooting

### Common Issues

**Issue: TypeScript errors in backend**
- Cause: Prisma Client not regenerated after schema changes
- Solution: Run `npx prisma generate`

**Issue: File upload fails**
- Cause: uploads directory doesn't exist
- Solution: Create `backend/uploads/` directory

**Issue: CORS errors**
- Cause: Frontend and backend on different origins
- Solution: Ensure CORS is enabled in backend

**Issue: Database connection fails**
- Cause: PostgreSQL not running
- Solution: Run `docker-compose up -d`

## Testing Strategy

See `TESTING.md` for detailed test cases.

**Test Coverage:**
- ✅ Unit tests for validation functions
- ✅ Integration tests for API endpoints
- ✅ E2E tests for complete user flows
- ✅ File upload tests
- ✅ Error handling tests
- ✅ Browser compatibility tests

## Performance Metrics

**Target Metrics:**
- Page load: < 2 seconds
- Form submission: < 1 second
- File upload (5MB): < 3 seconds
- API response time: < 200ms

## Conclusion

The "Add Candidate" feature has been successfully implemented with:
- ✅ Complete database schema
- ✅ RESTful API with validation
- ✅ File upload support
- ✅ User-friendly frontend
- ✅ Error handling
- ✅ Responsive design
- ✅ TypeScript type safety
- ✅ Documentation

The implementation follows best practices and is ready for testing and deployment.
