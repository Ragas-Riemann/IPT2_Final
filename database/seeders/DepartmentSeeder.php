<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            [
                'name' => 'Teachers Education Program',
                'code' => 'TEP',
                'description' => 'Department for Education and Teaching programs',
            ],
            [
                'name' => 'Nursing Program',
                'code' => 'NP',
                'description' => 'Department for Nursing and Healthcare programs',
            ],
            [
                'name' => 'Computer Studies Program',
                'code' => 'CSP',
                'description' => 'Department for Game Development, Computer Science, and Information Technology programs',
            ],
            [
                'name' => 'Accountancy Program',
                'code' => 'AP',
                'description' => 'Department for Accountancy programs',
            ],
            [
                'name' => 'Business Administration Program',
                'code' => 'BAP',
                'description' => 'Department for Business and Management programs',
            ],
            [
                'name' => 'Tourism and Hospitality Management Program',
                'code' => 'THMP',
                'description' => 'Department for Tourism and Hospitality programs',
            ],
            [
                'name' => 'Engineering and Technology Program',
                'code' => 'ETP',
                'description' => 'Department for Engineering and Technology programs',
            ],
            [
                'name' => 'Arts and Sciences Program',
                'code' => 'ASP',
                'description' => 'Department for Arts and Sciences programs',
            ],
            [
                'name' => 'Criminal Justice Education Program',
                'code' => 'CJEP',
                'description' => 'Department for Criminal Justice Education programs',
            ],
        ];

        foreach ($departments as $department) {
            Department::updateOrCreate(
                ['code' => $department['code']],
                $department
            );
        }
    }
}
