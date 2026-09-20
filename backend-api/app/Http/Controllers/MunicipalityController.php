<?php

namespace App\Http\Controllers;

use App\Models\Municipality;

class MunicipalityController extends Controller
{
    public function index()
    {
        return Municipality::select('ibge_code', 'name', 'state')
            ->orderBy('name')
            ->get();
    }
}
