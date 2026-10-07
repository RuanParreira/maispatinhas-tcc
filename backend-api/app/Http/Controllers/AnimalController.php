<?php

namespace App\Http\Controllers;

use App\Http\Requests\Animal\StoreAnimalRequest;
use App\Models\Animal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AnimalController extends Controller
{
    /**
     * Listar apenas os animais cadastrados pelo usuário autenticado.
     */
    public function index(Request $request)
    {
        return $request->user()
            ->animals()
            ->latest()
            ->get();
    }

    /**
     * Cadastrar um novo animal vinculado ao usuário autenticado.
     */
    public function store(StoreAnimalRequest $request)
    {
        // O user_id é associado automaticamente via relacionamento

        $animal = $request->user()->animals()->create($request->validated());

        return response()->json($animal, 201);
    }

    /**
     * Exibir os dados de um animal específico (garantindo que seja dele).
     */
    public function show(Animal $animal)
    {
        Gate::authorize('view', $animal);

        return response()->json($animal);
    }
}
