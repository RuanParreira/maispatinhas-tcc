<div class="flex justify-end p-4">
    <form method="POST" action="{{ route('logout') }}">
        @csrf
        <button type="submit" class="cursor-pointer rounded bg-gray-900 px-4 py-2 text-sm text-white">
            Sair
        </button>
    </form>
</div>
