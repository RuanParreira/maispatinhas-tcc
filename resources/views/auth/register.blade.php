<x-layouts.guest>
    <div class="mx-auto mt-16 max-w-sm">
        <h1 class="text-2xl font-semibold">Criar conta</h1>

        <form method="POST" action="{{ route('register.store') }}" class="mt-6 space-y-4">
            @csrf

            <div>
                <label for="name" class="block text-sm font-medium">Nome</label>
                <input id="name" type="text" name="name" value="{{ old('name') }}" required autofocus
                    class="mt-1 block w-full rounded border-gray-300">
                @error('name')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <label for="email" class="block text-sm font-medium">E-mail</label>
                <input id="email" type="email" name="email" value="{{ old('email') }}" required
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

            <div>
                <label for="password_confirmation" class="block text-sm font-medium">Confirmar senha</label>
                <input id="password_confirmation" type="password" name="password_confirmation" required
                    class="mt-1 block w-full rounded border-gray-300">
            </div>

            <button type="submit" class="w-full rounded bg-gray-900 px-4 py-2 text-white">
                Cadastrar
            </button>
        </form>

        <p class="mt-4 text-sm">
            Já tem conta? <a href="{{ route('login') }}" class="underline">Entrar</a>
        </p>
    </div>
</x-layouts.guest>
