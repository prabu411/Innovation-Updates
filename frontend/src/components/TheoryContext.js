import React from 'react';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-2xl font-bold text-gray-800 mb-3 border-b-2 border-blue-500 pb-2">{title}</h3>
    <div className="text-gray-700 leading-relaxed space-y-4 text-justify">
      {children}
    </div>
  </div>
);

const TheoryContext = () => {
  return (
    <div className="p-8 bg-white rounded-xl shadow-md m-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Innovation Dashboard – Theoretical Description
      </h2>

      <Section title="1. Overview of the Innovation Dashboard">
        <p>The Innovation Dashboard is designed as a centralized digital platform to manage, monitor, and promote innovation-driven activities within the institution. It replaces traditional communication methods such as WhatsApp groups and manual record keeping with a structured, secure, and scalable web-based system.</p>
        <p>The dashboard supports the Innovation Coordinator in organizing hackathons, tracking student participation, and generating official academic documents, thereby strengthening the institutional innovation ecosystem.</p>
      </Section>

      <Section title="2. Role of the Innovation Coordinator Dashboard">
        <p>The Innovation Coordinator plays a key role in nurturing innovation culture by connecting students, faculty, and external organizations. The dashboard acts as a command center that enables the coordinator to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Plan and manage hackathons and innovation events</li>
          <li>Monitor student participation and achievements</li>
          <li>Maintain accurate and permanent records of innovation activities</li>
          <li>Generate official reports for academic and administrative purposes</li>
        </ul>
        <p>This approach aligns with the institution’s vision of encouraging hands-on learning, interdisciplinary collaboration, and real-world problem solving.</p>
      </Section>

      <Section title="3. Centralized Innovation Management System">
        <p>Innovation activities such as hackathons, workshops, and competitions involve large amounts of data, including event details, student registrations, and approvals. Managing this data manually leads to inefficiency and inconsistency.</p>
        <p>The Innovation Dashboard provides:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>A single source of truth for all innovation-related data</li>
          <li>Centralized storage using a database for long-term accessibility</li>
          <li>Role-based access to ensure data security and accountability</li>
        </ul>
        <p>This centralized model improves transparency, reduces redundancy, and enhances operational efficiency.</p>
      </Section>

      <Section title="4. Dashboard Design Philosophy">
        <p>The dashboard UI is designed based on the following principles:</p>
        <div className="mt-4">
          <h4 className="font-bold text-gray-800">4.1 Simplicity and Clarity</h4>
          <p>The interface follows a minimal and professional design to ensure ease of use for faculty members. Clear navigation, readable typography, and structured layouts reduce cognitive load.</p>
        </div>
        <div className="mt-4">
          <h4 className="font-bold text-gray-800">4.2 Task-Oriented Layout</h4>
          <p>Each section of the dashboard is directly aligned with Innovation Coordinator responsibilities, such as event creation, student tracking, and report generation.</p>
        </div>
        <div className="mt-4">
          <h4 className="font-bold text-gray-800">4.3 Academic Professionalism</h4>
          <p>Neutral colors and formal layouts reflect the academic environment and maintain institutional identity.</p>
        </div>
      </Section>

      <Section title="5. Innovation Metrics and Overview Section">
        <p>The dashboard provides a summary view of innovation activities using information cards and tables. These include:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Total number of hackathons conducted</li>
          <li>Total student participants</li>
          <li>Upcoming innovation events</li>
          <li>Recently added hackathons</li>
        </ul>
        <p>Such metrics allow quick assessment of institutional innovation performance and support data-driven decision making.</p>
      </Section>

      <Section title="6. Student Participation Management">
        <p>Student participation is the core outcome of innovation initiatives. The dashboard enables the Innovation Coordinator to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>View applied student details in a structured tabular format</li>
          <li>Categorize participants based on events, dates, and modes</li>
          <li>Export student data in Excel format for analysis</li>
          <li>Generate PDF reports for academic documentation</li>
        </ul>
        <p>This ensures proper recognition of student involvement and supports institutional reporting.</p>
      </Section>

      <Section title="7. Automated Academic Documentation">
        <p>One of the key features of the dashboard is the automated generation of official documents, such as On-Duty (OD) letters.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>OD dates are automatically derived from hackathon event schedules</li>
          <li>Student details are dynamically populated</li>
          <li>Official formatting ensures consistency and professionalism</li>
        </ul>
        <p>Automation reduces manual effort, avoids errors, and improves administrative workflow.</p>
      </Section>

      <Section title="8. Hackathon Event Lifecycle Management">
        <p>The dashboard supports the complete lifecycle of hackathon management:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Creation of hackathon details</li>
          <li>Updating event information</li>
          <li>Deletion of outdated events</li>
        </ul>
        <p>All event data, including posters, descriptions, themes, and registration links, are securely stored in the database, ensuring long-term availability and traceability.</p>
      </Section>

      <Section title="9. Alignment with Institutional Innovation Goals">
        <p>The Innovation Dashboard reflects the institution’s commitment to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Encouraging creativity and innovation</li>
          <li>Promoting industry-academic collaboration</li>
          <li>Supporting student skill development</li>
          <li>Documenting innovation outcomes for accreditation and recognition</li>
        </ul>
        <p>By digitizing innovation management, the dashboard strengthens the overall innovation ecosystem of the institution.</p>
      </Section>

      <Section title="10. Conclusion">
        <p>The Innovation Coordinator Dashboard is not merely an administrative tool but a strategic platform that supports innovation culture, student engagement, and institutional excellence.</p>
        <p>By integrating structured data management, user-friendly design, and automated documentation, the dashboard enhances the effectiveness and impact of innovation initiatives within the college.</p>
      </Section>
    </div>
  );
};

export default TheoryContext;
