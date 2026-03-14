# AI Resume Skill Analyzer

AI Resume Skill Analyzer is a simple web application that extracts and analyzes technical skills from uploaded resumes.
The system demonstrates a simplified implementation of automated resume parsing inspired by Applicant Tracking Systems (ATS) used in modern recruitment platforms.

Instead of complex machine learning or NLP models, this project uses a rule-based keyword detection approach to identify technical skills present in a resume and display them in a clean dashboard.

---

## Features

* User Registration and Login
* Resume Upload and Analysis
* Automatic Skill Detection
* Skill Score Calculation
* Clean and Simple Dashboard UI
* Skill Tags Visualization
* Logout Functionality

---

## How It Works

1. User registers and logs into the system.
2. The user uploads a resume file.
3. The system extracts text from the resume.
4. The application scans the text using a predefined skill database.
5. Detected skills are displayed along with a skill score.

---

## Technologies Used

Frontend

* HTML
* CSS
* JavaScript

Backend

* Node.js
* Express.js

---

## Project Structure

resume-skill-analyzer

backend/

* server.js
* users.json
* package.json

frontend/

* login.html
* register.html
* dashboard.html
* style.css
* script.js

README.md

---

## Installation and Setup

1. Clone the repository

git clone https://github.com/your-username/resume-skill-analyzer.git

2. Navigate to the backend folder

cd backend

3. Install dependencies

npm install

4. Start the server

node server.js

5. Open the frontend login page in your browser.

---

## Example Output

Detected Skills
Python
React
MongoDB
SQL

Skill Score: 4 / 15

---

## Future Improvements

* Use NLP for more accurate skill extraction
* Resume ranking system
* Job description matching
* Database integration
* Advanced analytics dashboard

---

## Author

Developed as a prototype project demonstrating automated resume skill extraction for academic purposes.
