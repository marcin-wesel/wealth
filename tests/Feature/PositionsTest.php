<?php

use App\Models\Position;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('positions.index'));

    $response->assertRedirect(route('login'));
});

test('the home page shows positions and the correct total', function () {
    $user = User::factory()->create();

    Position::factory()->create(['name' => 'Konto oszczędnościowe', 'value' => 100]);
    Position::factory()->create(['name' => 'Dom', 'value' => 500000]);

    $response = $this->actingAs($user)->get(route('positions.index'));

    $response->assertInertia(fn (Assert $page) => $page
        ->component('positions/index')
        ->has('positions', 2)
    );

    expect((float) $response->inertiaProps('total'))->toBe(500100.0);
});

test('a position can be created', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('positions.store'), [
        'name' => 'Inwestycje XTB',
        'value' => '1500.50',
    ]);

    $response->assertRedirect(route('positions.index'));

    $this->assertDatabaseHas('positions', [
        'name' => 'Inwestycje XTB',
        'value' => '1500.50',
    ]);
});

test('a position can be edited', function () {
    $user = User::factory()->create();
    $position = Position::factory()->create(['name' => 'Stary', 'value' => 100]);

    $response = $this->actingAs($user)->put(route('positions.update', $position), [
        'name' => 'Nowy',
        'value' => '250.00',
    ]);

    $response->assertRedirect(route('positions.index'));

    expect($position->fresh())
        ->name->toBe('Nowy')
        ->value->toBe('250.00');
});

test('deleting a position removes it and reduces the total', function () {
    $user = User::factory()->create();
    $keep = Position::factory()->create(['value' => 100]);
    $remove = Position::factory()->create(['value' => 50]);

    $response = $this->actingAs($user)->delete(route('positions.destroy', $remove));

    $response->assertRedirect(route('positions.index'));

    $this->assertModelMissing($remove);
    $this->assertModelExists($keep);

    $total = (float) $this->actingAs($user)
        ->get(route('positions.index'))
        ->inertiaProps('total');

    expect($total)->toBe(100.0);
});

test('validation rejects an empty name, a negative value, and 3 decimal places, but accepts a comma decimal separator', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('positions.store'), ['name' => '', 'value' => '100'])
        ->assertSessionHasErrors('name');

    $this->actingAs($user)
        ->post(route('positions.store'), ['name' => 'Test', 'value' => '-1'])
        ->assertSessionHasErrors('value');

    $this->actingAs($user)
        ->post(route('positions.store'), ['name' => 'Test', 'value' => '10.123'])
        ->assertSessionHasErrors('value');

    $this->actingAs($user)
        ->post(route('positions.store'), ['name' => 'Test', 'value' => '1500,50'])
        ->assertSessionHasNoErrors();

    $this->assertDatabaseHas('positions', [
        'name' => 'Test',
        'value' => '1500.50',
    ]);
});

test('the registration route does not exist', function () {
    $this->get('/register')->assertNotFound();
});
