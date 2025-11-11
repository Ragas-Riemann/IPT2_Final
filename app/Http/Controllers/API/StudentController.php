<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\Student;
use App\Models\User;

class StudentController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $query = Student::query();
        
        // Only show students that have user accounts (email exists in users table)
        $userEmails = User::where('role', 'student')->whereNotNull('email')->pluck('email')->toArray();
        if (!empty($userEmails)) {
            $query->whereNotNull('email')->whereIn('email', $userEmails);
        } else {
            // If no student users exist, return empty result
            $query->whereRaw('1 = 0');
        }
        
        // Students can only see their own record
        if ($user->role === 'student') {
            $query->where('email', $user->email);
        }
        
        if (request()->filled('department_id')) {
            $query->where('department_id', request('department_id'));
        }
        if (request()->filled('course_id')) {
            $query->where('course_id', request('course_id'));
        }
        return response()->json($query->orderBy('created_at','desc')->get(), 200);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'age'        => 'nullable|integer|min:0|max:150',
            'gender'     => 'nullable|string|in:Male,Female',
            'email'      => 'required|email|max:255|unique:users,email',
            'department_id' => 'nullable|integer|exists:departments,id',
            'course_id'     => 'nullable|integer|exists:courses,id',
            'date_of_birth' => 'nullable|date',
            'place_of_birth' => 'nullable|string|max:255',
            'blood_type' => 'nullable|string|in:A+,A-,B+,B-,AB+,AB-,O+,O-,Unknown',
            'height' => 'nullable|string|max:50',
            'civil_status' => 'nullable|string|in:Single,Married,Divorced,Widowed',
            'house_street_barangay' => 'nullable|string',
            'region' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'municipality' => 'nullable|string|max:255',
            'religion' => 'nullable|string|max:255',
            'citizenship' => 'nullable|string|max:255',
            'contact_number_phone' => 'nullable|string|max:50',
            'mobile_number' => 'nullable|string|max:50',
            'language_spoken' => 'nullable|string|max:255',
            // Educational background fields
            'elementary_school_name' => 'nullable|string|max:255',
            'elementary_school_address' => 'nullable|string',
            'elementary_year_graduated' => 'nullable|string|max:10',
            'elementary_school_type' => 'nullable|string|in:Private,Public',
            'junior_high_school_name' => 'nullable|string|max:255',
            'junior_high_school_address' => 'nullable|string',
            'junior_high_year_graduated' => 'nullable|string|max:10',
            'junior_high_school_type' => 'nullable|string|in:Private,Public',
            'senior_high_school_name' => 'nullable|string|max:255',
            'senior_high_school_address' => 'nullable|string',
            'senior_high_year_graduated' => 'nullable|string|max:10',
            'senior_high_school_type' => 'nullable|string|in:Private,Public',
            'college_school_name' => 'nullable|string|max:255',
            'college_school_address' => 'nullable|string',
            'college_year_graduated' => 'nullable|string|max:10',
            'college_school_type' => 'nullable|string|in:Private,Public',
            // Family background
            'mother_family_name' => 'nullable|string|max:255',
            'mother_given_name' => 'nullable|string|max:255',
            'mother_middle_name' => 'nullable|string|max:255',
            'mother_occupation' => 'nullable|string|max:255',
            'mother_home_address' => 'nullable|string',
            'mother_town_city' => 'nullable|string|max:255',
            'mother_province' => 'nullable|string|max:255',
            'mother_contact_number' => 'nullable|string|max:50',
            'mother_mobile_number' => 'nullable|string|max:50',
            'father_family_name' => 'nullable|string|max:255',
            'father_given_name' => 'nullable|string|max:255',
            'father_middle_name' => 'nullable|string|max:255',
            'father_occupation' => 'nullable|string|max:255',
            'father_home_address' => 'nullable|string',
            'father_town_city' => 'nullable|string|max:255',
            'father_province' => 'nullable|string|max:255',
            'father_contact_number' => 'nullable|string|max:50',
            'father_mobile_number' => 'nullable|string|max:50',
            'number_of_brothers' => 'nullable|integer|min:0',
            'number_of_sisters' => 'nullable|integer|min:0',
            // Guardian
            'guardian_family_name' => 'nullable|string|max:255',
            'guardian_given_name' => 'nullable|string|max:255',
            'guardian_middle_name' => 'nullable|string|max:255',
            'guardian_relationship' => 'nullable|string|max:255',
            'guardian_home_address' => 'nullable|string',
            'guardian_contact_number' => 'nullable|string|max:50',
            'guardian_mobile_number' => 'nullable|string|max:50',
            // Emergency contact
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_number' => 'nullable|string|max:50',
            // Insurance
            'study_sponsor' => 'nullable|string|max:255',
            'monthly_income' => 'nullable|string|max:255',
            'insurance_beneficiary_family_name' => 'nullable|string|max:255',
            'insurance_beneficiary_given_name' => 'nullable|string|max:255',
            'insurance_beneficiary_middle_name' => 'nullable|string|max:255',
            'insurance_beneficiary_date_of_birth' => 'nullable|date',
            // Academic profile
            'intended_degree_program' => 'nullable|string|max:255',
            'is_working_student' => 'nullable|boolean',
            'employer_name' => 'nullable|string|max:255',
            'employer_address' => 'nullable|string',
            'previous_schools_attended' => 'nullable|string',
            'applied_to_fsuu_before' => 'nullable|boolean',
            'fsuu_application_year' => 'nullable|string|max:10',
            'fsuu_was_accepted' => 'nullable|boolean',
            'fsuu_did_attend' => 'nullable|boolean',
            'fsuu_year_attended' => 'nullable|string|max:10',
            // Additional info
            'is_indigenous_peoples_member' => 'nullable|boolean',
            'indigenous_tribe' => 'nullable|string|max:255',
            'has_disability' => 'nullable|boolean',
            'disability_specification' => 'nullable|string|max:255',
            'is_single_parent_dependent' => 'nullable|boolean',
            'has_special_needs' => 'nullable|boolean',
            'special_needs_specification' => 'nullable|string|max:255',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle image upload
        \Log::info('Store - Checking for profile_image file. hasFile: ' . ($request->hasFile('profile_image') ? 'true' : 'false'));
        \Log::info('Store - Request all files: ' . json_encode($request->allFiles()));
        
        if ($request->hasFile('profile_image')) {
            try {
                $image = $request->file('profile_image');
                \Log::info('Store - Image file received: ' . $image->getClientOriginalName() . ', Size: ' . $image->getSize());
                
                $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('profile_images', $imageName, 'public');
                \Log::info('Store - Image saved to: ' . $imagePath);
                $validated['profile_image'] = $imagePath;
            } catch (\Exception $e) {
                \Log::error('Store - Image upload error: ' . $e->getMessage());
                return response()->json(['message' => 'Failed to upload image: ' . $e->getMessage()], 500);
            }
        }

        // Convert string booleans to actual booleans for FormData
        $booleanFields = [
            'is_working_student', 'applied_to_fsuu_before', 'fsuu_was_accepted',
            'fsuu_did_attend', 'is_indigenous_peoples_member', 'has_disability',
            'is_single_parent_dependent', 'has_special_needs'
        ];
        foreach ($booleanFields as $field) {
            if (isset($validated[$field])) {
                $validated[$field] = filter_var($validated[$field], FILTER_VALIDATE_BOOLEAN);
            }
        }

        // Only admin can create students through this endpoint
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Only admin can add students.'], 403);
        }

        // Calculate age from date of birth if provided
        if (isset($validated['date_of_birth']) && $validated['date_of_birth']) {
            $birthDate = new \DateTime($validated['date_of_birth']);
            $today = new \DateTime();
            $validated['age'] = $today->diff($birthDate)->y;
        }

        // Use database transaction to ensure both user and student are created atomically
        try {
            return DB::transaction(function () use ($validated) {
                // Create user account first
                $fullName = trim($validated['first_name'] . ' ' . ($validated['middle_name'] ?? '') . ' ' . $validated['last_name']);
                $fullName = preg_replace('/\s+/', ' ', $fullName); // Remove extra spaces
                
                $userAccount = User::create([
                    'name' => $fullName,
                    'email' => $validated['email'],
                    'password' => Hash::make('123456'),
                    'role' => 'student',
                ]);

                // Create student record
                $student = Student::create($validated);

                return response()->json([
                    'student' => $student,
                    'message' => 'Student added and account created successfully. Default password: 123456'
                ], 201);
            });
        } catch (\Illuminate\Database\QueryException $e) {
            // Handle database errors (e.g., duplicate email)
            if ($e->getCode() == 23000) { // Integrity constraint violation
                return response()->json(['message' => 'Email already exists. Please use a different email.'], 400);
            }
            return response()->json(['message' => 'Failed to create student account: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $user = Auth::user();
        $student = Student::find($id);
        
        if (!$student) return response()->json(['message' => 'Not Found'], 404);
        
        // Students can only view their own record
        if ($user->role === 'student' && $student->email !== $user->email) {
            return response()->json(['message' => 'Unauthorized. You can only view your own profile.'], 403);
        }
        
        return response()->json($student, 200);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $student = Student::find($id);
        
        if (!$student) return response()->json(['message' => 'Not Found'], 404);

        // Students can only update their own record, admin can update any
        if ($user->role === 'student') {
            if ($student->email !== $user->email) {
                return response()->json(['message' => 'Unauthorized. You can only edit your own profile.'], 403);
            }
        } elseif ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Only admin can edit student information.'], 403);
        }

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'age'        => 'nullable|integer|min:0|max:150',
            'gender'     => 'nullable|string|in:Male,Female',
            'email'      => 'nullable|email|max:255',
            'department_id' => 'nullable|integer|exists:departments,id',
            'course_id'     => 'nullable|integer|exists:courses,id',
            'date_of_birth' => 'nullable|date',
            'place_of_birth' => 'nullable|string|max:255',
            'blood_type' => 'nullable|string|in:A+,A-,B+,B-,AB+,AB-,O+,O-,Unknown',
            'height' => 'nullable|string|max:50',
            'civil_status' => 'nullable|string|in:Single,Married,Divorced,Widowed',
            'house_street_barangay' => 'nullable|string',
            'region' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'municipality' => 'nullable|string|max:255',
            'religion' => 'nullable|string|max:255',
            'citizenship' => 'nullable|string|max:255',
            'contact_number_phone' => 'nullable|string|max:50',
            'mobile_number' => 'nullable|string|max:50',
            'language_spoken' => 'nullable|string|max:255',
            // Educational background fields
            'elementary_school_name' => 'nullable|string|max:255',
            'elementary_school_address' => 'nullable|string',
            'elementary_year_graduated' => 'nullable|string|max:10',
            'elementary_school_type' => 'nullable|string|in:Private,Public',
            'junior_high_school_name' => 'nullable|string|max:255',
            'junior_high_school_address' => 'nullable|string',
            'junior_high_year_graduated' => 'nullable|string|max:10',
            'junior_high_school_type' => 'nullable|string|in:Private,Public',
            'senior_high_school_name' => 'nullable|string|max:255',
            'senior_high_school_address' => 'nullable|string',
            'senior_high_year_graduated' => 'nullable|string|max:10',
            'senior_high_school_type' => 'nullable|string|in:Private,Public',
            'college_school_name' => 'nullable|string|max:255',
            'college_school_address' => 'nullable|string',
            'college_year_graduated' => 'nullable|string|max:10',
            'college_school_type' => 'nullable|string|in:Private,Public',
            // Family background
            'mother_family_name' => 'nullable|string|max:255',
            'mother_given_name' => 'nullable|string|max:255',
            'mother_middle_name' => 'nullable|string|max:255',
            'mother_occupation' => 'nullable|string|max:255',
            'mother_home_address' => 'nullable|string',
            'mother_town_city' => 'nullable|string|max:255',
            'mother_province' => 'nullable|string|max:255',
            'mother_contact_number' => 'nullable|string|max:50',
            'mother_mobile_number' => 'nullable|string|max:50',
            'father_family_name' => 'nullable|string|max:255',
            'father_given_name' => 'nullable|string|max:255',
            'father_middle_name' => 'nullable|string|max:255',
            'father_occupation' => 'nullable|string|max:255',
            'father_home_address' => 'nullable|string',
            'father_town_city' => 'nullable|string|max:255',
            'father_province' => 'nullable|string|max:255',
            'father_contact_number' => 'nullable|string|max:50',
            'father_mobile_number' => 'nullable|string|max:50',
            'number_of_brothers' => 'nullable|integer|min:0',
            'number_of_sisters' => 'nullable|integer|min:0',
            // Guardian
            'guardian_family_name' => 'nullable|string|max:255',
            'guardian_given_name' => 'nullable|string|max:255',
            'guardian_middle_name' => 'nullable|string|max:255',
            'guardian_relationship' => 'nullable|string|max:255',
            'guardian_home_address' => 'nullable|string',
            'guardian_contact_number' => 'nullable|string|max:50',
            'guardian_mobile_number' => 'nullable|string|max:50',
            // Emergency contact
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_number' => 'nullable|string|max:50',
            // Insurance
            'study_sponsor' => 'nullable|string|max:255',
            'monthly_income' => 'nullable|string|max:255',
            'insurance_beneficiary_family_name' => 'nullable|string|max:255',
            'insurance_beneficiary_given_name' => 'nullable|string|max:255',
            'insurance_beneficiary_middle_name' => 'nullable|string|max:255',
            'insurance_beneficiary_date_of_birth' => 'nullable|date',
            // Academic profile
            'intended_degree_program' => 'nullable|string|max:255',
            'is_working_student' => 'nullable|boolean',
            'employer_name' => 'nullable|string|max:255',
            'employer_address' => 'nullable|string',
            'previous_schools_attended' => 'nullable|string',
            'applied_to_fsuu_before' => 'nullable|boolean',
            'fsuu_application_year' => 'nullable|string|max:10',
            'fsuu_was_accepted' => 'nullable|boolean',
            'fsuu_did_attend' => 'nullable|boolean',
            'fsuu_year_attended' => 'nullable|string|max:10',
            // Additional info
            'is_indigenous_peoples_member' => 'nullable|boolean',
            'indigenous_tribe' => 'nullable|string|max:255',
            'has_disability' => 'nullable|boolean',
            'disability_specification' => 'nullable|string|max:255',
            'is_single_parent_dependent' => 'nullable|boolean',
            'has_special_needs' => 'nullable|boolean',
            'special_needs_specification' => 'nullable|string|max:255',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle image upload
        \Log::info('Checking for profile_image file. hasFile: ' . ($request->hasFile('profile_image') ? 'true' : 'false'));
        \Log::info('Request all files: ' . json_encode($request->allFiles()));
        
        if ($request->hasFile('profile_image')) {
            try {
                $image = $request->file('profile_image');
                \Log::info('Image file received: ' . $image->getClientOriginalName() . ', Size: ' . $image->getSize());
                
                // Delete old image if exists
                if ($student->profile_image && Storage::disk('public')->exists($student->profile_image)) {
                    Storage::disk('public')->delete($student->profile_image);
                }
                
                $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('profile_images', $imageName, 'public');
                \Log::info('Image saved to: ' . $imagePath);
                $validated['profile_image'] = $imagePath;
            } catch (\Exception $e) {
                \Log::error('Image upload error: ' . $e->getMessage());
                \Log::error('Stack trace: ' . $e->getTraceAsString());
                return response()->json(['message' => 'Failed to upload image: ' . $e->getMessage()], 500);
            }
        } else {
            // Preserve existing image if no new image is uploaded
            if ($student->profile_image) {
                $validated['profile_image'] = $student->profile_image;
            }
            \Log::info('No new image uploaded, preserving existing: ' . ($student->profile_image ?? 'none'));
        }

        // Calculate age from date of birth if provided
        if (isset($validated['date_of_birth']) && $validated['date_of_birth']) {
            $birthDate = new \DateTime($validated['date_of_birth']);
            $today = new \DateTime();
            $validated['age'] = $today->diff($birthDate)->y;
        }

        // Convert string booleans to actual booleans for FormData
        $booleanFields = [
            'is_working_student', 'applied_to_fsuu_before', 'fsuu_was_accepted',
            'fsuu_did_attend', 'is_indigenous_peoples_member', 'has_disability',
            'is_single_parent_dependent', 'has_special_needs'
        ];
        foreach ($booleanFields as $field) {
            if (isset($validated[$field])) {
                $validated[$field] = filter_var($validated[$field], FILTER_VALIDATE_BOOLEAN);
            }
        }

        $student->update($validated);
        return response()->json($student, 200);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        
        // Only admin can archive students
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Only admin can archive students.'], 403);
        }

        $student = Student::find($id);
        if (!$student) return response()->json(['message' => 'Not Found'], 404);
        $student->delete(); // Soft delete (archive)
        return response()->json(['message' => 'Student archived successfully'], 200);
    }
}


