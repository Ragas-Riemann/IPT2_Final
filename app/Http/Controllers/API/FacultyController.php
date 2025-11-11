<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\Faculty;
use App\Models\User;

class FacultyController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Faculty::query();
        
        // Only show faculty that have user accounts (email exists in users table)
        $userEmails = User::where('role', 'faculty')->whereNotNull('email')->pluck('email')->toArray();
        if (!empty($userEmails)) {
            $query->whereNotNull('email')->whereIn('email', $userEmails);
        } else {
            // If no faculty users exist, return empty result
            $query->whereRaw('1 = 0');
        }
        
        // Faculty can only see their own record
        if ($user->role === 'faculty') {
            $query->where('email', $user->email);
        }
        
        // Filter by department if provided
        if ($request->has('department_id') && $request->department_id) {
            $query->where('department_id', $request->department_id);
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
            'email'      => 'required|email|max:255|unique:users,email',
            'date_of_birth' => 'nullable|date',
            'department_id' => 'nullable|integer|exists:departments,id',
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

        // Only admin can create faculty through this endpoint
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Only admin can add faculty.'], 403);
        }

        // Calculate age from date of birth if provided
        if (isset($validated['date_of_birth']) && $validated['date_of_birth']) {
            $birthDate = new \DateTime($validated['date_of_birth']);
            $today = new \DateTime();
            $validated['age'] = $today->diff($birthDate)->y;
        }

        // Use database transaction to ensure both user and faculty are created atomically
        try {
            return DB::transaction(function () use ($validated) {
                // Create user account first
                $fullName = trim($validated['first_name'] . ' ' . $validated['last_name']);
                
                $userAccount = User::create([
                    'name' => $fullName,
                    'email' => $validated['email'],
                    'password' => Hash::make('123456'),
                    'role' => 'faculty',
                ]);

                // Create faculty record
                $faculty = Faculty::create($validated);

                return response()->json([
                    'faculty' => $faculty,
                    'message' => 'Faculty added and account created successfully. Default password: 123456'
                ], 201);
            });
        } catch (\Illuminate\Database\QueryException $e) {
            // Handle database errors (e.g., duplicate email)
            if ($e->getCode() == 23000) { // Integrity constraint violation
                return response()->json(['message' => 'Email already exists. Please use a different email.'], 400);
            }
            return response()->json(['message' => 'Failed to create faculty account: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred: ' . $e->getMessage()], 500);
        }
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
            'date_of_birth' => 'nullable|date',
            'department_id' => 'nullable|integer|exists:departments,id',
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
                if ($faculty->profile_image && Storage::disk('public')->exists($faculty->profile_image)) {
                    Storage::disk('public')->delete($faculty->profile_image);
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
            if ($faculty->profile_image) {
                $validated['profile_image'] = $faculty->profile_image;
            }
            \Log::info('No new image uploaded, preserving existing: ' . ($faculty->profile_image ?? 'none'));
        }

        // Calculate age from date of birth if provided
        if (isset($validated['date_of_birth']) && $validated['date_of_birth']) {
            $birthDate = new \DateTime($validated['date_of_birth']);
            $today = new \DateTime();
            $validated['age'] = $today->diff($birthDate)->y;
        }

        $faculty->update($validated);
        return response()->json($faculty, 200);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        
        // Only admin can archive faculty
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Only admin can archive faculty.'], 403);
        }

        $faculty = Faculty::find($id);
        if (!$faculty) return response()->json(['message' => 'Not Found'], 404);
        $faculty->delete(); // Soft delete (archive)
        return response()->json(['message' => 'Faculty archived successfully'], 200);
    }
}
