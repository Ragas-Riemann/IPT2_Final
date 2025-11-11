<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Department;
use App\Models\Course;
use Illuminate\Support\Facades\Auth;

class ArchiveController extends Controller
{
    /**
     * Get all archived students
     */
    public function archivedStudents()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            
            // Only admin can view archived students
            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized. Only admin can view archived students.'], 403);
            }

            $archivedStudents = Student::onlyTrashed()
                ->orderBy('deleted_at', 'desc')
                ->get();

            return response()->json($archivedStudents, 200);
        } catch (\Exception $e) {
            \Log::error('Error fetching archived students: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching archived students: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get all archived faculty
     */
    public function archivedFaculty()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            
            // Only admin can view archived faculty
            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized. Only admin can view archived faculty.'], 403);
            }

            $archivedFaculty = Faculty::onlyTrashed()
                ->orderBy('deleted_at', 'desc')
                ->get();

            return response()->json($archivedFaculty, 200);
        } catch (\Exception $e) {
            \Log::error('Error fetching archived faculty: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching archived faculty: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Restore an archived student
     */
    public function restoreStudent($id)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            
            // Only admin can restore archived students
            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized. Only admin can restore archived students.'], 403);
            }

            $student = Student::onlyTrashed()->find($id);
            
            if (!$student) {
                return response()->json(['message' => 'Archived student not found.'], 404);
            }

            // Restore the student
            $student->restore();

            return response()->json(['message' => 'Student restored successfully', 'student' => $student], 200);
        } catch (\Exception $e) {
            \Log::error('Error restoring student: ' . $e->getMessage());
            return response()->json(['message' => 'Error restoring student: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Restore an archived faculty
     */
    public function restoreFaculty($id)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            
            // Only admin can restore archived faculty
            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized. Only admin can restore archived faculty.'], 403);
            }

            $faculty = Faculty::onlyTrashed()->find($id);
            
            if (!$faculty) {
                return response()->json(['message' => 'Archived faculty not found.'], 404);
            }

            // Restore the faculty
            $faculty->restore();

            return response()->json(['message' => 'Faculty restored successfully', 'faculty' => $faculty], 200);
        } catch (\Exception $e) {
            \Log::error('Error restoring faculty: ' . $e->getMessage());
            return response()->json(['message' => 'Error restoring faculty: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get all archived departments
     */
    public function archivedDepartments()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            
            // Only admin can view archived departments
            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized. Only admin can view archived departments.'], 403);
            }

            $archivedDepartments = Department::onlyTrashed()
                ->orderBy('deleted_at', 'desc')
                ->get();

            return response()->json($archivedDepartments, 200);
        } catch (\Exception $e) {
            \Log::error('Error fetching archived departments: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching archived departments: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get all archived courses
     */
    public function archivedCourses()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            
            // Only admin can view archived courses
            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized. Only admin can view archived courses.'], 403);
            }

            $archivedCourses = Course::onlyTrashed()
                ->with(['department' => function($query) {
                    $query->withTrashed(); // Include soft-deleted departments
                }])
                ->orderBy('deleted_at', 'desc')
                ->get();

            // Add department name to each course
            foreach ($archivedCourses as $course) {
                if ($course->department) {
                    $course->department_name = $course->department->name;
                } else {
                    $course->department_name = 'Unknown Department';
                }
            }

            return response()->json($archivedCourses, 200);
        } catch (\Exception $e) {
            \Log::error('Error fetching archived courses: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching archived courses: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Restore an archived department
     */
    public function restoreDepartment($id)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            
            // Only admin can restore archived departments
            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized. Only admin can restore archived departments.'], 403);
            }

            $department = Department::onlyTrashed()->find($id);
            
            if (!$department) {
                return response()->json(['message' => 'Archived department not found.'], 404);
            }

            // Restore the department
            $department->restore();

            return response()->json(['message' => 'Department restored successfully', 'department' => $department], 200);
        } catch (\Exception $e) {
            \Log::error('Error restoring department: ' . $e->getMessage());
            return response()->json(['message' => 'Error restoring department: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Restore an archived course
     */
    public function restoreCourse($id)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            
            // Only admin can restore archived courses
            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized. Only admin can restore archived courses.'], 403);
            }

            $course = Course::onlyTrashed()->find($id);
            
            if (!$course) {
                return response()->json(['message' => 'Archived course not found.'], 404);
            }

            // Restore the course
            $course->restore();

            return response()->json(['message' => 'Course restored successfully', 'course' => $course], 200);
        } catch (\Exception $e) {
            \Log::error('Error restoring course: ' . $e->getMessage());
            return response()->json(['message' => 'Error restoring course: ' . $e->getMessage()], 500);
        }
    }
}
