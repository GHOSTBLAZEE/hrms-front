import { useState } from 'react';

export function usePagination(initialPerPage = 15) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);

  const getPaginationParams = () => ({
    page,
    per_page: perPage,
  });

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setPage(1); // Reset to first page
  };

  const reset = () => {
    setPage(1);
    setPerPage(initialPerPage);
  };

  return {
    page,
    perPage,
    getPaginationParams,
    handlePageChange,
    handlePerPageChange,
    reset,
  };
}