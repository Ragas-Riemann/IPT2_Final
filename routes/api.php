<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\StudentController;
use App\Http\Controllers\API\FacultyController;
use App\Http\Controllers\API\DepartmentController;
use App\Http\Controllers\API\CourseController;
use App\Http\Controllers\API\ArchiveController;

Route::apiResource('students', StudentController::class);
Route::apiResource('faculty', FacultyController::class);
Route::apiResource('departments', DepartmentController::class);
Route::apiResource('courses', CourseController::class);

// Archive routes
Route::get('archive/students', [ArchiveController::class, 'archivedStudents']);
Route::get('archive/faculty', [ArchiveController::class, 'archivedFaculty']);
