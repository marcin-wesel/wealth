<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Właściciel',
            'email' => config('app.owner_email'),
            'password' => config('app.owner_password'),
            'email_verified_at' => now(),
        ]);

        $this->call(PositionSeeder::class);
    }
}
