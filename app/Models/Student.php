<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'first_name', 'last_name', 'middle_name', 'age', 'gender', 'email', 'profile_image', 'department_id', 'course_id',
        'date_of_birth', 'place_of_birth', 'blood_type', 'height', 'civil_status',
        'house_street_barangay', 'region', 'province', 'municipality',
        'religion', 'citizenship', 'contact_number_phone', 'mobile_number', 'language_spoken',
        'elementary_school_name', 'elementary_school_address', 'elementary_year_graduated', 'elementary_school_type',
        'junior_high_school_name', 'junior_high_school_address', 'junior_high_year_graduated', 'junior_high_school_type',
        'senior_high_school_name', 'senior_high_school_address', 'senior_high_year_graduated', 'senior_high_school_type',
        'college_school_name', 'college_school_address', 'college_year_graduated', 'college_school_type',
        'mother_family_name', 'mother_given_name', 'mother_middle_name', 'mother_occupation',
        'mother_home_address', 'mother_town_city', 'mother_province', 'mother_contact_number', 'mother_mobile_number',
        'father_family_name', 'father_given_name', 'father_middle_name', 'father_occupation',
        'father_home_address', 'father_town_city', 'father_province', 'father_contact_number', 'father_mobile_number',
        'number_of_brothers', 'number_of_sisters',
        'guardian_family_name', 'guardian_given_name', 'guardian_middle_name', 'guardian_relationship',
        'guardian_home_address', 'guardian_contact_number', 'guardian_mobile_number',
        'emergency_contact_name', 'emergency_contact_number',
        'study_sponsor', 'monthly_income',
        'insurance_beneficiary_family_name', 'insurance_beneficiary_given_name', 'insurance_beneficiary_middle_name', 'insurance_beneficiary_date_of_birth',
        'intended_degree_program', 'is_working_student', 'employer_name', 'employer_address',
        'previous_schools_attended', 'applied_to_fsuu_before', 'fsuu_application_year', 'fsuu_was_accepted', 'fsuu_did_attend', 'fsuu_year_attended',
        'is_indigenous_peoples_member', 'indigenous_tribe', 'has_disability', 'disability_specification',
        'is_single_parent_dependent', 'has_special_needs', 'special_needs_specification'
    ];
}


