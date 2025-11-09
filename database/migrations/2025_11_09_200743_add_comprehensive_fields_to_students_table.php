<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            // Personal Information
            $table->string('middle_name')->nullable()->after('last_name');
            $table->date('date_of_birth')->nullable()->after('age');
            $table->string('place_of_birth')->nullable()->after('date_of_birth');
            $table->enum('blood_type', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'])->nullable()->after('gender');
            $table->string('height')->nullable()->after('blood_type');
            $table->enum('civil_status', ['Single', 'Married', 'Divorced', 'Widowed'])->nullable()->after('height');
            
            // Address Information
            $table->text('house_street_barangay')->nullable()->after('civil_status');
            $table->string('region')->nullable()->after('house_street_barangay');
            $table->string('province')->nullable()->after('region');
            $table->string('municipality')->nullable()->after('province');
            
            // Contact and Other Details
            $table->string('religion')->nullable()->after('municipality');
            $table->string('citizenship')->nullable()->after('religion');
            $table->string('contact_number_phone')->nullable()->after('citizenship');
            $table->string('mobile_number')->nullable()->after('contact_number_phone');
            $table->string('language_spoken')->nullable()->after('mobile_number'); // Comma-separated
            
            // Educational Background
            $table->string('elementary_school_name')->nullable()->after('language_spoken');
            $table->string('elementary_school_address')->nullable()->after('elementary_school_name');
            $table->string('elementary_year_graduated')->nullable()->after('elementary_school_address');
            $table->enum('elementary_school_type', ['Private', 'Public'])->nullable()->after('elementary_year_graduated');
            
            $table->string('junior_high_school_name')->nullable()->after('elementary_school_type');
            $table->string('junior_high_school_address')->nullable()->after('junior_high_school_name');
            $table->string('junior_high_year_graduated')->nullable()->after('junior_high_school_address');
            $table->enum('junior_high_school_type', ['Private', 'Public'])->nullable()->after('junior_high_year_graduated');
            
            $table->string('senior_high_school_name')->nullable()->after('junior_high_school_type');
            $table->string('senior_high_school_address')->nullable()->after('senior_high_school_name');
            $table->string('senior_high_year_graduated')->nullable()->after('senior_high_school_address');
            $table->enum('senior_high_school_type', ['Private', 'Public'])->nullable()->after('senior_high_year_graduated');
            
            $table->string('college_school_name')->nullable()->after('senior_high_school_type');
            $table->string('college_school_address')->nullable()->after('college_school_name');
            $table->string('college_year_graduated')->nullable()->after('college_school_address');
            $table->enum('college_school_type', ['Private', 'Public'])->nullable()->after('college_year_graduated');
            
            // Family Background - Mother
            $table->string('mother_family_name')->nullable()->after('college_school_type');
            $table->string('mother_given_name')->nullable()->after('mother_family_name');
            $table->string('mother_middle_name')->nullable()->after('mother_given_name');
            $table->string('mother_occupation')->nullable()->after('mother_middle_name');
            $table->text('mother_home_address')->nullable()->after('mother_occupation');
            $table->string('mother_town_city')->nullable()->after('mother_home_address');
            $table->string('mother_province')->nullable()->after('mother_town_city');
            $table->string('mother_contact_number')->nullable()->after('mother_province');
            $table->string('mother_mobile_number')->nullable()->after('mother_contact_number');
            
            // Family Background - Father
            $table->string('father_family_name')->nullable()->after('mother_mobile_number');
            $table->string('father_given_name')->nullable()->after('father_family_name');
            $table->string('father_middle_name')->nullable()->after('father_given_name');
            $table->string('father_occupation')->nullable()->after('father_middle_name');
            $table->text('father_home_address')->nullable()->after('father_occupation');
            $table->string('father_town_city')->nullable()->after('father_home_address');
            $table->string('father_province')->nullable()->after('father_town_city');
            $table->string('father_contact_number')->nullable()->after('father_province');
            $table->string('father_mobile_number')->nullable()->after('father_contact_number');
            
            // Siblings
            $table->integer('number_of_brothers')->nullable()->default(0)->after('father_mobile_number');
            $table->integer('number_of_sisters')->nullable()->default(0)->after('number_of_brothers');
            
            // Guardian Information
            $table->string('guardian_family_name')->nullable()->after('number_of_sisters');
            $table->string('guardian_given_name')->nullable()->after('guardian_family_name');
            $table->string('guardian_middle_name')->nullable()->after('guardian_given_name');
            $table->string('guardian_relationship')->nullable()->after('guardian_middle_name');
            $table->text('guardian_home_address')->nullable()->after('guardian_relationship');
            $table->string('guardian_contact_number')->nullable()->after('guardian_home_address');
            $table->string('guardian_mobile_number')->nullable()->after('guardian_contact_number');
            
            // Emergency Contact
            $table->string('emergency_contact_name')->nullable()->after('guardian_mobile_number');
            $table->string('emergency_contact_number')->nullable()->after('emergency_contact_name');
            
            // Insurance Information
            $table->string('study_sponsor')->nullable()->after('emergency_contact_number');
            $table->string('monthly_income')->nullable()->after('study_sponsor');
            $table->string('insurance_beneficiary_family_name')->nullable()->after('monthly_income');
            $table->string('insurance_beneficiary_given_name')->nullable()->after('insurance_beneficiary_family_name');
            $table->string('insurance_beneficiary_middle_name')->nullable()->after('insurance_beneficiary_given_name');
            $table->date('insurance_beneficiary_date_of_birth')->nullable()->after('insurance_beneficiary_middle_name');
            
            // Academic Profile - Second Courser
            $table->string('intended_degree_program')->nullable()->after('insurance_beneficiary_date_of_birth');
            $table->boolean('is_working_student')->nullable()->after('intended_degree_program');
            $table->string('employer_name')->nullable()->after('is_working_student');
            $table->text('employer_address')->nullable()->after('employer_name');
            
            // Transferee Information
            $table->text('previous_schools_attended')->nullable()->after('employer_address'); // JSON or text
            $table->boolean('applied_to_fsuu_before')->nullable()->after('previous_schools_attended');
            $table->string('fsuu_application_year')->nullable()->after('applied_to_fsuu_before');
            $table->boolean('fsuu_was_accepted')->nullable()->after('fsuu_application_year');
            $table->boolean('fsuu_did_attend')->nullable()->after('fsuu_was_accepted');
            $table->string('fsuu_year_attended')->nullable()->after('fsuu_did_attend');
            
            // Additional Information
            $table->boolean('is_indigenous_peoples_member')->nullable()->after('fsuu_year_attended');
            $table->string('indigenous_tribe')->nullable()->after('is_indigenous_peoples_member');
            $table->boolean('has_disability')->nullable()->after('indigenous_tribe');
            $table->string('disability_specification')->nullable()->after('has_disability');
            $table->boolean('is_single_parent_dependent')->nullable()->after('disability_specification');
            $table->boolean('has_special_needs')->nullable()->after('is_single_parent_dependent');
            $table->string('special_needs_specification')->nullable()->after('has_special_needs');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'middle_name', 'date_of_birth', 'place_of_birth', 'blood_type', 'height', 'civil_status',
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
            ]);
        });
    }
};
