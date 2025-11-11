<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Department;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\User;

class DepartmentController extends Controller
{
    /**
     * Calculate students_count for a department based on students who have filled out their profile
     */
    private function calculateStudentsCount($departmentId)
    {
        $userEmails = User::where('role', 'student')->whereNotNull('email')->pluck('email')->toArray();
        
        if (empty($userEmails)) {
            return 0;
        }
        
        return Student::where('department_id', $departmentId)
            ->whereNotNull('email')
            ->whereIn('email', $userEmails)
            ->count();
    }

    /**
     * Calculate faculty_count for a department based on faculty who have filled out their profile
     */
    private function calculateFacultyCount($departmentId)
    {
        $userEmails = User::where('role', 'faculty')->whereNotNull('email')->pluck('email')->toArray();
        
        if (empty($userEmails)) {
            return 0;
        }
        
        return Faculty::where('department_id', $departmentId)
            ->whereNotNull('email')
            ->whereIn('email', $userEmails)
            ->count();
    }

    public function index()
    {
        // All authenticated users can view departments
        $departments = Department::orderBy('created_at','desc')->get();
        
        // Calculate actual students_count and faculty_count for each department
        foreach ($departments as $department) {
            $department->students_count = $this->calculateStudentsCount($department->id);
            $department->faculty_count = $this->calculateFacultyCount($department->id);
        }
        
        return response()->json($departments, 200);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        
        // Only admin can create departments
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Only admin can add departments.'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:10|unique:departments,code',
            'description' => 'nullable|string',
            'dean' => 'nullable|string|max:255',
            'students_count' => 'nullable|integer',
            'faculty_count' => 'nullable|integer',
        ]);
        
        // Remove students_count and faculty_count from validated data as they're calculated automatically
        unset($validated['students_count']);
        unset($validated['faculty_count']);
        
        $department = Department::create($validated);
        // Calculate and set counts
        $department->students_count = $this->calculateStudentsCount($department->id);
        $department->faculty_count = $this->calculateFacultyCount($department->id);
        return response()->json($department, 201);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        
        // Only admin can update departments
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Only admin can edit departments.'], 403);
        }

        $department = Department::find($id);
        if (!$department) return response()->json(['message' => 'Not Found'], 404);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:10|unique:departments,code,' . $id,
            'description' => 'nullable|string',
            'dean' => 'nullable|string|max:255',
            'students_count' => 'nullable|integer',
            'faculty_count' => 'nullable|integer',
        ]);
        
        // Remove students_count and faculty_count from validated data as they're calculated automatically
        unset($validated['students_count']);
        unset($validated['faculty_count']);

        $department->update($validated);
        // Calculate and set counts
        $department->students_count = $this->calculateStudentsCount($department->id);
        $department->faculty_count = $this->calculateFacultyCount($department->id);
        return response()->json($department, 200);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        
        // Only admin can archive departments
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Only admin can archive departments.'], 403);
        }

        $department = Department::find($id);
        if (!$department) return response()->json(['message' => 'Not Found'], 404);
        $department->delete();
        return response()->json(['message' => 'Department archived successfully'], 200);
    }
}
