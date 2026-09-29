<?php

namespace Database\Seeders;

use App\Models\Position;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PositionSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $positions = [
            ['name' => 'Konto oszczędnościowe', 'value' => 100],
            ['name' => 'Inwestycje XTB', 'value' => 1500],
            ['name' => 'Dom', 'value' => 500000],
        ];

        foreach ($positions as $position) {
            Position::create($position);
        }
    }
}
