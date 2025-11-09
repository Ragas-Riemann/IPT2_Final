<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\StudentController;
use App\Http\Controllers\API\FacultyController;
use App\Http\Controllers\API\DepartmentController;
use App\Http\Controllers\API\CourseController;

Route::apiResource('students', StudentController::class);
Route::apiResource('faculty', FacultyController::class);
Route::apiResource('departments', DepartmentController::class);
Route::apiResource('courses', CourseController::class);
