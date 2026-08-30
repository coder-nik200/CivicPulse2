🏙️ CivicFix

Smart Civic Issue Reporting & Community Management Platform

CivicFix is a full-stack civic issue reporting platform that connects citizens with authorities through a centralized, location-based system for reporting and managing public infrastructure problems.

Citizens can report issues such as potholes, garbage, broken streetlights, water leakage, damaged roads, and other civic problems by uploading an image and sharing their location. Reported issues are displayed on an interactive map, allowing users and authorities to easily identify problem areas and prioritize them based on the number and severity of reports.

---

🚀 Features

👤 User Authentication

* Secure user registration and login
* Cookie-based authentication
* Protected routes
* User-specific issue tracking
* Logout functionality
* Authentication-ready architecture for Google Login and OTP-based authentication

📍 Location-Based Reporting

* Automatically detect the user’s current location
* Capture latitude and longitude
* Store the reported location with each issue
* Display issues at their exact reported locations
* Address/location information associated with reports

📸 Civic Issue Reporting

Users can report different types of civic problems, including:

* 🕳️ Potholes
* 🗑️ Garbage/Waste
* 💡 Broken Streetlights
* 🚰 Water Leakage
* 🛣️ Road Damage
* 🚦 Traffic/Signal Issues
* 🏗️ Other Public Infrastructure Problems

Each report can contain:

* Issue category
* Description
* Image
* Location
* Latitude
* Longitude
* Area
* Reporter information
* Current issue status

🗺️ Interactive Map

CivicFix provides a map-based interface where reported issues are represented using category-specific markers.

For example:

🕳️ Pothole
🗑️ Garbage
💡 Streetlight
🚰 Water Leakage
🛣️ Road Damage

Clicking an issue marker displays relevant information such as:

* Issue type
* Description
* Reported image
* Location
* Area
* Status
* Report information

🔥 High-Priority Areas

CivicFix can identify areas where multiple civic problems have been reported.

If a particular region receives a high number of reports, it can be classified as a high-priority area.

This helps authorities focus their resources where they are needed most.

Low Reports
     ↓
Normal Area
Multiple Reports
     ↓
Attention Required
High Report Density
     ↓
🔥 High Priority Area

📊 Issue Management

Issues can be tracked through different stages, such as:

Reported
   ↓
Under Review
   ↓
In Progress
   ↓
Resolved

This provides transparency and allows citizens to understand the current status of their complaints.

🖼️ Image Uploads

Users can attach images while reporting an issue.

Images provide visual evidence and help authorities understand the problem before taking action.

📱 Responsive UI

CivicFix is designed to work across:

* 💻 Desktop
* 💻 Laptop
* 📱 Mobile
* 📟 Tablet

---

🏗️ System Architecture

                    ┌───────────────────┐
                    │      Citizen      │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │   CivicFix UI     │
                    │ React / Next.js   │
                    └─────────┬─────────┘
                              │
                         REST API
                              │
                              ▼
                    ┌───────────────────┐
                    │  Node.js Server   │
                    │    Express.js     │
                    └─────────┬─────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
       ┌─────────────────┐        ┌─────────────────┐
       │    MongoDB      │        │ Image Storage   │
       │     Database    │        │   / Cloudinary  │
       └─────────────────┘        └─────────────────┘
                │
                ▼
       ┌─────────────────┐
       │ Civic Issue Data │
       └─────────────────┘

---

🛠️ Tech Stack

Frontend

* React.js
* Next.js
* TypeScript / JavaScript
* Tailwind CSS
* Lucide React
* React / Map integration

Backend

* Node.js
* Express.js
* REST API
* Cookie-based Authentication
* Multer for file uploads

Database

* MongoDB
* Mongoose

Image Storage

* Cloudinary

Development Tools

* Git
* GitHub
* VS Code
* Postman
* npm

---

📂 Project Structure

CivicFix/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── services/
│   ├── public/
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── config/
│   ├── uploads/
│   ├── server.js
│   └── ...
│
├── .gitignore
└── README.md

---

⚙️ Installation

1. Clone the Repository

git clone https://github.com/coder-nik200/CivicFix.git
cd civicfix

---

2. Install Frontend Dependencies

cd frontend
npm install

---

3. Install Backend Dependencies

Open another terminal:

cd backend
npm install

---

🔐 Environment Variables

Create a .env file inside the backend directory.

PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

For the frontend:

NEXT_PUBLIC_API_URL=http://localhost:5001/api

Never commit .env files or API secrets to GitHub.

---

▶️ Running the Project

Start Backend

cd backend
npm run dev

Backend will run on:

http://localhost:5001

Start Frontend

cd frontend
npm run dev

Frontend will run on:

http://localhost:3000

---

🔄 Application Workflow

User opens CivicFix
        │
        ▼
     Login
        │
        ▼
Detect Location
        │
        ▼
Select Issue Type
        │
        ▼
Upload Image
        │
        ▼
Add Description
        │
        ▼
Submit Report
        │
        ▼
Backend API
        │
        ├──────────────► MongoDB
        │
        └──────────────► Image Storage
        │
        ▼
Issue appears on Map
        │
        ▼
Users / Authorities view issue
        │
        ▼
Issue Status Updated
        │
        ▼
       Resolved

---

🗺️ Map Intelligence

One of CivicFix’s key features is its location-based issue visualization.

Every report contains geographic coordinates:

{
  latitude: 31.2542,
  longitude: 75.7056
}

These coordinates are used to place the issue on the map.

The marker can be associated with the issue category:

Pothole       → Pothole Marker
Garbage       → Garbage Marker
Streetlight   → Streetlight Marker
Water Leak    → Water Marker
Road Damage   → Road Marker

When multiple reports occur in the same region, CivicFix can calculate report density and identify that region as a priority zone.

---

📈 Priority Area Concept

CivicFix can calculate an area’s priority based on factors such as:

Number of Reports
        +
Issue Severity
        +
Report Density
        +
Issue Status
        ↓
Priority Score

Example:

Area A
5 reports
→ Normal
Area B
18 reports
→ Attention Required
Area C
42 reports
→ 🔥 High Priority

This allows authorities to focus on areas with the greatest concentration of civic problems.

---

🔒 Security

CivicFix follows common web security practices, including:

* HTTP-only authentication cookies
* Protected API routes
* Password hashing
* Environment variables for secrets
* Input validation
* Authentication middleware
* CORS configuration
* File upload validation

---

🎯 Goals

CivicFix aims to:

* Make civic issue reporting easier
* Reduce communication gaps between citizens and authorities
* Provide location-specific issue information
* Improve transparency
* Help authorities prioritize high-problem areas
* Create a centralized civic issue database
* Encourage community participation

---

🔮 Future Improvements

Possible future enhancements include:

* 🤖 AI-based issue detection from uploaded images
* 🧠 Automatic issue severity prediction
* 📊 Advanced authority analytics dashboard
* 🔔 Real-time notifications
* 📱 Progressive Web App
* 🗺️ Heatmaps for issue density
* 🏆 Citizen contribution/reputation system
* 📍 Nearby issue recommendations
* 📧 Email and SMS notifications
* 🔐 Google authentication
* 🔢 OTP-based authentication
* 🏛️ Authority-specific dashboards
* 📈 Historical civic issue analytics
* 🌐 Multi-language support

---

💡 Why CivicFix?

Traditional civic complaint systems can make it difficult for citizens to:

* Clearly communicate where a problem exists
* Provide visual evidence
* Track complaint progress
* Understand the scale of problems in their area

CivicFix combines location, images, maps, issue tracking, and community reports into one platform.

Instead of simply asking:

“Where is the problem?”

CivicFix helps answer:

What is the problem, where is it, how serious is it, how many people reported it, and has it been resolved?

---

# 👨‍💻 Author

**Nitish Bharti**

- 💼 Portfolio: https://nitish-portfolio17.netlify.app/
- 💻 GitHub: https://github.com/coder-nik200
- 🔗 LinkedIn: https://www.linkedin.com/in/nitish-kumar-bharti-631a37359/

---

📜 License

This project is created for educational, innovation, and hackathon purposes.

You can add an open-source license such as MIT License when publishing the project publicly.

---

⭐ Support

If you find CivicFix useful, consider giving the repository a ⭐ on GitHub.

CivicFix — Report. Locate. Track. Fix.
