import React from 'react';
import '../components/AboutUs.css'; // Import your custom CSS for styling
import Footer from "../components/Footer";
const teamMembers = [
  {
    role: 'Front-End Developer',
    name: 'Tshemollo Rapolai',
    roleType: 'Fixed for the duration of the project',
    duties: [
      'Coordinate project duties, oversee progress, address issues as they arise, and ensure alignment with project goals.',
      'Facilitate communication among team members and stakeholders.',
      'Resolve conflicts and make critical decisions to keep the project on track.',
      'Develop the interactive dashboard using HTML, CSS, and JavaScript frameworks (e.g., React.js or Vue.js).',
      'Ensure the dashboard displays network performance metrics and geospatial analysis effectively.',
      'Collaborate with back-end developers to integrate data and ensure smooth functionality.',
    ],
  },
  {
    role: 'Back-End Developer',
    name: 'Bucibo Neo',
    roleType: 'Rotating for the duration of the project',
    duties: [
      'Take responsibility for the overall design and integration of the Network Performance Insights Platform.',
      'Ensure that the architecture aligns with project requirements, scalability, and performance goals.',
      'Develop and maintain the server-side components of the platform using Python (e.g., Django or Flask).',
      'Ensure data storage and processing using BigQuery and SQL databases.',
      'Implement API integrations and manage server-side logic for the application.',
    ],
  },
  {
    role: 'QA Specialist',
    name: 'Boke Lets’oara',
    roleType: 'Rotating for the duration of the project',
    duties: [
      'Ensure that all documentation meets project requirements and is up to date.',
      'Record all meetings and action points, keeping detailed notes.',
      'Manage communication channels to ensure that information is effectively shared among team members and stakeholders.',
      'Conduct thorough testing of the platform, including functional, performance, and security testing.',
      'Develop and execute test cases to identify and address bugs and ensure system reliability.',
      'Collaborate with developers to resolve issues and validate fixes.',
    ],
  },
];

const Settings = () => {
  return (
    <section className="about-us">
      <div className="container">
        <h3>About Us</h3>
        <div className="team-photo">
          <img src="/1-ffe1b2e3.jpg" alt="Our Team Photo" />
        </div>
        <div className="team-details">
          {teamMembers.map((member, index) => (
            <div className="team-member" key={index}>
              <h2>{member.role}</h2>
              <h3>Name: {member.name}</h3>
              <p><strong>Role Type:</strong> {member.roleType}</p>
              <p><strong>Duties:</strong></p>
              <ul>
                {member.duties.map((duty, dutyIndex) => (
                  <li key={dutyIndex}>{duty}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </section>
    
  );
};

export default Settings;
