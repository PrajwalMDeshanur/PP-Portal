// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './ViewApplications.css'; // Ensure this CSS file exists for styling

// const ViewApplications = () => {
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Fetch data from API
//   useEffect(() => {
//     const fetchApplications = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/applications');

//         // Sort applications by student name in ascending order
//         const sortedApplications = response.data.sort((a, b) =>
//           a.student_name.localeCompare(b.student_name)
//         );

//         setApplications(sortedApplications);
//       } catch (error) {
//         console.error('Error fetching applications:', error);
//         setError('Failed to load applications.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchApplications();
//   }, []);

//   return (
//     <div className="view-applications-container">
//       <h2>View Applications</h2>

//       {loading ? (
//         <p>Loading applications...</p>
//       ) : error ? (
//         <p className="error-message">{error}</p>
//       ) : applications.length === 0 ? (
//         <p>No applications found.</p>
//       ) : (
//         <table className="applications-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>NMMS Reg Number</th>
//               <th>Student Name</th>
//               <th>Father's Name</th>
//               <th>Gender</th>
//               <th>NMMS Year</th>
//               <th>GMAT Score</th>
//               <th>SAT Score</th>
//               <th>Date of Birth</th>
//             </tr>
//           </thead>
//           <tbody>
//             {applications.map((app) => (
//               <tr key={app.id}>
//                 <td>{app.id}</td>
//                 <td>{app.nmms_reg_number}</td>
//                 <td>{app.student_name}</td>
//                 <td>{app.father_name}</td>
//                 <td>{app.gender}</td>
//                 <td>{app.nmms_year}</td>
//                 <td>{app.gmat_score}</td>
//                 <td>{app.sat_score}</td>
//                 <td>{new Date(app.dob).toLocaleDateString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default ViewApplications;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewApplications.css'; // Ensure CSS is correctly imported

const ViewApplication = () => {
  const [students, setStudents] = useState([]);
  const [nmmsRegNumber, setNmmsRegNumber] = useState('');
  const [studentName, setStudentName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [gender, setGender] = useState('');
  const [nmmsYear, setNmmsYear] = useState('');
  const [gmatScore, setGmatScore] = useState('');
  const [satScore, setSatScore] = useState('');
  const [dob, setDob] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [error, setError] = useState('');

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/student');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students', error);
      setError('Failed to fetch student data.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const studentData = {
      nmms_reg_number: nmmsRegNumber,
      student_name: studentName,
      father_name: fatherName,
      gender,
      nmms_year: nmmsYear,
      gmat_score: gmatScore,
      sat_score: satScore,
      dob,
    };

    if (editMode) {
      try {
        await axios.put(`http://localhost:5000/student/${currentId}`, studentData);
        setEditMode(false);
        setCurrentId(null);
        fetchStudents();
      } catch (error) {
        console.error('Error updating student', error);
        setError('Failed to update student.');
      }
    }

    // Clear input fields after update
    setNmmsRegNumber('');
    setStudentName('');
    setFatherName('');
    setGender('');
    setNmmsYear('');
    setGmatScore('');
    setSatScore('');
    setDob('');
  };

  const handleEdit = (student) => {
    setNmmsRegNumber(student.nmms_reg_number);
    setStudentName(student.student_name);
    setFatherName(student.father_name);
    setGender(student.gender);
    setNmmsYear(student.nmms_year);
    setGmatScore(student.gmat_score);
    setSatScore(student.sat_score);
    setDob(student.dob);
    setEditMode(true);
    setCurrentId(student.id);
  };

  const handleDelete = async (studentId) => {
    try {
      await axios.delete(`http://localhost:5000/student/${studentId}`);
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student', error);
      setError('Failed to delete student.');
    }
  };

  return (
    <div className="view-applications-container">
      <h1>Student Details</h1>

      {error && <div className="error-message">{error}</div>}

      {/* Form for updating student information */}
      {editMode && (
        <form onSubmit={handleUpdate} className="edit-form">
          <input type="text" placeholder="NMMS Reg Number" value={nmmsRegNumber} onChange={(e) => setNmmsRegNumber(e.target.value)} />
          <input type="text" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
          <input type="text" placeholder="Father's Name" value={fatherName} onChange={(e) => setFatherName(e.target.value)} />
          <input type="text" placeholder="Gender" value={gender} onChange={(e) => setGender(e.target.value)} />
          <input type="text" placeholder="NMMS Year" value={nmmsYear} onChange={(e) => setNmmsYear(e.target.value)} />
          <input type="number" placeholder="GMAT Score" value={gmatScore} onChange={(e) => setGmatScore(e.target.value)} />
          <input type="number" placeholder="SAT Score" value={satScore} onChange={(e) => setSatScore(e.target.value)} />
          <input type="date" placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} />
          <button type="submit">Update Student</button>
        </form>
      )}

      {/* Table for displaying students */}
      <table className="applications-table">
        <thead>
          <tr>
            <th>NMMS Reg Number</th>
            <th>Student Name</th>
            <th>Father's Name</th>
            <th>Gender</th>
            <th>NMMS Year</th>
            <th>GMAT Score</th>
            <th>SAT Score</th>
            <th>Date of Birth</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.nmms_reg_number}</td>
              <td>{student.student_name}</td>
              <td>{student.father_name}</td>
              <td>{student.gender}</td>
              <td>{student.nmms_year}</td>
              <td>{student.gmat_score}</td>
              <td>{student.sat_score}</td>
              <td>{student.dob}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(student)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(student.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewApplication;
