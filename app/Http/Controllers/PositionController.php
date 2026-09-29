<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePositionRequest;
use App\Http\Requests\UpdatePositionRequest;
use App\Models\Position;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PositionController extends Controller
{
    /**
     * Display the list of positions and their total value.
     */
    public function index(): Response
    {
        $positions = Position::query()->orderByDesc('value')->get();

        return Inertia::render('positions/index', [
            'positions' => $positions,
            'total' => $positions->sum('value'),
        ]);
    }

    /**
     * Show the form for adding a new position.
     */
    public function create(): Response
    {
        return Inertia::render('positions/form');
    }

    /**
     * Store a newly created position.
     */
    public function store(StorePositionRequest $request): RedirectResponse
    {
        Position::create($request->validated());

        return to_route('positions.index');
    }

    /**
     * Show the form for editing an existing position.
     */
    public function edit(Position $position): Response
    {
        return Inertia::render('positions/form', [
            'position' => $position,
        ]);
    }

    /**
     * Update an existing position.
     */
    public function update(UpdatePositionRequest $request, Position $position): RedirectResponse
    {
        $position->update($request->validated());

        return to_route('positions.index');
    }

    /**
     * Permanently delete a position.
     */
    public function destroy(Position $position): RedirectResponse
    {
        $position->delete();

        return to_route('positions.index');
    }
}
