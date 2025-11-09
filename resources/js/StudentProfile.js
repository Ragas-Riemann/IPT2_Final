import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../sass/Student.scss';

export default function StudentProfile() {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
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
  const [courseId, setCourseId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  
  // Educational Background
  const [elementarySchoolName, setElementarySchoolName] = useState('');
  const [elementarySchoolAddress, setElementarySchoolAddress] = useState('');
  const [elementaryYearGraduated, setElementaryYearGraduated] = useState('');
  const [elementarySchoolType, setElementarySchoolType] = useState('');
  const [juniorHighSchoolName, setJuniorHighSchoolName] = useState('');
  const [juniorHighSchoolAddress, setJuniorHighSchoolAddress] = useState('');
  const [juniorHighYearGraduated, setJuniorHighYearGraduated] = useState('');
  const [juniorHighSchoolType, setJuniorHighSchoolType] = useState('');
  const [seniorHighSchoolName, setSeniorHighSchoolName] = useState('');
  const [seniorHighSchoolAddress, setSeniorHighSchoolAddress] = useState('');
  const [seniorHighYearGraduated, setSeniorHighYearGraduated] = useState('');
  const [seniorHighSchoolType, setSeniorHighSchoolType] = useState('');
  const [collegeSchoolName, setCollegeSchoolName] = useState('');
  const [collegeSchoolAddress, setCollegeSchoolAddress] = useState('');
  const [collegeYearGraduated, setCollegeYearGraduated] = useState('');
  const [collegeSchoolType, setCollegeSchoolType] = useState('');
  
  // Family Background - Mother
  const [motherFamilyName, setMotherFamilyName] = useState('');
  const [motherGivenName, setMotherGivenName] = useState('');
  const [motherMiddleName, setMotherMiddleName] = useState('');
  const [motherOccupation, setMotherOccupation] = useState('');
  const [motherHomeAddress, setMotherHomeAddress] = useState('');
  const [motherTownCity, setMotherTownCity] = useState('');
  const [motherProvince, setMotherProvince] = useState('');
  const [motherContactNumber, setMotherContactNumber] = useState('');
  const [motherMobileNumber, setMotherMobileNumber] = useState('');
  
  // Family Background - Father
  const [fatherFamilyName, setFatherFamilyName] = useState('');
  const [fatherGivenName, setFatherGivenName] = useState('');
  const [fatherMiddleName, setFatherMiddleName] = useState('');
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [fatherHomeAddress, setFatherHomeAddress] = useState('');
  const [fatherTownCity, setFatherTownCity] = useState('');
  const [fatherProvince, setFatherProvince] = useState('');
  const [fatherContactNumber, setFatherContactNumber] = useState('');
  const [fatherMobileNumber, setFatherMobileNumber] = useState('');
  
  // Siblings
  const [numberOfBrothers, setNumberOfBrothers] = useState('');
  const [numberOfSisters, setNumberOfSisters] = useState('');
  
  // Guardian Information
  const [guardianFamilyName, setGuardianFamilyName] = useState('');
  const [guardianGivenName, setGuardianGivenName] = useState('');
  const [guardianMiddleName, setGuardianMiddleName] = useState('');
  const [guardianRelationship, setGuardianRelationship] = useState('');
  const [guardianHomeAddress, setGuardianHomeAddress] = useState('');
  const [guardianContactNumber, setGuardianContactNumber] = useState('');
  const [guardianMobileNumber, setGuardianMobileNumber] = useState('');
  
  // Emergency Contact
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactNumber, setEmergencyContactNumber] = useState('');
  
  // Insurance Information
  const [studySponsor, setStudySponsor] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [insuranceBeneficiaryFamilyName, setInsuranceBeneficiaryFamilyName] = useState('');
  const [insuranceBeneficiaryGivenName, setInsuranceBeneficiaryGivenName] = useState('');
  const [insuranceBeneficiaryMiddleName, setInsuranceBeneficiaryMiddleName] = useState('');
  const [insuranceBeneficiaryDateOfBirth, setInsuranceBeneficiaryDateOfBirth] = useState('');
  
  // Academic Profile
  const [intendedDegreeProgram, setIntendedDegreeProgram] = useState('');
  const [isWorkingStudent, setIsWorkingStudent] = useState(false);
  const [employerName, setEmployerName] = useState('');
  const [employerAddress, setEmployerAddress] = useState('');
  const [previousSchoolsAttended, setPreviousSchoolsAttended] = useState('');
  const [appliedToFsuuBefore, setAppliedToFsuuBefore] = useState(false);
  const [fsuuApplicationYear, setFsuuApplicationYear] = useState('');
  const [fsuuWasAccepted, setFsuuWasAccepted] = useState(false);
  const [fsuuDidAttend, setFsuuDidAttend] = useState(false);
  const [fsuuYearAttended, setFsuuYearAttended] = useState('');
  
  // Additional Information
  const [isIndigenousPeoplesMember, setIsIndigenousPeoplesMember] = useState(false);
  const [indigenousTribe, setIndigenousTribe] = useState('');
  const [hasDisability, setHasDisability] = useState(false);
  const [disabilitySpecification, setDisabilitySpecification] = useState('');
  const [isSingleParentDependent, setIsSingleParentDependent] = useState(false);
  const [hasSpecialNeeds, setHasSpecialNeeds] = useState(false);
  const [specialNeedsSpecification, setSpecialNeedsSpecification] = useState('');

  useEffect(() => {
    fetchUser();
    fetchDepartments();
    fetchAllCourses();
  }, []);

  const fetchAllCourses = async () => {
    try {
      const res = await axios.get('/api/courses');
      setCourses(res.data);
    } catch (e) {
      console.error('Failed to fetch courses', e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStudentProfile();
    }
  }, [user]);

  useEffect(() => {
    if (departmentId) {
      fetchCoursesByDepartment(departmentId);
    } else {
      setFilteredCourses([]);
      setCourseId('');
    }
  }, [departmentId]);

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

  const fetchStudentProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const res = await axios.get('/api/students');
      const students = res.data;
      const studentProfile = students.find(s => s.email === user.email);
      
      if (studentProfile) {
        setStudent(studentProfile);
        // Set all fields from student profile
        setFirstName(studentProfile.first_name || '');
        setLastName(studentProfile.last_name || '');
        setMiddleName(studentProfile.middle_name || '');
        setAge(studentProfile.age || '');
        setGender(studentProfile.gender || '');
        setEmail(studentProfile.email || user.email);
        setDateOfBirth(studentProfile.date_of_birth || '');
        setPlaceOfBirth(studentProfile.place_of_birth || '');
        setBloodType(studentProfile.blood_type || '');
        setHeight(studentProfile.height || '');
        setCivilStatus(studentProfile.civil_status || '');
        setHouseStreetBarangay(studentProfile.house_street_barangay || '');
        setRegion(studentProfile.region || '');
        setProvince(studentProfile.province || '');
        setMunicipality(studentProfile.municipality || '');
        setReligion(studentProfile.religion || '');
        setCitizenship(studentProfile.citizenship || '');
        setContactNumberPhone(studentProfile.contact_number_phone || '');
        setMobileNumber(studentProfile.mobile_number || '');
        setLanguageSpoken(studentProfile.language_spoken || '');
        setDepartmentId(studentProfile.department_id || '');
        setCourseId(studentProfile.course_id || '');
        
        // Educational Background
        setElementarySchoolName(studentProfile.elementary_school_name || '');
        setElementarySchoolAddress(studentProfile.elementary_school_address || '');
        setElementaryYearGraduated(studentProfile.elementary_year_graduated || '');
        setElementarySchoolType(studentProfile.elementary_school_type || '');
        setJuniorHighSchoolName(studentProfile.junior_high_school_name || '');
        setJuniorHighSchoolAddress(studentProfile.junior_high_school_address || '');
        setJuniorHighYearGraduated(studentProfile.junior_high_year_graduated || '');
        setJuniorHighSchoolType(studentProfile.junior_high_school_type || '');
        setSeniorHighSchoolName(studentProfile.senior_high_school_name || '');
        setSeniorHighSchoolAddress(studentProfile.senior_high_school_address || '');
        setSeniorHighYearGraduated(studentProfile.senior_high_year_graduated || '');
        setSeniorHighSchoolType(studentProfile.senior_high_school_type || '');
        setCollegeSchoolName(studentProfile.college_school_name || '');
        setCollegeSchoolAddress(studentProfile.college_school_address || '');
        setCollegeYearGraduated(studentProfile.college_year_graduated || '');
        setCollegeSchoolType(studentProfile.college_school_type || '');
        
        // Family Background
        setMotherFamilyName(studentProfile.mother_family_name || '');
        setMotherGivenName(studentProfile.mother_given_name || '');
        setMotherMiddleName(studentProfile.mother_middle_name || '');
        setMotherOccupation(studentProfile.mother_occupation || '');
        setMotherHomeAddress(studentProfile.mother_home_address || '');
        setMotherTownCity(studentProfile.mother_town_city || '');
        setMotherProvince(studentProfile.mother_province || '');
        setMotherContactNumber(studentProfile.mother_contact_number || '');
        setMotherMobileNumber(studentProfile.mother_mobile_number || '');
        setFatherFamilyName(studentProfile.father_family_name || '');
        setFatherGivenName(studentProfile.father_given_name || '');
        setFatherMiddleName(studentProfile.father_middle_name || '');
        setFatherOccupation(studentProfile.father_occupation || '');
        setFatherHomeAddress(studentProfile.father_home_address || '');
        setFatherTownCity(studentProfile.father_town_city || '');
        setFatherProvince(studentProfile.father_province || '');
        setFatherContactNumber(studentProfile.father_contact_number || '');
        setFatherMobileNumber(studentProfile.father_mobile_number || '');
        setNumberOfBrothers(studentProfile.number_of_brothers || '');
        setNumberOfSisters(studentProfile.number_of_sisters || '');
        
        // Guardian
        setGuardianFamilyName(studentProfile.guardian_family_name || '');
        setGuardianGivenName(studentProfile.guardian_given_name || '');
        setGuardianMiddleName(studentProfile.guardian_middle_name || '');
        setGuardianRelationship(studentProfile.guardian_relationship || '');
        setGuardianHomeAddress(studentProfile.guardian_home_address || '');
        setGuardianContactNumber(studentProfile.guardian_contact_number || '');
        setGuardianMobileNumber(studentProfile.guardian_mobile_number || '');
        
        // Emergency Contact
        setEmergencyContactName(studentProfile.emergency_contact_name || '');
        setEmergencyContactNumber(studentProfile.emergency_contact_number || '');
        
        // Insurance
        setStudySponsor(studentProfile.study_sponsor || '');
        setMonthlyIncome(studentProfile.monthly_income || '');
        setInsuranceBeneficiaryFamilyName(studentProfile.insurance_beneficiary_family_name || '');
        setInsuranceBeneficiaryGivenName(studentProfile.insurance_beneficiary_given_name || '');
        setInsuranceBeneficiaryMiddleName(studentProfile.insurance_beneficiary_middle_name || '');
        setInsuranceBeneficiaryDateOfBirth(studentProfile.insurance_beneficiary_date_of_birth || '');
        
        // Academic Profile
        setIntendedDegreeProgram(studentProfile.intended_degree_program || '');
        setIsWorkingStudent(studentProfile.is_working_student || false);
        setEmployerName(studentProfile.employer_name || '');
        setEmployerAddress(studentProfile.employer_address || '');
        setPreviousSchoolsAttended(studentProfile.previous_schools_attended || '');
        setAppliedToFsuuBefore(studentProfile.applied_to_fsuu_before || false);
        setFsuuApplicationYear(studentProfile.fsuu_application_year || '');
        setFsuuWasAccepted(studentProfile.fsuu_was_accepted || false);
        setFsuuDidAttend(studentProfile.fsuu_did_attend || false);
        setFsuuYearAttended(studentProfile.fsuu_year_attended || '');
        
        // Additional Info
        setIsIndigenousPeoplesMember(studentProfile.is_indigenous_peoples_member || false);
        setIndigenousTribe(studentProfile.indigenous_tribe || '');
        setHasDisability(studentProfile.has_disability || false);
        setDisabilitySpecification(studentProfile.disability_specification || '');
        setIsSingleParentDependent(studentProfile.is_single_parent_dependent || false);
        setHasSpecialNeeds(studentProfile.has_special_needs || false);
        setSpecialNeedsSpecification(studentProfile.special_needs_specification || '');
        
        if (studentProfile.department_id) {
          fetchCoursesByDepartment(studentProfile.department_id);
        }
      } else {
        setEmail(user.email);
        setEditing(true);
      }
    } catch (e) {
      console.error('Failed to fetch student profile', e);
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

  const fetchCoursesByDepartment = async (deptId) => {
    try {
      const res = await axios.get(`/api/courses?department_id=${deptId}`);
      setFilteredCourses(res.data);
      const currentCourseId = courseId;
      if (currentCourseId && !res.data.find(c => c.id === Number(currentCourseId))) {
        setCourseId('');
      }
    } catch (e) {
      console.error('Failed to fetch courses', e);
      setFilteredCourses([]);
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
      // Ensure required fields are never empty
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
        department_id: departmentId || null,
        course_id: courseId || null,
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
        elementary_school_name: elementarySchoolName || null,
        elementary_school_address: elementarySchoolAddress || null,
        elementary_year_graduated: elementaryYearGraduated || null,
        elementary_school_type: elementarySchoolType || null,
        junior_high_school_name: juniorHighSchoolName || null,
        junior_high_school_address: juniorHighSchoolAddress || null,
        junior_high_year_graduated: juniorHighYearGraduated || null,
        junior_high_school_type: juniorHighSchoolType || null,
        senior_high_school_name: seniorHighSchoolName || null,
        senior_high_school_address: seniorHighSchoolAddress || null,
        senior_high_year_graduated: seniorHighYearGraduated || null,
        senior_high_school_type: seniorHighSchoolType || null,
        college_school_name: collegeSchoolName || null,
        college_school_address: collegeSchoolAddress || null,
        college_year_graduated: collegeYearGraduated || null,
        college_school_type: collegeSchoolType || null,
        mother_family_name: motherFamilyName || null,
        mother_given_name: motherGivenName || null,
        mother_middle_name: motherMiddleName || null,
        mother_occupation: motherOccupation || null,
        mother_home_address: motherHomeAddress || null,
        mother_town_city: motherTownCity || null,
        mother_province: motherProvince || null,
        mother_contact_number: motherContactNumber || null,
        mother_mobile_number: motherMobileNumber || null,
        father_family_name: fatherFamilyName || null,
        father_given_name: fatherGivenName || null,
        father_middle_name: fatherMiddleName || null,
        father_occupation: fatherOccupation || null,
        father_home_address: fatherHomeAddress || null,
        father_town_city: fatherTownCity || null,
        father_province: fatherProvince || null,
        father_contact_number: fatherContactNumber || null,
        father_mobile_number: fatherMobileNumber || null,
        number_of_brothers: numberOfBrothers === '' ? null : Number(numberOfBrothers),
        number_of_sisters: numberOfSisters === '' ? null : Number(numberOfSisters),
        guardian_family_name: guardianFamilyName || null,
        guardian_given_name: guardianGivenName || null,
        guardian_middle_name: guardianMiddleName || null,
        guardian_relationship: guardianRelationship || null,
        guardian_home_address: guardianHomeAddress || null,
        guardian_contact_number: guardianContactNumber || null,
        guardian_mobile_number: guardianMobileNumber || null,
        emergency_contact_name: emergencyContactName || null,
        emergency_contact_number: emergencyContactNumber || null,
        study_sponsor: studySponsor || null,
        monthly_income: monthlyIncome || null,
        insurance_beneficiary_family_name: insuranceBeneficiaryFamilyName || null,
        insurance_beneficiary_given_name: insuranceBeneficiaryGivenName || null,
        insurance_beneficiary_middle_name: insuranceBeneficiaryMiddleName || null,
        insurance_beneficiary_date_of_birth: insuranceBeneficiaryDateOfBirth || null,
        intended_degree_program: intendedDegreeProgram || null,
        is_working_student: isWorkingStudent,
        employer_name: employerName || null,
        employer_address: employerAddress || null,
        previous_schools_attended: previousSchoolsAttended || null,
        applied_to_fsuu_before: appliedToFsuuBefore,
        fsuu_application_year: fsuuApplicationYear || null,
        fsuu_was_accepted: fsuuWasAccepted,
        fsuu_did_attend: fsuuDidAttend,
        fsuu_year_attended: fsuuYearAttended || null,
        is_indigenous_peoples_member: isIndigenousPeoplesMember,
        indigenous_tribe: indigenousTribe || null,
        has_disability: hasDisability,
        disability_specification: disabilitySpecification || null,
        is_single_parent_dependent: isSingleParentDependent,
        has_special_needs: hasSpecialNeeds,
        special_needs_specification: specialNeedsSpecification || null,
      };

      // Use regular JSON payload
      if (student) {
        await axios.put(`/api/students/${student.id}`, payload);
        setMessage('Profile updated successfully!');
      } else {
        await axios.post('/api/students', payload);
        setMessage('Profile created successfully!');
      }
      
      setEditing(false);
      await fetchStudentProfile();
    } catch (err) {
      console.error('Error submitting profile:', err);
      console.error('Error response:', err?.response?.data);
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
    if (student) {
      // Reset all fields from student profile
      setFirstName(student.first_name || '');
      setLastName(student.last_name || '');
      setMiddleName(student.middle_name || '');
      setAge(student.age || '');
      setGender(student.gender || '');
      setEmail(student.email || user.email);
      setDateOfBirth(student.date_of_birth || '');
      setPlaceOfBirth(student.place_of_birth || '');
      setBloodType(student.blood_type || '');
      setHeight(student.height || '');
      setCivilStatus(student.civil_status || '');
      setHouseStreetBarangay(student.house_street_barangay || '');
      setRegion(student.region || '');
      setProvince(student.province || '');
      setMunicipality(student.municipality || '');
      setReligion(student.religion || '');
      setCitizenship(student.citizenship || '');
      setContactNumberPhone(student.contact_number_phone || '');
      setMobileNumber(student.mobile_number || '');
      setLanguageSpoken(student.language_spoken || '');
      setDepartmentId(student.department_id || '');
      setCourseId(student.course_id || '');
      // Reset all other fields similarly...
    }
    setEditing(false);
    setError('');
    setMessage('');
  };

  if (loading && !student) {
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

  // Helper function to create checkbox
  const createCheckbox = (label, checked, onChange) => {
    return React.createElement('label', { style: { display: 'flex', alignItems: 'center', marginBottom: '10px', cursor: 'pointer' } },
      React.createElement('input', {
        type: 'checkbox',
        checked,
        onChange: (e) => onChange(e.target.checked),
        style: { marginRight: '8px' }
      }),
      label
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
      React.createElement('h2', null, 'STUDENT PROFILE')
    ),
    
    // Display mode
    !editing && React.createElement(React.Fragment, null,
      student ? React.createElement('div', { style: { padding: '20px' } },
        React.createElement('div', { style: { marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #e0e0e0' } },
          React.createElement('h3', { style: { marginBottom: '10px', color: '#333' } }, 'Personal Information'),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', marginBottom: '8px' } },
            React.createElement('strong', null, 'Name:'),
            React.createElement('span', null, `${student.first_name || ''} ${student.middle_name || ''} ${student.last_name || ''}`.trim() || 'Not set')
          ),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', marginBottom: '8px' } },
            React.createElement('strong', null, 'Email:'),
            React.createElement('span', null, student.email || user?.email || 'Not set')
          ),
          student.age && React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', marginBottom: '8px' } },
            React.createElement('strong', null, 'Age:'),
            React.createElement('span', null, student.age)
          ),
          student.gender && React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', marginBottom: '8px' } },
            React.createElement('strong', null, 'Gender:'),
            React.createElement('span', null, student.gender)
          ),
          student.religion && React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', marginBottom: '8px' } },
            React.createElement('strong', null, 'Religion:'),
            React.createElement('span', null, student.religion)
          ),
          student.house_street_barangay && React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', marginBottom: '8px' } },
            React.createElement('strong', null, 'Address:'),
            React.createElement('span', null, student.house_street_barangay)
          )
        ),
        React.createElement('div', { style: { marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #e0e0e0' } },
          React.createElement('h3', { style: { marginBottom: '10px', color: '#333' } }, 'Academic Information'),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', marginBottom: '8px' } },
            React.createElement('strong', null, 'Department:'),
            React.createElement('span', null, student.department_id ? (departments.find(d => d.id === student.department_id)?.code || departments.find(d => d.id === student.department_id)?.name || `ID: ${student.department_id}`) : 'Not set')
          ),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', marginBottom: '8px' } },
            React.createElement('strong', null, 'Course:'),
            React.createElement('span', null, student.course_id ? courses.find(c => c.id === student.course_id)?.name || `ID: ${student.course_id}` : 'Not set')
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

      // Academic Information
      createFormSection('Academic Information',
        [
          createSelect('Department', departmentId, (val) => { setDepartmentId(val); setCourseId(''); }, departments.map(d => ({ value: d.id, label: d.name }))),
          createSelect('Course', courseId, setCourseId, filteredCourses.map(c => ({ value: c.id, label: c.name })), { opacity: departmentId ? 1 : 0.6 }),
        ]
      ),

      // Educational Background
      createFormSection('SCHOOL LAST ATTENDED - Elementary School',
        [
          createInput('Name of School', elementarySchoolName, setElementarySchoolName),
          createInput('Address', elementarySchoolAddress, setElementarySchoolAddress),
          createInput('Year Graduated', elementaryYearGraduated, setElementaryYearGraduated),
          createSelect('Type of School', elementarySchoolType, setElementarySchoolType, ['Private', 'Public']),
        ]
      ),

      createFormSection('SCHOOL LAST ATTENDED - Junior High School',
        [
          createInput('Name of School', juniorHighSchoolName, setJuniorHighSchoolName),
          createInput('Address', juniorHighSchoolAddress, setJuniorHighSchoolAddress),
          createInput('Year Graduated', juniorHighYearGraduated, setJuniorHighYearGraduated),
          createSelect('Type of School', juniorHighSchoolType, setJuniorHighSchoolType, ['Private', 'Public']),
        ]
      ),

      createFormSection('SCHOOL LAST ATTENDED - Senior High School',
        [
          createInput('Name of School', seniorHighSchoolName, setSeniorHighSchoolName),
          createInput('Address', seniorHighSchoolAddress, setSeniorHighSchoolAddress),
          createInput('Year Graduated', seniorHighYearGraduated, setSeniorHighYearGraduated),
          createSelect('Type of School', seniorHighSchoolType, setSeniorHighSchoolType, ['Private', 'Public']),
        ]
      ),

      createFormSection('SCHOOL LAST ATTENDED - College / Master\'s Degree',
        [
          createInput('Name of School', collegeSchoolName, setCollegeSchoolName),
          createInput('Address', collegeSchoolAddress, setCollegeSchoolAddress),
          createInput('Year Graduated', collegeYearGraduated, setCollegeYearGraduated),
          createSelect('Type of School', collegeSchoolType, setCollegeSchoolType, ['Private', 'Public']),
        ]
      ),

      // Family Background - Mother
      createFormSection('FAMILY BACKGROUND - Mother\'s Information',
        [
          createInput('Family Name', motherFamilyName, setMotherFamilyName),
          createInput('Given Name', motherGivenName, setMotherGivenName),
          createInput('Middle Name', motherMiddleName, setMotherMiddleName),
          createInput('Occupation', motherOccupation, setMotherOccupation),
          createInput('Home Address', motherHomeAddress, setMotherHomeAddress),
          createInput('Town/City', motherTownCity, setMotherTownCity),
          createInput('Province', motherProvince, setMotherProvince),
          createInput('Contact Number', motherContactNumber, setMotherContactNumber, 'tel'),
          createInput('Mobile #', motherMobileNumber, setMotherMobileNumber, 'tel'),
        ]
      ),

      // Family Background - Father
      createFormSection('FAMILY BACKGROUND - Father\'s Information',
        [
          createInput('Family Name', fatherFamilyName, setFatherFamilyName),
          createInput('Given Name', fatherGivenName, setFatherGivenName),
          createInput('Middle Name', fatherMiddleName, setFatherMiddleName),
          createInput('Occupation', fatherOccupation, setFatherOccupation),
          createInput('Home Address', fatherHomeAddress, setFatherHomeAddress),
          createInput('Town/City', fatherTownCity, setFatherTownCity),
          createInput('Province', fatherProvince, setFatherProvince),
          createInput('Contact Number', fatherContactNumber, setFatherContactNumber, 'tel'),
          createInput('Mobile #', fatherMobileNumber, setFatherMobileNumber, 'tel'),
        ]
      ),

      // Siblings
      createFormSection('Siblings',
        [
          createInput('No. of Brothers', numberOfBrothers, setNumberOfBrothers, 'number', { min: 0 }),
          createInput('No. of Sisters', numberOfSisters, setNumberOfSisters, 'number', { min: 0 }),
        ]
      ),

      // Guardian Information
      createFormSection('GUARDIAN INFORMATION',
        [
          createInput('Family Name', guardianFamilyName, setGuardianFamilyName),
          createInput('Given Name', guardianGivenName, setGuardianGivenName),
          createInput('Middle Name', guardianMiddleName, setGuardianMiddleName),
          createInput('Relationship', guardianRelationship, setGuardianRelationship),
          createInput('Home Address', guardianHomeAddress, setGuardianHomeAddress),
          createInput('Contact Number', guardianContactNumber, setGuardianContactNumber, 'tel'),
          createInput('Mobile #', guardianMobileNumber, setGuardianMobileNumber, 'tel'),
        ]
      ),

      // Emergency Contact
      createFormSection('PERSON TO CONTACT IN CASE OF EMERGENCY',
        [
          createInput('Name', emergencyContactName, setEmergencyContactName),
          createInput('Contact Number', emergencyContactNumber, setEmergencyContactNumber, 'tel'),
        ]
      ),

      // Insurance Information
      createFormSection('FOR INSURANCE PURPOSES',
        [
          createInput('Who supports/sponsors studies', studySponsor, setStudySponsor),
          createInput('Monthly Income of Parents/Sponsor', monthlyIncome, setMonthlyIncome),
          createInput('Insurance Beneficiary - Family Name', insuranceBeneficiaryFamilyName, setInsuranceBeneficiaryFamilyName),
          createInput('Insurance Beneficiary - Given Name', insuranceBeneficiaryGivenName, setInsuranceBeneficiaryGivenName),
          createInput('Insurance Beneficiary - Middle Name', insuranceBeneficiaryMiddleName, setInsuranceBeneficiaryMiddleName),
          createInput('Insurance Beneficiary - Date of Birth', insuranceBeneficiaryDateOfBirth, setInsuranceBeneficiaryDateOfBirth, 'date'),
        ]
      ),

      // Academic Profile
      createFormSection('ACADEMIC PROFILE - FOR SECOND COURSER ONLY',
        [
          createInput('What degree program do you intend to pursue?', intendedDegreeProgram, setIntendedDegreeProgram),
          createCheckbox('Are you a working student?', isWorkingStudent, setIsWorkingStudent),
          isWorkingStudent && createInput('Employer Name', employerName, setEmployerName),
          isWorkingStudent && createInput('Employer Address', employerAddress, setEmployerAddress),
        ]
      ),

      // Transferee Information
      createFormSection('FOR TRANSFEREE ONLY',
        [
          createInput('Previous Schools Attended (comma-separated)', previousSchoolsAttended, setPreviousSchoolsAttended),
          createCheckbox('Have you ever applied to FSUU before?', appliedToFsuuBefore, setAppliedToFsuuBefore),
          appliedToFsuuBefore && createInput('Year of Application', fsuuApplicationYear, setFsuuApplicationYear),
          appliedToFsuuBefore && createCheckbox('Were you accepted?', fsuuWasAccepted, setFsuuWasAccepted),
          appliedToFsuuBefore && createCheckbox('Did you attend?', fsuuDidAttend, setFsuuDidAttend),
          appliedToFsuuBefore && fsuuDidAttend && createInput('Year attended', fsuuYearAttended, setFsuuYearAttended),
        ]
      ),

      // Additional Information
      createFormSection('ADDITIONAL INFORMATION',
        [
          createCheckbox('Are you a member of an Indigenous Peoples group?', isIndigenousPeoplesMember, setIsIndigenousPeoplesMember),
          isIndigenousPeoplesMember && createInput('Please specify which tribe', indigenousTribe, setIndigenousTribe),
          createCheckbox('Do you have a disability?', hasDisability, setHasDisability),
          hasDisability && createInput('Please specify', disabilitySpecification, setDisabilitySpecification),
          createCheckbox('Are you dependent on a single/solo parent?', isSingleParentDependent, setIsSingleParentDependent),
          createCheckbox('Are you a student with special needs?', hasSpecialNeeds, setHasSpecialNeeds),
          hasSpecialNeeds && createInput('Please specify', specialNeedsSpecification, setSpecialNeedsSpecification),
        ]
      ),

      React.createElement('div', { className: 'form-actions', style: { marginTop: '20px', position: 'sticky', bottom: 0, background: 'white', padding: '10px 0', borderTop: '1px solid #e0e0e0' } },
        React.createElement('button', {
          type: 'submit',
          disabled: loading,
          style: { padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '10px' }
        }, loading ? 'Saving...' : (student ? 'Update Profile' : 'Create Profile')),
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
