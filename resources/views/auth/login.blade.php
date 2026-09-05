<x-layouts.guest>
    <div class="mx-auto mt-16 max-w-sm">
        <h1 class="text-2xl font-semibold">Entrar</h1>

        @if (session('status'))
            <p class="mt-4 text-sm text-green-600">{{ session('status') }}</p>
        @endif

        <form method="POST" action="{{ route('login.store') }}" class="mt-6 space-y-4">
            @csrf

            <div>
                <label for="email" class="block text-sm font-medium">E-mail</label>
                <input id="email" type="email" name="email" value="{{ old('email') }}" required autofocus
                    class="mt-1 block w-full rounded border-gray-300">
                @error('email')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <label for="password" class="block text-sm font-medium">Senha</label>
                <input id="password" type="password" name="password" required
                    class="mt-1 block w-full rounded border-gray-300">
                @error('password')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <div class="flex items-center">
                <input id="remember" type="checkbox" name="remember">
                <label for="remember" class="ml-2 text-sm">Lembrar-me</label>
            </div>

            <button type="submit" class="w-full rounded bg-gray-900 px-4 py-2 text-white">
                Entrar
            </button>
        </form>

        <p class="mt-4 text-sm">
            Não tem conta? <a href="{{ route('register') }}" class="underline">Cadastre-se</a>
        </p>
    </div>
</x-layouts.guest>
