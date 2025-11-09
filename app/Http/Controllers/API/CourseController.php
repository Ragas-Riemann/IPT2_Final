<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Course;

class CourseController extends Controller
{
    public function index()
    {
        // All authenticated users can view courses
        return response()->json(Course::orderBy('created_at','desc')->get(), 200);
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
            'status' => 'nullable|string|max:50',
            'enrolled_count' => 'nullable|integer',
            'department_id' => 'nullable|integer|exists:departments,id',
        ]);
        $course = Course::create($validated);
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
            'status' => 'nullable|string|max:50',
            'enrolled_count' => 'nullable|integer',
            'department_id' => 'nullable|integer|exists:departments,id',
        ]);
        $course->update($validated);
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
