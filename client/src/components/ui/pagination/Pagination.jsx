import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import _, { set } from 'lodash';
import PropTypes from 'prop-types';
import Button from '../common/button/Button';
import styles from './Pagination.module.scss';
import { useLocation } from 'react-router-dom';
import { getOperationByPagination } from '../../../store/operations/operations.slice';

const Pagination = ({ itemsCount, pageSize, onPageChange, currentPage }) => {
  let [startIndexPagination, setStartIndexPagination] = useState(currentPage);
  const pageCount = Math.ceil(itemsCount / pageSize);
  if (pageCount <= 1) return null;
  let paginationWidth = 9;
  let { state } = useLocation();

  let backIndexOperation = useSelector(getOperationByPagination(state?.operationId, pageSize));

  useEffect(() => {
    setStartIndexPagination(
      backIndexOperation < paginationWidth
        ? backIndexOperation
        : backIndexOperation - paginationWidth + 1
    );
    onPageChange(backIndexOperation);
  }, []);

  if (document.documentElement.clientWidth < 992) {
    paginationWidth = 6;
  }

  if (document.documentElement.clientWidth < 576) {
    paginationWidth = 4;
  }

  let finishPage =
    startIndexPagination + paginationWidth > pageCount
      ? pageCount + 1
      : startIndexPagination + paginationWidth;

  const pages = _.range(startIndexPagination, finishPage);

  return (
    <nav>
      <ul className={styles.ulWrapper}>
        <li>
          {pages[0] >= 1 && pages[0] !== 1 && (
            <div className={styles.backBtnWrapper}>
              <Button
                spanStyle={styles.spanBtnCountPage}
                className={styles.btnCountPage}
                handler={() => {
                  setStartIndexPagination(() => (startIndexPagination = 1));
                  onPageChange((currentPage = 1));
                }}
                title={'<<'}
              />
              <Button
                spanStyle={styles.spanBtnCountPage}
                className={styles.btnCountPage}
                handler={() => {
                  setStartIndexPagination(() => startIndexPagination - 1);
                  onPageChange(currentPage - 1);
                }}
                title={'<'}
              />
            </div>
          )}
        </li>
        {pages &&
          pages.map((page) => (
            <li className={page === currentPage ? styles.activePage : ''} key={'page_' + page}>
              <Button
                spanStyle={page === currentPage ? styles.activePage : ''}
                className={styles.btnCountPage}
                handler={() => onPageChange(page)}
                title={page}
              />
            </li>
          ))}
        <li>
          {pages.at(-1) !== pageCount && (
            <div className={styles.forwardBtnWrapper}>
              <Button
                spanStyle={styles.spanBtnCountPage}
                className={styles.btnCountPage}
                handler={() => {
                  setStartIndexPagination(() => startIndexPagination + 1);
                  onPageChange(currentPage + 1);
                }}
                title={'>'}
              />
              <Button
                spanStyle={styles.spanBtnCountPage}
                className={styles.btnCountPage}
                handler={() => {
                  setStartIndexPagination(
                    () => (startIndexPagination = pageCount - paginationWidth + 1)
                  );
                  onPageChange((currentPage = pageCount));
                }}
                title={'>>'}
              />
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired
};

export default Pagination;
