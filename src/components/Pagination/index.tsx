import React, {
  useCallback,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import Select from 'react-select';

import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
} from 'react-icons/fa';

import { Container, PagesContainer, Page } from './styles';

const pageLimitToShow = [
  { value: 10, label: '10' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
];

interface PaginationProps {
  count: number;
  limit: number;
  pageRangeDisplayed: number;
  onChange: (limit: number, offset: number) => void;
}

export interface PaginationHandles {
  handleSetFirstPageRangeDisplayed: (page: number) => void;
  firstPageRangeDisplayed: number;
  handleSetCurrentPage: (page: number) => void;
  currentPage: number;
}

const Pagination: React.ForwardRefRenderFunction<
  PaginationHandles,
  PaginationProps
> = ({ count, limit, pageRangeDisplayed, onChange }, ref) => {
  const [firstPageRangeDisplayed, setFirstPageRangeDisplayed] = useState(0);
  const [pagesDisplayed, setPagesDisplayed] = useState<Array<Number>>([]);
  const [pages, setPages] = useState<Array<Number>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  const handleSetFirstPageRangeDisplayed = useCallback((page: number) => {
    setFirstPageRangeDisplayed(page);
  }, []);

  const handleSetCurrentPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  useImperativeHandle(ref, () => {
    return {
      handleSetFirstPageRangeDisplayed,
      firstPageRangeDisplayed,
      handleSetCurrentPage,
      currentPage,
    };
  });

  useEffect(() => {
    const totalPages = Math.ceil(count / limit);
    const arrayPages = Array.from({ length: totalPages }, (_, i) => i + 1);
    setPages(arrayPages);
    setPagesDisplayed(
      arrayPages.slice(
        firstPageRangeDisplayed,
        firstPageRangeDisplayed + pageRangeDisplayed,
      ),
    );
  }, [count, limit, firstPageRangeDisplayed, pageRangeDisplayed]);

  const handleSelectPageLimitToShow = useCallback(
    value => {
      onChange(value.value, 0);
    },
    [onChange],
  );

  const handleGotoPage = useCallback(
    page => {
      setCurrentPage(page);
      const offset = (page - 1) * limit;
      onChange(limit, offset);
    },
    [limit, onChange],
  );

  const handleFirstPage = useCallback(() => {
    setFirstPageRangeDisplayed(0);
    onChange(limit, 0);
    setCurrentPage(1);
    setIsLastPage(false);
  }, [limit, onChange]);

  const handlePrevious = useCallback(() => {
    const iniRange = firstPageRangeDisplayed - pageRangeDisplayed;
    setFirstPageRangeDisplayed(iniRange);

    const currentFirstPage = iniRange + 1;
    setCurrentPage(currentFirstPage);
    const offset = (currentFirstPage - 1) * limit;
    onChange(limit, offset);
    setIsLastPage(false);
  }, [firstPageRangeDisplayed, pageRangeDisplayed, limit, onChange]);

  const handleNext = useCallback(() => {
    if (
      pagesDisplayed[pagesDisplayed.length - 1] === pages.length ||
      currentPage === pages.length
    ) {
      setIsLastPage(true);
      return;
    }
    const iniRange = firstPageRangeDisplayed + pageRangeDisplayed;
    setFirstPageRangeDisplayed(iniRange);

    const currentFirstPage = iniRange + 1;
    setCurrentPage(currentFirstPage);
    const offset = (currentFirstPage - 1) * limit;
    onChange(limit, offset);
  }, [
    firstPageRangeDisplayed,
    pageRangeDisplayed,
    limit,
    currentPage,
    pagesDisplayed,
    pages.length,
    onChange,
  ]);

  const handleLastPage = useCallback(() => {
    if (
      pagesDisplayed[pagesDisplayed.length - 1] === pages.length ||
      currentPage === pages.length
    ) {
      setIsLastPage(true);
      return;
    }
    const iniRange = pages.length - pageRangeDisplayed + 1;
    setFirstPageRangeDisplayed(iniRange);
    setCurrentPage(pages.length);
    const offset = (pages.length - 1) * limit;
    onChange(limit, offset);
  }, [pageRangeDisplayed, pages, limit, currentPage, pagesDisplayed, onChange]);

  return (
    <Container>
      <div className="pageLimitToShow">
        <span>Mostrar</span>
        <div className="pageLimitToShowControl">
          <Select
            onChange={handleSelectPageLimitToShow}
            menuPlacement="auto"
            options={pageLimitToShow}
            defaultValue={pageLimitToShow[0]}
          />
        </div>
        <span>
          de
          {` ${count} `}
          registros
        </span>
      </div>
      <PagesContainer>
        <button
          disabled={!(currentPage > 1)}
          className="controlNavPage"
          type="button"
          title="Primeira"
          onClick={handleFirstPage}
        >
          <FaAngleDoubleLeft />
        </button>
        <button
          disabled={!(currentPage > pageRangeDisplayed)}
          className="controlNavPage"
          type="button"
          title="Anterior"
          onClick={handlePrevious}
        >
          <FaAngleLeft />
        </button>
        {pagesDisplayed.map(page => (
          <Page
            isSelected={page === currentPage}
            disabled={page === currentPage}
            key={page.toString()}
            type="button"
            onClick={() => handleGotoPage(page)}
          >
            {page}
          </Page>
        ))}
        <button
          disabled={isLastPage}
          className="controlNavPage"
          type="button"
          title="Próxima"
          onClick={handleNext}
        >
          <FaAngleRight />
        </button>
        <button
          disabled={isLastPage}
          className="controlNavPage"
          type="button"
          title="Última"
          onClick={handleLastPage}
        >
          <FaAngleDoubleRight />
        </button>
      </PagesContainer>
    </Container>
  );
};

export default forwardRef(Pagination);
