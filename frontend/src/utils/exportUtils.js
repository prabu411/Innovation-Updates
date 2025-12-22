import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToExcel = (students, hackathonName) => {
  console.log('Export data:', students);
  console.log('First student:', students[0]);
  
  const data = students.map((app, index) => {
    console.log('Processing app:', app);
    return {
      'S.No': index + 1,
      'Name': app.student?.name || app.name || 'N/A',
      'Roll Number': app.student?.rollNumber || app.rollNumber || 'N/A',
      'Department': app.student?.department || app.department || 'N/A',
      'Year': app.student?.year || app.year || 'N/A',
      'Email': app.student?.email || app.email || 'N/A',
      'Hackathon': app.hackathon?.name || app.hackathonName || 'N/A',
      'Applied Date': new Date(app.createdAt || app.appliedDate || Date.now()).toLocaleDateString()
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Students');
  XLSX.writeFile(wb, `${hackathonName || 'Students'}_List.xlsx`);
};

export const exportStudentListPDF = (students, hackathonName) => {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text('Student Participation List', 14, 15);
  doc.setFontSize(12);
  doc.text(`Event: ${hackathonName || 'All Events'}`, 14, 25);
  
  const tableData = students.map((app, index) => [
    index + 1,
    app.student?.name || 'N/A',
    app.student?.rollNumber || 'N/A'
  ]);

  doc.autoTable({
    startY: 30,
    head: [['S.No', 'Name', 'Roll Number']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] }
  });

  doc.save(`${hackathonName || 'Students'}_List.pdf`);
};

export const generateODLetter = (students, hackathonName, eventDate) => {
  const doc = new jsPDF();
  
  doc.setFontSize(12);
  doc.text('From', 14, 20);
  doc.text('Innovation Coordinator', 14, 27);
  doc.text('Department of Computer Science and Engineering', 14, 34);
  doc.text('Sri Eshwar College of Engineering', 14, 41);
  
  doc.text('To', 14, 55);
  doc.text('The Head of the Department', 14, 62);
  doc.text('Department of Computer Science and Engineering', 14, 69);
  doc.text('Sri Eshwar College of Engineering', 14, 76);
  
  doc.setFont(undefined, 'bold');
  doc.text('Subject: Request for Granting On-Duty Leave', 14, 90);
  doc.setFont(undefined, 'normal');
  
  doc.text('Respected Sir/Madam,', 14, 104);
  
  const bodyText = `I kindly request you to grant On-Duty (OD) leave to the following students of Computer Science and Engineering on ${eventDate} for attending ${hackathonName}.`;
  const splitText = doc.splitTextToSize(bodyText, 180);
  doc.text(splitText, 14, 114);
  
  doc.text('Student Details:', 14, 134);
  
  let yPos = 144;
  students.forEach((app, index) => {
    doc.text(`${index + 1}. Name: ${app.student?.name || 'N/A'}, Roll No: ${app.student?.rollNumber || 'N/A'}`, 14, yPos);
    yPos += 7;
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
  });
  
  yPos += 10;
  const closingText = 'Their participation in this program will contribute to their academic and professional development. I request your approval to mark them on OD for the mentioned date(s).';
  const splitClosing = doc.splitTextToSize(closingText, 180);
  doc.text(splitClosing, 14, yPos);
  
  yPos += splitClosing.length * 7 + 10;
  doc.text('Thank you for your kind consideration.', 14, yPos);
  
  yPos += 14;
  doc.text('Yours sincerely,', 14, yPos);
  doc.text('Innovation Coordinator', 14, yPos + 7);
  doc.text('Department of Computer Science and Engineering', 14, yPos + 14);
  
  doc.save(`OD_Letter_${hackathonName}.pdf`);
};
