interface DataPaginationProps {
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
}

export const DataPagination = ({
  currentPage,
  totalRecords,
  pageSize,
  onPageChange,
}: DataPaginationProps) => {
  const totalPages = Math.ceil(totalRecords / pageSize);

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const buildPageList = () => {
    const pagesToShow = new Set<number>();
    const subsequentWindow = 4;

    // 1. Tambahkan halaman Pertama
    pagesToShow.add(1);

    // 2. Tambahkan halaman Saat Ini
    pagesToShow.add(currentPage);

    // 3. Tambahkan 4 halaman Selanjutnya (atau kurang jika mentok)
    for (let i = 1; i <= subsequentWindow; i++) {
      const pageNum = currentPage + i;
      if (pageNum <= totalPages) {
        pagesToShow.add(pageNum);
      } else {
        break;
      }
    }

    // 4. Tambahkan halaman Terakhir
    pagesToShow.add(totalPages);

    // 5. Ubah Set menjadi array yang diurutkan
    const sortedPages = Array.from(pagesToShow).sort((a, b) => a - b);

    // 6. Sisipkan elipsis '...' jika ada celah
    const finalPageList: (number | string)[] = [];
    let lastPage = 0;
    for (const page of sortedPages) {
      if (lastPage !== 0 && page > lastPage + 1) {
        finalPageList.push("...");
      }
      finalPageList.push(page);
      lastPage = page;
    }

    return finalPageList;
  };

  // Jangan render apapun jika hanya ada 1 halaman
  if (totalPages <= 1) return null;
  const pageList = buildPageList();

  return (
    <nav className="group split">
      <button
        className="right-round square"
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        <i>keyboard_arrow_left</i>
      </button>

      {pageList.map((page, index) => {
        if (typeof page === "string") {
          return (
            <button key={`ellipsis-${index}`} className="left-round" disabled>
              <span>...</span>
            </button>
          );
        }

        return (
          <button
            key={page}
            className="left-round"
            onClick={() => onPageChange(page)}
            disabled={page === currentPage}
          >
            <span>{page}</span>
          </button>
        );
      })}

      <button
        className="right-round square"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        <i>keyboard_arrow_right</i>
      </button>
    </nav>
  );
};
