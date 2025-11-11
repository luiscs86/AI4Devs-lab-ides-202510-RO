# Testing the "Add Candidate" Feature

## Prerequisites
- Backend server running on http://localhost:3010
- Frontend server running on http://localhost:3000
- PostgreSQL database running in Docker

## Test Cases

### Test Case 1: Add Candidate with All Fields
**Steps:**
1. Navigate to http://localhost:3000
2. Click on "Add Candidate" button in the navigation
3. Fill in all required fields:
   - First Name: John
   - Last Name: Doe
   - Email: john.doe@example.com
   - Phone: +1-555-0123
   - Address: 123 Main St, New York, NY 10001

4. Add Education:
   - Institution: Harvard University
   - Degree: Bachelor's
   - Field of Study: Computer Science
   - Start Date: 2015-09-01
   - End Date: 2019-05-31
   - Click "Add Education"

5. Add Work Experience:
   - Company: Google
   - Position: Software Engineer
   - Description: Developed scalable web applications
   - Start Date: 2019-06-01
   - End Date: 2023-12-31
   - Click "Add Work Experience"

6. Upload CV (optional):
   - Select a PDF or DOCX file (max 5MB)

7. Click "Add Candidate"

**Expected Result:**
- Success message appears: "Candidate successfully added to the system!"
- Form is cleared and ready for a new candidate
- Page scrolls to top to show success message

### Test Case 2: Form Validation - Missing Required Fields
**Steps:**
1. Navigate to Add Candidate form
2. Leave First Name, Last Name, or Email empty
3. Click "Add Candidate"

**Expected Result:**
- Error messages appear under empty required fields
- Form is not submitted
- Error message at top: "Please fix the errors in the form"

### Test Case 3: Email Validation
**Steps:**
1. Navigate to Add Candidate form
2. Enter invalid email format (e.g., "notanemail")
3. Try to submit

**Expected Result:**
- Error message under email field: "Please enter a valid email address"
- Form is not submitted

### Test Case 4: Duplicate Email
**Steps:**
1. Add a candidate with email: test@example.com
2. Try to add another candidate with the same email

**Expected Result:**
- Error message: "A candidate with this email already exists"
- Status code: 409 (Conflict)

### Test Case 5: File Upload Validation
**Steps:**
1. Try to upload a file that is not PDF or DOCX (e.g., .txt, .jpg)

**Expected Result:**
- Error message: "Only PDF and DOCX files are allowed"
- File is not accepted

### Test Case 6: File Size Validation
**Steps:**
1. Try to upload a file larger than 5MB

**Expected Result:**
- Error message: "File size must be less than 5MB"
- File is not accepted

### Test Case 7: Add Candidate with Minimal Information
**Steps:**
1. Fill only required fields:
   - First Name: Jane
   - Last Name: Smith
   - Email: jane.smith@example.com
2. Click "Add Candidate"

**Expected Result:**
- Success message appears
- Candidate is saved without optional fields

### Test Case 8: Multiple Education and Work Experience Entries
**Steps:**
1. Add 2-3 education entries
2. Add 2-3 work experience entries
3. Remove one of each using the "Remove" button
4. Submit the form

**Expected Result:**
- Items are added and removed correctly from the display
- Only the remaining items are saved with the candidate

### Test Case 9: Server Error Handling
**Steps:**
1. Stop the backend server
2. Try to submit a candidate

**Expected Result:**
- Error message: "An error occurred while adding the candidate. Please try again later."
- No crash or undefined behavior

### Test Case 10: Browser Compatibility
**Test on different browsers:**
- Chrome
- Firefox
- Edge
- Safari (if available)

**Expected Result:**
- Form works correctly on all browsers
- Styling is consistent
- File upload works on all browsers

## API Testing with cURL

### Add Candidate (with file upload)
```bash
curl -X POST http://localhost:3010/api/candidates \
  -F "firstName=John" \
  -F "lastName=Doe" \
  -F "email=john.doe@test.com" \
  -F "phone=+1-555-0123" \
  -F "address=123 Main St" \
  -F 'educations=[{"institution":"MIT","degree":"Master","fieldOfStudy":"AI"}]' \
  -F 'workExperiences=[{"company":"Apple","position":"Engineer"}]' \
  -F "cv=@path/to/cv.pdf"
```

### Get All Candidates
```bash
curl http://localhost:3010/api/candidates
```

### Get Candidate by ID
```bash
curl http://localhost:3010/api/candidates/1
```

## Database Verification

### Check data in PostgreSQL
```bash
docker exec -it ai4devs-lab-ides-202510-ro-db-1 psql -U LTIdbUser -d LTIdb
```

```sql
-- View all candidates
SELECT * FROM "Candidate";

-- View candidate with educations and work experiences
SELECT 
  c.*,
  e.institution,
  e.degree,
  w.company,
  w.position
FROM "Candidate" c
LEFT JOIN "Education" e ON c.id = e."candidateId"
LEFT JOIN "WorkExperience" w ON c.id = w."candidateId";
```

## Known Issues / Notes
- TypeScript compiler shows errors for Prisma Client in VSCode, but the code runs correctly due to `--transpile-only` flag
- Some deprecation warnings in frontend dependencies (doesn't affect functionality)
- CV files are stored in `backend/uploads/` directory with unique filenames
