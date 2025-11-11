<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\API\StudentController;
use App\Http\Controllers\API\FacultyController;
use App\Http\Controllers\API\DepartmentController;
use App\Http\Controllers\API\CourseController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\ArchiveController;
use App\Http\Controllers\AuthController;

// Public routes
Route::get('/', function () {
    if (Auth::check()) {
        $user = Auth::user();
        return redirect(match($user->role) {
            'admin' => '/dashboard/admin',
            'faculty' => '/dashboard/faculty',
            'student' => '/dashboard/student',
            default => '/dashboard',
        });
    }
    return redirect('/login');
});

// Authentication routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login')->middleware('guest');
Route::post('/login', [AuthController::class, 'login'])->middleware('guest');
Route::get('/register', [AuthController::class, 'showRegister'])->name('register')->middleware('guest');
Route::post('/register', [AuthController::class, 'register'])->middleware('guest');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// Protected dashboard routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard/admin', function () {
        return view('dashboard', ['role' => 'admin']);
    })->name('dashboard.admin');
    
    Route::get('/dashboard/faculty', function () {
        return view('dashboard', ['role' => 'faculty']);
    })->name('dashboard.faculty');
    
    Route::get('/dashboard/student', function () {
        return view('dashboard', ['role' => 'student']);
    })->name('dashboard.student');
    
    Route::get('/dashboard', function () {
        $user = Auth::user();
        return redirect(match($user->role) {
            'admin' => '/dashboard/admin',
            'faculty' => '/dashboard/faculty',
            'student' => '/dashboard/student',
            default => '/login',
        });
    })->name('dashboard');
});

// API routes
Route::prefix('api')->middleware('auth')->group(function () {
    Route::get('/user', [UserController::class, 'index']);
    Route::apiResource('students', StudentController::class);
    Route::apiResource('faculty', FacultyController::class);
    Route::apiResource('departments', DepartmentController::class);
    Route::apiResource('courses', CourseController::class);
    
    // Archive routes
    Route::get('archive/students', [ArchiveController::class, 'archivedStudents']);
    Route::get('archive/faculty', [ArchiveController::class, 'archivedFaculty']);
    Route::post('archive/students/{id}/restore', [ArchiveController::class, 'restoreStudent']);
    Route::post('archive/faculty/{id}/restore', [ArchiveController::class, 'restoreFaculty']);
});
