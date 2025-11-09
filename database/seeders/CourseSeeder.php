<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\Department;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get departments by code
        $departments = Department::all()->keyBy('code');
        
        $courses = [
            // TEACHERS EDUCATION PROGRAM (TEP)
            ['name' => 'BECE', 'full_name' => 'Bachelor of Early Childhood Education', 'department_code' => 'TEP'],
            ['name' => 'BECED', 'full_name' => 'Bachelor of Early Childhood Education', 'department_code' => 'TEP'],
            ['name' => 'BEE', 'full_name' => 'Bachelor of Elementary Education - Special Education', 'department_code' => 'TEP'],
            ['name' => 'BEE-PRES.ED.', 'full_name' => 'Bachelor of Elementary Education - Preschool Education', 'department_code' => 'TEP'],
            ['name' => 'BEED', 'full_name' => 'Bachelor of Elementary Education', 'department_code' => 'TEP'],
            ['name' => 'BEEG', 'full_name' => 'Bachelor of Elementary Education - (variant)', 'department_code' => 'TEP'],
            ['name' => 'BEEPE', 'full_name' => 'Bachelor of Elementary Education - Preschool Education', 'department_code' => 'TEP'],
            ['name' => 'BEESE', 'full_name' => 'Bachelor of Elementary Education - Specialization in Special Education', 'department_code' => 'TEP'],
            ['name' => 'BSE-BS', 'full_name' => 'Bachelor of Secondary Education - Major in Biological Science', 'department_code' => 'TEP'],
            ['name' => 'BSE-E', 'full_name' => 'Bachelor of Secondary Education - Major in English', 'department_code' => 'TEP'],
            ['name' => 'BSE-F', 'full_name' => 'Bachelor of Secondary Education - Major in Filipino', 'department_code' => 'TEP'],
            ['name' => 'BSE-M', 'full_name' => 'Bachelor of Secondary Education - Major in Mathematics', 'department_code' => 'TEP'],
            ['name' => 'BSE-MAPEH', 'full_name' => 'Bachelor of Secondary Education - Major in MAPEH', 'department_code' => 'TEP'],
            ['name' => 'BSE-PS', 'full_name' => 'Bachelor of Secondary Education - Major in Physical Science', 'department_code' => 'TEP'],
            ['name' => 'BSE-S', 'full_name' => 'Bachelor of Secondary Education - Major in Science', 'department_code' => 'TEP'],
            ['name' => 'BSE-SS', 'full_name' => 'Bachelor of Secondary Education - Major in Social Studies', 'department_code' => 'TEP'],
            ['name' => 'BSE-UNIT EARNER', 'full_name' => 'Bachelor of Secondary Education - Unit Earner', 'department_code' => 'TEP'],
            ['name' => 'BSED', 'full_name' => 'Bachelor of Secondary Education - Unit Earner', 'department_code' => 'TEP'],
            ['name' => 'BSPEd', 'full_name' => 'Bachelor of Special Education', 'department_code' => 'TEP'],
            ['name' => 'BSNED', 'full_name' => 'Bachelor of Special Needs Education', 'department_code' => 'TEP'],
            ['name' => 'BPED', 'full_name' => 'Bachelor of Physical Education', 'department_code' => 'TEP'],
            ['name' => 'BPE', 'full_name' => 'Bachelor of Physical Education - Major in School P.E.', 'department_code' => 'TEP'],
            ['name' => 'TEDUE', 'full_name' => 'Teacher Education Unit Earner\'s Course', 'department_code' => 'TEP'],
            ['name' => 'PS', 'full_name' => 'Pre-School', 'department_code' => 'TEP'],

            // COMPUTER STUDIES PROGRAM (CSP)
            ['name' => 'BSIT', 'full_name' => 'Bachelor of Science in Information Technology', 'department_code' => 'CSP'],
            ['name' => 'BSIT-CA', 'full_name' => 'Bachelor of Science in Information Technology - with Special Training Courses in Computer Animation', 'department_code' => 'CSP'],
            ['name' => 'BSCS', 'full_name' => 'Bachelor of Science in Computer Science', 'department_code' => 'CSP'],
            ['name' => 'BSCS-DS', 'full_name' => 'Bachelor of Science in Computer Science - with Special Training in Data Science and Analytics', 'department_code' => 'CSP'],
            ['name' => 'BSEMC-DA', 'full_name' => 'Bachelor of Science in Entertainment and Multimedia Computing - Digital Animation', 'department_code' => 'CSP'],
            ['name' => 'BSEMC-GD', 'full_name' => 'Bachelor of Science in Entertainment and Multimedia Computing - Game Development', 'department_code' => 'CSP'],
            ['name' => 'DIT', 'full_name' => 'Diploma in Information Technology', 'department_code' => 'CSP'],
            ['name' => 'ITDP', 'full_name' => 'Information Technology Diploma Program', 'department_code' => 'CSP'],
            ['name' => 'PRG', 'full_name' => 'Programming NC IV', 'department_code' => 'CSP'],
            ['name' => 'CS', 'full_name' => 'Computer Secretarial', 'department_code' => 'CSP'],
            ['name' => 'CHS', 'full_name' => 'Computer Hardware Servicing NC II', 'department_code' => 'CSP'],
            ['name' => 'CES1', 'full_name' => 'Consumer Electronics Servicing NC II', 'department_code' => 'CSP'],
            ['name' => 'PCO', 'full_name' => 'PC Operations NC II', 'department_code' => 'CSP'],

            // ACCOUNTANCY PROGRAM (AP)
            ['name' => 'BSA', 'full_name' => 'Bachelor of Science in Accountancy', 'department_code' => 'AP'],
            ['name' => 'BSAAM', 'full_name' => 'Bachelor of Science in Accountancy - Major in Accounting Management', 'department_code' => 'AP'],
            ['name' => 'BSAIS', 'full_name' => 'Bachelor of Science in Accounting Information System', 'department_code' => 'AP'],
            ['name' => 'BSAT', 'full_name' => 'Bachelor of Science in Accounting Technology', 'department_code' => 'AP'],
            ['name' => 'BSC-ACM', 'full_name' => 'Bachelor of Science in Commerce - Major in Accounting Management', 'department_code' => 'AP'],
            ['name' => 'BSMA', 'full_name' => 'Bachelor of Science in Management Accounting', 'department_code' => 'AP'],
            ['name' => 'AUDIT_ACC', 'full_name' => 'Audit Undergraduate Accountancy', 'department_code' => 'AP'],
            ['name' => 'CPA R', 'full_name' => 'CPA Refresher', 'department_code' => 'AP'],
            ['name' => 'BSIA', 'full_name' => 'Bachelor of Science in Internal Auditing', 'department_code' => 'AP'],

            // BUSINESS ADMINISTRATION PROGRAM (BAP)
            ['name' => 'BSBA-FM', 'full_name' => 'Bachelor of Science in Business Administration - Major in Financial Management', 'department_code' => 'BAP'],
            ['name' => 'BSBA-HRDM', 'full_name' => 'Bachelor of Science in Business Administration - Major in Human Resource Development Management', 'department_code' => 'BAP'],
            ['name' => 'BSBA-HRMGT', 'full_name' => 'Bachelor of Science in Business Administration - Major in Human Resource Management', 'department_code' => 'BAP'],
            ['name' => 'BSBA-MM', 'full_name' => 'Bachelor of Science in Business Administration - Major in Marketing Management', 'department_code' => 'BAP'],
            ['name' => 'BSBA-OM', 'full_name' => 'Bachelor of Science in Business Administration - Major in Operations Management', 'department_code' => 'BAP'],
            ['name' => 'BSC-BIS', 'full_name' => 'Bachelor of Science in Commerce - Major in Business Information System', 'department_code' => 'BAP'],
            ['name' => 'BSC-F', 'full_name' => 'Bachelor of Science in Commerce - Major in Finance', 'department_code' => 'BAP'],
            ['name' => 'BSC-LM', 'full_name' => 'Bachelor of Science in Commerce - Major in Legal Management', 'department_code' => 'BAP'],
            ['name' => 'BSC-MK', 'full_name' => 'Bachelor of Science in Commerce - Major in Marketing', 'department_code' => 'BAP'],
            ['name' => 'BSC-MN', 'full_name' => 'Bachelor of Science in Commerce - Major in Management', 'department_code' => 'BAP'],
            ['name' => 'BSE', 'full_name' => 'Bachelor of Science in Entrepreneurship', 'department_code' => 'BAP'],
            ['name' => 'BSOA', 'full_name' => 'Bachelor of Science in Office Administration', 'department_code' => 'BAP'],
            ['name' => 'BSOA-IOM', 'full_name' => 'Bachelor of Science in Office Administration - Industrial Office Management', 'department_code' => 'BAP'],
            ['name' => 'BSOA-LOM', 'full_name' => 'Bachelor of Science in Office Administration - Legal Office Management', 'department_code' => 'BAP'],
            ['name' => 'BSSE', 'full_name' => 'Bachelor of Science in Social Entrepreneurship', 'department_code' => 'BAP'],
            ['name' => 'BSSE-AB', 'full_name' => 'Bachelor of Science in Social Entrepreneurship - Specialization in Agri-Aqua Business', 'department_code' => 'BAP'],
            ['name' => 'BSSE-ACB', 'full_name' => 'Bachelor of Science in Social Entrepreneurship - Specialization in Arts and Crafts Business', 'department_code' => 'BAP'],

            // TOURISM AND HOSPITALITY MANAGEMENT PROGRAM (THMP)
            ['name' => 'BSHM', 'full_name' => 'Bachelor of Science in Hospitality Management', 'department_code' => 'THMP'],
            ['name' => 'BSHM REV.', 'full_name' => 'Bachelor of Science in Hospitality Management - Revised', 'department_code' => 'THMP'],
            ['name' => 'BSHRM', 'full_name' => 'Bachelor of Science in Hotel and Restaurant Management', 'department_code' => 'THMP'],
            ['name' => 'BSTM', 'full_name' => 'Bachelor of Science in Tourism Management', 'department_code' => 'THMP'],
            ['name' => 'HMDP', 'full_name' => 'Hotel and Restaurant Services Technology', 'department_code' => 'THMP'],
            ['name' => 'DHRST', 'full_name' => 'Diploma in Hotel and Restaurant Services Technology', 'department_code' => 'THMP'],

            // ENGINEERING & TECHNOLOGY PROGRAM (ETP)
            ['name' => 'BSCE', 'full_name' => 'Bachelor of Science in Civil Engineering', 'department_code' => 'ETP'],
            ['name' => 'BSIE', 'full_name' => 'Bachelor of Science in Industrial Engineering', 'department_code' => 'ETP'],
            ['name' => 'AT', 'full_name' => 'Automotive Technology', 'department_code' => 'ETP'],
            ['name' => 'ATC1', 'full_name' => 'Automotive Technology - Clustered (One Year)', 'department_code' => 'ETP'],
            ['name' => 'DT', 'full_name' => 'Drafting Technology', 'department_code' => 'ETP'],
            ['name' => 'DT1', 'full_name' => 'Drafting Technology - One Year', 'department_code' => 'ETP'],
            ['name' => 'MST', 'full_name' => 'Machine Shop Technology', 'department_code' => 'ETP'],
            ['name' => 'MNC1', 'full_name' => 'Machining NC II', 'department_code' => 'ETP'],
            ['name' => 'SMAW', 'full_name' => 'Shielded Metal Arc Welding NC II', 'department_code' => 'ETP'],
            ['name' => 'ETC', 'full_name' => 'Electronic Technician Course', 'department_code' => 'ETP'],

            // ARTS AND SCIENCES PROGRAM (ASP)
            ['name' => 'AB-C', 'full_name' => 'AB Communication (Bachelor of Arts - Major in Communication)', 'department_code' => 'ASP'],
            ['name' => 'AB-CA', 'full_name' => 'Bachelor of Arts - Major in Communication Arts', 'department_code' => 'ASP'],
            ['name' => 'AB-ECON', 'full_name' => 'Bachelor of Arts - Major in Economics', 'department_code' => 'ASP'],
            ['name' => 'AB-ELS', 'full_name' => 'Bachelor of Arts in English Language Studies', 'department_code' => 'ASP'],
            ['name' => 'AB-ENGLANG', 'full_name' => 'Bachelor of Arts - Major in English Language', 'department_code' => 'ASP'],
            ['name' => 'AB-FILLANG', 'full_name' => 'Bachelor of Arts - Filipino Language', 'department_code' => 'ASP'],
            ['name' => 'AB-GC', 'full_name' => 'Bachelor of Arts - Major in Guidance and Counseling', 'department_code' => 'ASP'],
            ['name' => 'AB-HISTORY', 'full_name' => 'Bachelor of Arts in History', 'department_code' => 'ASP'],
            ['name' => 'AB-MC', 'full_name' => 'Bachelor of Arts - Mass Communication', 'department_code' => 'ASP'],
            ['name' => 'AB-PS', 'full_name' => 'Bachelor of Arts - Major in Political Science', 'department_code' => 'ASP'],
            ['name' => 'BHUMSERV', 'full_name' => 'Bachelor in Human Services', 'department_code' => 'ASP'],
            ['name' => 'BLIS', 'full_name' => 'Bachelor of Library and Information Science', 'department_code' => 'ASP'],
            ['name' => 'BSBIO', 'full_name' => 'BSBIO (Bachelor of Science in Biology)', 'department_code' => 'ASP'],
            ['name' => 'BS BIO', 'full_name' => 'Bachelor of Science in Biology', 'department_code' => 'ASP'],
            ['name' => 'BS PSYCH', 'full_name' => 'Bachelor of Science in Psychology', 'department_code' => 'ASP'],
            ['name' => 'BSAM', 'full_name' => 'Bachelor of Science in Applied Mathematics', 'department_code' => 'ASP'],
            ['name' => 'BSF', 'full_name' => 'Batsilyer ng Sining sa Filipino', 'department_code' => 'ASP'],

            // CRIMINAL JUSTICE EDUCATION PROGRAM (CJEP)
            ['name' => 'BSCRIM', 'full_name' => 'Bachelor of Science in Criminology', 'department_code' => 'CJEP'],
            ['name' => 'BSISM', 'full_name' => 'Bachelor of Science in Industrial Security Management', 'department_code' => 'CJEP'],

            // Nursing Program (NP)
            ['name' => 'BSN', 'full_name' => 'Bachelor of Science in Nursing', 'department_code' => 'NP'],
        ];

        foreach ($courses as $courseData) {
            $department = $departments->get($courseData['department_code']);
            
            if ($department) {
                Course::updateOrCreate(
                    [
                        'name' => $courseData['name'],
                    ],
                    [
                        'name' => $courseData['name'],
                        'status' => 'Open',
                        'enrolled_count' => 0,
                        'department_id' => $department->id,
                    ]
                );
            } else {
                $this->command->warn("Department with code '{$courseData['department_code']}' not found for course '{$courseData['name']}'");
            }
        }

        $this->command->info('Courses seeded successfully!');
    }
}

