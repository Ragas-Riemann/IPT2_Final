<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Course;
use App\Models\Student;
use App\Models\User;

class CourseController extends Controller
{
    /**
     * Calculate enrolled_count for a course based on students who have filled out their profile
     */
    private function calculateEnrolledCount($courseId)
    {
        $userEmails = User::where('role', 'student')->whereNotNull('email')->pluck('email')->toArray();
        
        if (empty($userEmails)) {
            return 0;
        }
        
        return Student::where('course_id', $courseId)
            ->whereNotNull('email')
            ->whereIn('email', $userEmails)
            ->count();
    }

    public function index()
    {
        // All authenticated users can view courses
        $query = Course::query();
        
        // Filter by department_id if provided
        if (request()->filled('department_id')) {
            $query->where('department_id', request('department_id'));
        }
        
        $courses = $query->orderBy('created_at','desc')->get();
        
        // Calculate actual enrolled_count for each course
        foreach ($courses as $course) {
            $course->enrolled_count = $this->calculateEnrolledCount($course->id);
        }
        
        return response()->json($courses, 200);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        
        // Only admin can create courses
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Only admin can add courses.'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string|max:50',
            'enrolled_count' => 'nullable|integer',
            'department_id' => 'nullable|integer|exists:departments,id',
        ]);
        // Remove enrolled_count from validated data as it's calculated automatically
        unset($validated['enrolled_count']);
        $course = Course::create($validated);
        // Calculate and set enrolled_count
        $course->enrolled_count = $this->calculateEnrolledCount($course->id);
        return response()->json($course, 201);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        
        // Only admin can update courses
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Only admin can edit courses.'], 403);
        }

        $course = Course::find($id);
        if (!$course) return response()->json(['message' => 'Not Found'], 404);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string|max:50',
            'enrolled_count' => 'nullable|integer',
            'department_id' => 'nullable|integer|exists:departments,id',
        ]);
        // Remove enrolled_count from validated data as it's calculated automatically
        unset($validated['enrolled_count']);
        $course->update($validated);
        // Calculate and set enrolled_count
        $course->enrolled_count = $this->calculateEnrolledCount($course->id);
        return response()->json($course, 200);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        
        // Only admin can delete courses
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Only admin can delete courses.'], 403);
        }

        $course = Course::find($id);
        if (!$course) return response()->json(['message' => 'Not Found'], 404);
        $course->delete();
        return response()->json(null, 204);
    }
}
