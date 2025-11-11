<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Models\Student;
use App\Models\Faculty;

class AuthController extends Controller
{
    public function showLogin()
    {
        return view('auth.login');
    }

    public function showRegister()
    {
        return view('auth.register');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');
        $remember = $request->boolean('remember');

        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();
            $user = Auth::user();
            
            // Redirect based on role
            return redirect()->intended($this->getDashboardRoute($user->role));
        }

        throw ValidationException::withMessages([
            'email' => ['The provided credentials do not match our records.'],
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'nullable|date',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,faculty,student',
        ]);

        // Combine first name and last name for the user's name field
        $fullName = trim($request->first_name . ' ' . $request->last_name);

        // Calculate age from date of birth if provided
        $age = null;
        if ($request->date_of_birth) {
            $birthDate = new \DateTime($request->date_of_birth);
            $today = new \DateTime();
            $age = $today->diff($birthDate)->y;
        }

        $user = User::create([
            'name' => $fullName,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        // If role is student, create student record with date of birth and age
        if ($request->role === 'student') {
            Student::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'date_of_birth' => $request->date_of_birth ?? null,
                'age' => $age,
            ]);
        }

        // If role is faculty, create faculty record with date of birth and age
        if ($request->role === 'faculty') {
            Faculty::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'date_of_birth' => $request->date_of_birth ?? null,
                'age' => $age,
            ]);
        }

        Auth::login($user);

        return redirect($this->getDashboardRoute($user->role));
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }

    private function getDashboardRoute($role)
    {
        return match($role) {
            'admin' => '/dashboard/admin',
            'faculty' => '/dashboard/faculty',
            'student' => '/dashboard/student',
            default => '/dashboard',
        };
    }
}
