import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../sass/Student.scss';

export default function FacultyProfile() {
  const [user, setUser] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);
  
  // Basic Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [height, setHeight] = useState('');
  const [civilStatus, setCivilStatus] = useState('');
  const [houseStreetBarangay, setHouseStreetBarangay] = useState('');
  const [region, setRegion] = useState('');
  const [province, setProvince] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [religion, setReligion] = useState('');
  const [citizenship, setCitizenship] = useState('');
  const [contactNumberPhone, setContactNumberPhone] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [languageSpoken, setLanguageSpoken] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);
  
  // Professional Information
  const [employeeId, setEmployeeId] = useState('');
  const [position, setPosition] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [dateHired, setDateHired] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [officeLocation, setOfficeLocation] = useState('');
  const [officeHours, setOfficeHours] = useState('');
  const [researchInterests, setResearchInterests] = useState('');
  
  // Educational Background
  const [bachelorsDegree, setBachelorsDegree] = useState('');
  const [bachelorsSchool, setBachelorsSchool] = useState('');
  const [bachelorsYear, setBachelorsYear] = useState('');
  const [mastersDegree, setMastersDegree] = useState('');
  const [mastersSchool, setMastersSchool] = useState('');
  const [mastersYear, setMastersYear] = useState('');
  const [doctorateDegree, setDoctorateDegree] = useState('');
  const [doctorateSchool, setDoctorateSchool] = useState('');
  const [doctorateYear, setDoctorateYear] = useState('');
  const [otherCertifications, setOtherCertifications] = useState('');
  
  // Emergency Contact
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState('');
  const [emergencyContactNumber, setEmergencyContactNumber] = useState('');
  const [emergencyContactAddress, setEmergencyContactAddress] = useState('');

  useEffect(() => {
    fetchUser();
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (user) {
      fetchFacultyProfile();
    }
  }, [user]);

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '';
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? String(age) : '';
  };

  // Auto-calculate age when date of birth changes
  useEffect(() => {
    if (dateOfBirth) {
      const calculatedAge = calculateAge(dateOfBirth);
      if (calculatedAge) {
        setAge(calculatedAge);
      }
    }
  }, [dateOfBirth]);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/user');
      setUser(res.data);
    } catch (e) {
      console.error('Failed to fetch user', e);
    }
  };

  const fetchFacultyProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const res = await axios.get('/api/faculty');
      const facultyList = res.data;
      const facultyProfile = facultyList.find(f => f.email === user.email);
      
      if (facultyProfile) {
        setFaculty(facultyProfile);
        // Set all fields from faculty profile
        setFirstName(facultyProfile.first_name || '');
        setLastName(facultyProfile.last_name || '');
        setMiddleName(facultyProfile.middle_name || '');
        setAge(facultyProfile.age || '');
        setGender(facultyProfile.gender || '');
        setEmail(facultyProfile.email || user.email);
        setDateOfBirth(facultyProfile.date_of_birth || '');
        setPlaceOfBirth(facultyProfile.place_of_birth || '');
        setBloodType(facultyProfile.blood_type || '');
        setHeight(facultyProfile.height || '');
        setCivilStatus(facultyProfile.civil_status || '');
        setHouseStreetBarangay(facultyProfile.house_street_barangay || '');
        setRegion(facultyProfile.region || '');
        setProvince(facultyProfile.province || '');
        setMunicipality(facultyProfile.municipality || '');
        setReligion(facultyProfile.religion || '');
        setCitizenship(facultyProfile.citizenship || '');
        setContactNumberPhone(facultyProfile.contact_number_phone || '');
        setMobileNumber(facultyProfile.mobile_number || '');
        setLanguageSpoken(facultyProfile.language_spoken || '');
        setDepartmentId(facultyProfile.department_id || '');
        setEmployeeId(facultyProfile.employee_id || '');
        setPosition(facultyProfile.position || '');
        setEmploymentStatus(facultyProfile.employment_status || '');
        setDateHired(facultyProfile.date_hired || '');
        setYearsOfExperience(facultyProfile.years_of_experience || '');
        setSpecialization(facultyProfile.specialization || '');
        setOfficeLocation(facultyProfile.office_location || '');
        setOfficeHours(facultyProfile.office_hours || '');
        setResearchInterests(facultyProfile.research_interests || '');
        setBachelorsDegree(facultyProfile.bachelors_degree || '');
        setBachelorsSchool(facultyProfile.bachelors_school || '');
        setBachelorsYear(facultyProfile.bachelors_year || '');
        setMastersDegree(facultyProfile.masters_degree || '');
        setMastersSchool(facultyProfile.masters_school || '');
        setMastersYear(facultyProfile.masters_year || '');
        setDoctorateDegree(facultyProfile.doctorate_degree || '');
        setDoctorateSchool(facultyProfile.doctorate_school || '');
        setDoctorateYear(facultyProfile.doctorate_year || '');
        setOtherCertifications(facultyProfile.other_certifications || '');
        setEmergencyContactName(facultyProfile.emergency_contact_name || '');
        setEmergencyContactRelationship(facultyProfile.emergency_contact_relationship || '');
        setEmergencyContactNumber(facultyProfile.emergency_contact_number || '');
        setEmergencyContactAddress(facultyProfile.emergency_contact_address || '');
      } else {
        setEmail(user.email);
        setEditing(true);
      }
    } catch (e) {
      console.error('Failed to fetch faculty profile', e);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('/api/departments');
      setDepartments(res.data);
    } catch (e) {
      console.error('Failed to fetch departments', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    // Validate required fields
    if (!firstName || !lastName) {
      setError('First name and last name are required');
      return;
    }

    setLoading(true);
    try {
      const first_name = firstName.trim();
      const last_name = lastName.trim();
      
      if (!first_name || !last_name) {
        setError('First name and last name are required');
        setLoading(false);
        return;
      }

      const payload = {
        first_name: first_name,
        last_name: last_name,
        middle_name: middleName || null,
        age: age === '' ? null : Number(age),
        gender: gender || null,
        email: email || user.email,
        date_of_birth: dateOfBirth || null,
        place_of_birth: placeOfBirth || null,
        blood_type: bloodType || null,
        height: height || null,
        civil_status: civilStatus || null,
        house_street_barangay: houseStreetBarangay || null,
        region: region || null,
        province: province || null,
        municipality: municipality || null,
        religion: religion || null,
        citizenship: citizenship || null,
        contact_number_phone: contactNumberPhone || null,
        mobile_number: mobileNumber || null,
        language_spoken: languageSpoken || null,
        department_id: departmentId || null,
        employee_id: employeeId || null,
        position: position || null,
        employment_status: employmentStatus || null,
        date_hired: dateHired || null,
        years_of_experience: yearsOfExperience === '' ? null : Number(yearsOfExperience),
        specialization: specialization || null,
        office_location: officeLocation || null,
        office_hours: officeHours || null,
        research_interests: researchInterests || null,
        bachelors_degree: bachelorsDegree || null,
        bachelors_school: bachelorsSchool || null,
        bachelors_year: bachelorsYear || null,
        masters_degree: mastersDegree || null,
        masters_school: mastersSchool || null,
        masters_year: mastersYear || null,
        doctorate_degree: doctorateDegree || null,
        doctorate_school: doctorateSchool || null,
        doctorate_year: doctorateYear || null,
        other_certifications: otherCertifications || null,
        emergency_contact_name: emergencyContactName || null,
        emergency_contact_relationship: emergencyContactRelationship || null,
        emergency_contact_number: emergencyContactNumber || null,
        emergency_contact_address: emergencyContactAddress || null,
      };

      if (faculty) {
        await axios.put(`/api/faculty/${faculty.id}`, payload);
        setMessage('Profile updated successfully!');
      } else {
        await axios.post('/api/faculty', payload);
        setMessage('Profile created successfully!');
      }
      
      setEditing(false);
      await fetchFacultyProfile();
    } catch (err) {
      console.error('Error submitting profile:', err);
      const apiMsg = err?.response?.data?.message || Object.values(err?.response?.data || {})?.[0] || err.message;
      setError(typeof apiMsg === 'string' ? apiMsg : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setError('');
    setMessage('');
  };

  const handleCancel = () => {
    if (faculty) {
      setFirstName(faculty.first_name || '');
      setLastName(faculty.last_name || '');
      setMiddleName(faculty.middle_name || '');
      setAge(faculty.age || '');
      setGender(faculty.gender || '');
      setEmail(faculty.email || user.email);
      setDateOfBirth(faculty.date_of_birth || '');
      setPlaceOfBirth(faculty.place_of_birth || '');
      setBloodType(faculty.blood_type || '');
      setHeight(faculty.height || '');
      setCivilStatus(faculty.civil_status || '');
      setHouseStreetBarangay(faculty.house_street_barangay || '');
      setRegion(faculty.region || '');
      setProvince(faculty.province || '');
      setMunicipality(faculty.municipality || '');
      setReligion(faculty.religion || '');
      setCitizenship(faculty.citizenship || '');
      setContactNumberPhone(faculty.contact_number_phone || '');
      setMobileNumber(faculty.mobile_number || '');
      setLanguageSpoken(faculty.language_spoken || '');
      setDepartmentId(faculty.department_id || '');
    }
    setEditing(false);
    setError('');
    setMessage('');
  };

  if (loading && !faculty) {
    return React.createElement('div', { style: { padding: '20px', textAlign: 'center' } }, 'Loading profile...');
  }

  // Helper function to create form section
  const createFormSection = (title, fields) => {
    return React.createElement(React.Fragment, null,
      React.createElement('h3', { style: { marginTop: '20px', marginBottom: '15px', color: '#333', borderTop: '1px solid #e0e0e0', paddingTop: '15px' } }, title),
      ...fields
    );
  };

  // Helper function to create input field
  const createInput = (placeholder, value, onChange, type = 'text', options = {}) => {
    return React.createElement('input', {
      type,
      placeholder,
      value,
      onChange: (e) => onChange(e.target.value),
      style: { marginBottom: '10px', width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', ...options.style },
      ...options
    });
  };

  // Helper function to create select field
  const createSelect = (placeholder, value, onChange, options, style = {}) => {
    return React.createElement('select', {
      value,
      onChange: (e) => onChange(e.target.value),
      style: { marginBottom: '10px', width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', ...style }
    },
      React.createElement('option', { value: '' }, placeholder),
      ...options.map(opt => 
        typeof opt === 'string' 
          ? React.createElement('option', { key: opt, value: opt }, opt)
          : React.createElement('option', { key: opt.value, value: opt.value }, opt.label)
      )
    );
  };

  // Helper function to create two-column layout
  const createTwoColumnSection = (leftFields, rightFields) => {
    return React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' } },
      React.createElement('div', null, ...leftFields),
      React.createElement('div', null, ...rightFields)
    );
  };

  // Helper function to create radio buttons
  const createRadioGroup = (label, value, onChange, options) => {
    return React.createElement('div', { style: { marginBottom: '10px' } },
      React.createElement('label', { style: { display: 'block', marginBottom: '5px', fontWeight: '500' } }, label),
      React.createElement('div', { style: { display: 'flex', gap: '15px' } },
        ...options.map(opt => 
          React.createElement('label', { key: opt, style: { display: 'flex', alignItems: 'center', cursor: 'pointer' } },
            React.createElement('input', {
              type: 'radio',
              name: label,
              value: opt,
              checked: value === opt,
              onChange: (e) => onChange(e.target.value),
              style: { marginRight: '5px' }
            }),
            opt
          )
        )
      )
    );
  };

  return React.createElement('div', { className: 'card', style: { maxWidth: '1000px', margin: '0 auto' } },
    React.createElement('div', { className: 'card-header' },
      React.createElement('h2', null, 'FACULTY PROFILE')
    ),
    
    // Display mode
    !editing && React.createElement(React.Fragment, null,
      faculty ? React.createElement('div', { style: { padding: '20px' } },
        React.createElement('div', { style: { marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #e0e0e0' } },
          React.createElement('h3', { style: { marginBottom: '10px', color: '#333' } }, 'Personal Information'),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', marginBottom: '8px' } },
            React.createElement('strong', null, 'Name:'),
            React.createElement('span', null, `${faculty.first_name || ''} ${faculty.middle_name || ''} ${faculty.last_name || ''}`.trim() || 'Not set')
          ),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', marginBottom: '8px' } },
            React.createElement('strong', null, 'Email:'),
            React.createElement('span', null, faculty.email || user?.email || 'Not set')
          ),
          faculty.age && React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', marginBottom: '8px' } },
            React.createElement('strong', null, 'Age:'),
            React.createElement('span', null, faculty.age)
          ),
          faculty.gender && React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', marginBottom: '8px' } },
            React.createElement('strong', null, 'Gender:'),
            React.createElement('span', null, faculty.gender)
          ),
          faculty.department_id && React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', marginBottom: '8px' } },
            React.createElement('strong', null, 'Department:'),
            React.createElement('span', null, departments.find(d => d.id === faculty.department_id)?.name || departments.find(d => d.id === faculty.department_id)?.code || `ID: ${faculty.department_id}`)
          )
        ),
        React.createElement('div', { className: 'form-actions', style: { marginTop: '20px' } },
          React.createElement('button', { onClick: handleEdit, style: { padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' } }, 'Edit Profile')
        )
      ) : React.createElement('div', { style: { padding: '20px', textAlign: 'center' } },
        React.createElement('p', { style: { marginBottom: '20px', color: '#666' } }, 'You haven\'t created your profile yet. Please fill out your information below.'),
        React.createElement('button', { onClick: handleEdit, style: { padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' } }, 'Create Profile')
      )
    ),

    // Edit mode - Comprehensive Form
    editing && React.createElement('form', { className: 'post-form', onSubmit: handleSubmit, style: { padding: '20px', maxHeight: '80vh', overflowY: 'auto' } },
      error && React.createElement('div', { style: { background: '#ffdddd', color: '#900', padding: '8px', borderRadius: '6px', marginBottom: '15px' } }, error),
      message && React.createElement('div', { style: { background: '#ddffdd', color: '#064', padding: '8px', borderRadius: '6px', marginBottom: '15px' } }, message),
      
      // Personal Information - Two Column Layout
      createFormSection('Personal Information',
        [
          createTwoColumnSection(
            [
              createInput('Family Name (Last Name) *', lastName, setLastName, 'text', { required: true }),
              createInput('Given Name (First Name) *', firstName, setFirstName, 'text', { required: true }),
              createInput('Middle Name', middleName, setMiddleName),
              createInput('Date of Birth (mm/dd/yyyy) - Age will be calculated automatically', dateOfBirth, setDateOfBirth, 'date'),
              createInput('Place of Birth', placeOfBirth, setPlaceOfBirth),
            ],
            [
              createRadioGroup('Gender', gender, setGender, ['Male', 'Female']),
              createSelect('Blood Type', bloodType, setBloodType, ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown']),
              createInput('Age (auto-calculated from Date of Birth)', age, setAge, 'number', { min: 0, max: 150, readOnly: true, style: { background: '#f5f5f5', cursor: 'not-allowed' } }),
              createInput('Height', height, setHeight),
              createSelect('Civil Status', civilStatus, setCivilStatus, ['Single', 'Married', 'Divorced', 'Widowed']),
            ]
          )
        ]
      ),

      // Address Information
      createFormSection('Address Information',
        [
          createInput('House#/Street Name & Barangay', houseStreetBarangay, setHouseStreetBarangay),
          createTwoColumnSection(
            [
              createSelect('Region', region, setRegion, [
                'REGION I (Ilocos Region)',
                'REGION II (Cagayan Valley)',
                'REGION III (Central Luzon)',
                'REGION IV-A (CALABARZON)',
                'REGION IV-B (MIMAROPA)',
                'REGION V (Bicol Region)',
                'REGION VI (Western Visayas)',
                'REGION VII (Central Visayas)',
                'REGION VIII (Eastern Visayas)',
                'REGION IX (Zamboanga Peninsula)',
                'REGION X (Northern Mindanao)',
                'REGION XI (Davao Region)',
                'REGION XII (SOCCSKSARGEN)',
                'REGION XIII (Caraga)',
                'NCR (National Capital Region)',
                'CAR (Cordillera Administrative Region)',
                'BARMM (Bangsamoro Autonomous Region)'
              ]),
              createInput('Province', province, setProvince),
            ],
            [
              createInput('Municipality', municipality, setMunicipality),
            ]
          )
        ]
      ),

      // Contact and Other Details - Two Column Layout
      createFormSection('Contact and Other Details',
        [
          createTwoColumnSection(
            [
              createSelect('Religion', religion, setReligion, [
                'Roman Catholic',
                'Protestant',
                'Islam',
                'Iglesia ni Cristo',
                'Baptist',
                'Methodist',
                'Seventh-day Adventist',
                'Jehovah\'s Witness',
                'Buddhist',
                'Hindu',
                'Other'
              ]),
              createSelect('Citizenship', citizenship, setCitizenship, ['Filipino', 'Dual Citizen', 'Foreigner']),
              createInput('Contact Number (Phone)', contactNumberPhone, setContactNumberPhone, 'tel'),
              createInput('Language Spoken (comma-separated)', languageSpoken, setLanguageSpoken),
              createInput('E-mail', email, setEmail, 'email', { disabled: true, style: { background: '#f5f5f5', cursor: 'not-allowed' } }),
            ],
            [
              createInput('Mobile # (To receive SMS Broadcast)', mobileNumber, setMobileNumber, 'tel'),
            ]
          )
        ]
      ),

      // Professional Information
      createFormSection('Professional Information',
        [
          createSelect('Department', departmentId, setDepartmentId, departments.map(d => ({ value: d.id, label: d.name }))),
          createTwoColumnSection(
            [
              createInput('Employee ID', employeeId, setEmployeeId),
              createInput('Position/Title', position, setPosition),
              createSelect('Employment Status', employmentStatus, setEmploymentStatus, ['Full-time', 'Part-time', 'Contract', 'Adjunct', 'Visiting']),
              createInput('Date Hired', dateHired, setDateHired, 'date'),
            ],
            [
              createInput('Years of Experience', yearsOfExperience, setYearsOfExperience, 'number', { min: 0 }),
              createInput('Specialization/Field of Expertise', specialization, setSpecialization),
              createInput('Office Location', officeLocation, setOfficeLocation),
              createInput('Office Hours', officeHours, setOfficeHours, 'text', { placeholder: 'e.g., Mon-Fri 8:00 AM - 5:00 PM' }),
            ]
          ),
          createInput('Research Interests', researchInterests, setResearchInterests, 'text', { placeholder: 'Comma-separated research interests' }),
        ]
      ),

      // Educational Background - Bachelor's Degree
      createFormSection('Educational Background - Bachelor\'s Degree',
        [
          createInput('Degree', bachelorsDegree, setBachelorsDegree),
          createInput('School/University', bachelorsSchool, setBachelorsSchool),
          createInput('Year Graduated', bachelorsYear, setBachelorsYear),
        ]
      ),

      // Educational Background - Master's Degree
      createFormSection('Educational Background - Master\'s Degree',
        [
          createInput('Degree', mastersDegree, setMastersDegree),
          createInput('School/University', mastersSchool, setMastersSchool),
          createInput('Year Graduated', mastersYear, setMastersYear),
        ]
      ),

      // Educational Background - Doctorate/PhD
      createFormSection('Educational Background - Doctorate/PhD',
        [
          createInput('Degree', doctorateDegree, setDoctorateDegree),
          createInput('School/University', doctorateSchool, setDoctorateSchool),
          createInput('Year Graduated', doctorateYear, setDoctorateYear),
        ]
      ),

      // Other Certifications
      createFormSection('Other Certifications and Training',
        [
          createInput('Certifications (comma-separated)', otherCertifications, setOtherCertifications, 'text', { placeholder: 'e.g., Professional License, Training Certificates' }),
        ]
      ),

      // Emergency Contact
      createFormSection('PERSON TO CONTACT IN CASE OF EMERGENCY',
        [
          createInput('Name', emergencyContactName, setEmergencyContactName),
          createInput('Relationship', emergencyContactRelationship, setEmergencyContactRelationship),
          createInput('Contact Number', emergencyContactNumber, setEmergencyContactNumber, 'tel'),
          createInput('Address', emergencyContactAddress, setEmergencyContactAddress),
        ]
      ),

      React.createElement('div', { className: 'form-actions', style: { marginTop: '20px', position: 'sticky', bottom: 0, background: 'white', padding: '10px 0', borderTop: '1px solid #e0e0e0' } },
        React.createElement('button', {
          type: 'submit',
          disabled: loading,
          style: { padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '10px' }
        }, loading ? 'Saving...' : (faculty ? 'Update Profile' : 'Create Profile')),
        React.createElement('button', {
          type: 'button',
          onClick: handleCancel,
          className: 'cancel-btn',
          style: { padding: '10px 20px', background: '#ccc', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }
        }, 'Cancel')
      )
    )
  );
}
