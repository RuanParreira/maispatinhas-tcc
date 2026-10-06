import { useCallback, useEffect, useState } from "react";
import api from "@/api/axios";

// Lista paginada de um endpoint de Resource do Laravel (data + meta).
// Só busca quando enabled, para abas que carregam ao serem abertas.
export function usePaginatedList(url, enabled = true) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  const request = useCallback(
    (nextPage) =>
      api
        .get(url, { params: { page: nextPage } })
        .then(({ data }) => {
          setItems((current) =>
            nextPage === 1 ? data.data : [...current, ...data.data],
          );
          setPage(data.meta.current_page);
          setLastPage(data.meta.last_page);
        })
        .catch(() => setError(true))
        .finally(() => setLoadingMore(false)),
    [url],
  );

  const firstLoad = enabled && page === 0 && !error;

  useEffect(() => {
    if (firstLoad) request(1);
  }, [firstLoad, request]);

  function loadMore() {
    setError(false);
    setLoadingMore(true);
    request(page + 1);
  }

  return {
    items,
    error,
    loaded: page > 0,
    loading: firstLoad || loadingMore,
    hasMore: page < lastPage,
    loadMore,
    retry: page === 0 ? () => setError(false) : loadMore,
  };
}
