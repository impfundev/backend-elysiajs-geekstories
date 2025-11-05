import { useEffect, useState, type ChangeEvent } from "react";

interface DataSearchProps {
  onSearch: (search?: string | undefined) => void;
}

export const DataSearch = ({ onSearch }: DataSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(event.target.value);

  return (
    <div className="field fill round prefix small">
      <i>search</i>
      <input type="text" placeholder="Search" onChange={handleSearch} />
    </div>
  );
};
