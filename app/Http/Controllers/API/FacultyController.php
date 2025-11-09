<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Faculty;

class FacultyController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $query = Faculty::query();
        
        // Faculty can only see their own record
        if ($user->role === 'faculty') {
            $query->where('email', $user->email);
        }
        
        // All authenticated users can view faculty list
        return response()->json($query->orderBy('created_at','desc')->get(), 200);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'age'        => 'nullable|integer|min:0|max:150',
            'gender'     => 'nullable|string|in:Male,Female',
            'email'      => 'nullable|email|max:255',
            'department_id' => 'nullable|integer|exists:departments,id',
            'course_id'     => 'nullable|integer|exists:courses,id',
        ]);

        // If faculty is creating their own profile, ensure email matches
        if ($user->role === 'faculty') {
            // Check if profile already exists
            $existingFaculty = Faculty::where('email', $user->email)->first();
            if ($existingFaculty) {
                return response()->json(['message' => 'Profile already exists. Please update your existing profile.'], 400);
            }
            
            // Force email to match user's email
            $validated['email'] = $user->email;
        } elseif ($user->role !== 'admin') {
            // Only admin and faculty (for their own profile) can create
            return response()->json(['message' => 'Unauthorized. Only admin can add faculty.'], 403);
        }

        $faculty = Faculty::create($validated);
        return response()->json($faculty, 201);
    }

    public function show($id)
    {
        $user = Auth::user();
        $faculty = Faculty::find($id);
        
        if (!$faculty) return response()->json(['message' => 'Not Found'], 404);
        
        // Faculty can only view their own record
        if ($user->role === 'faculty' && $faculty->email !== $user->email) {
            return response()->json(['message' => 'Unauthorized. You can only view your own profile.'], 403);
        }
        
        return response()->json($faculty, 200);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $faculty = Faculty::find($id);
        
        if (!$faculty) return response()->json(['message' => 'Not Found'], 404);

        // Faculty can only update their own record
        if ($user->role === 'faculty') {
            if ($faculty->email !== $user->email) {
                return response()->json(['message' => 'Unauthorized. You can only edit your own profile.'], 403);
            }
        } elseif ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Only admin can edit faculty.'], 403);
        }

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'age'        => 'nullable|integer|min:0|max:150',
            'gender'     => 'nullable|string|in:Male,Female',
            'email'      => 'nullable|email|max:255',
            'department_id' => 'nullable|integer|exists:departments,id',
            'course_id'     => 'nullable|integer|exists:courses,id',
        ]);

        $faculty->update($validated);
        return response()->json($faculty, 200);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        
        // Only admin can delete faculty
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Only admin can delete faculty.'], 403);
        }

        $faculty = Faculty::find($id);
        if (!$faculty) return response()->json(['message' => 'Not Found'], 404);
        $faculty->delete();
        return response()->json(null, 204);
    }
}
