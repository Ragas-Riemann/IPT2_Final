<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;

class StudentController extends Controller
{
    public function index()
    {
        return response()->json(Student::orderBy('created_at','desc')->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
        ]);

        $student = Student::create($validated);

        return response()->json($student, 201);
    }

    public function show($id)
    {
        $student = Student::find($id);
        if (!$student) return response()->json(['message' => 'Not Found'], 404);
        return response()->json($student, 200);
    }

    public function update(Request $request, $id)
    {
        $student = Student::find($id);
        if (!$student) return response()->json(['message' => 'Not Found'], 404);

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
        ]);

        $student->update($validated);
        return response()->json($student, 200);
    }

    public function destroy($id)
    {
        $student = Student::find($id);
        if (!$student) return response()->json(['message' => 'Not Found'], 404);
        $student->delete();
        return response()->json(null, 204);
    }
}


