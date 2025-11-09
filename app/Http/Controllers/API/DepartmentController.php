<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Department;

class DepartmentController extends Controller
{
    public function index()
    {
        // All authenticated users can view departments
        return response()->json(Department::orderBy('created_at','desc')->get(), 200);
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

        $department = Department::create($validated);
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

        $department->update($validated);
        return response()->json($department, 200);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        
        // Only admin can delete departments
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Only admin can delete departments.'], 403);
        }

        $department = Department::find($id);
        if (!$department) return response()->json(['message' => 'Not Found'], 404);
        $department->delete();
        return response()->json(null, 204);
    }
}
