<?php

namespace App\Http\Controllers\MyAdoptions;

use App\Enums\AdoptionStatus;
use App\Enums\PostStatus;
use App\Http\Controllers\Controller;
use App\Models\Adoption;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

/**
 * Resposta do adotante ao "Doei": confirmar conclui a adoção e resolve o anúncio;
 * negar recusa a indicação e o doador pode indicar outra pessoa.
 */
class ConfirmationController extends Controller
{
    public function store(Adoption $adoption): Response
    {
        Gate::authorize('respond', $adoption);

        DB::transaction(function () use ($adoption) {
            $adoption = $this->lockPending($adoption);

            $adoption->status = AdoptionStatus::Completed;
            $adoption->completed_at = now();
            $adoption->save();

            $adoption->post->status = PostStatus::Resolved;
            $adoption->post->save();
        });

        return response()->noContent();
    }

    public function destroy(Adoption $adoption): Response
    {
        Gate::authorize('respond', $adoption);

        DB::transaction(function () use ($adoption) {
            $adoption = $this->lockPending($adoption);

            $adoption->status = AdoptionStatus::Refused;
            $adoption->save();
        });

        return response()->noContent();
    }

    /**
     * Relê com lock para que uma resposta não cruze com outra resposta ou com o
     * doador desfazendo a indicação ao mesmo tempo.
     */
    private function lockPending(Adoption $adoption): Adoption
    {
        $adoption = Adoption::lockForUpdate()->findOrFail($adoption->id);

        abort_unless($adoption->status === AdoptionStatus::InProgress, 409, 'Esta indicação já foi respondida ou desfeita.');

        return $adoption;
    }
}
