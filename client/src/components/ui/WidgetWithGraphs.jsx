import React, { useState } from 'react';
import Button from './common/Button';
import LineChart from './LineChart';
import PieChart from './PieChart';

const WidgetWithGraphs = () => {
  const [isProfitTypeOperation, setIsProfitTypeOperation] = useState(false);

  const handleChangeTypeOperation = (typeOperation) => {
    if (!isProfitTypeOperation && typeOperation === 'profit') {
      setIsProfitTypeOperation((prevState) => !prevState);
    } else if (isProfitTypeOperation && typeOperation === 'expense') {
      setIsProfitTypeOperation((prevState) => !prevState);
    }
  };

  return (
    <div className="container h-25 mt-3">
      <div className="card text-center">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <Button
                title={'Расходы'}
                handler={() => handleChangeTypeOperation('expense')}
                className={
                  isProfitTypeOperation ? 'btn ms-1 btn-secondary' : 'btn ms-1 btn-secondary active'
                }
              />
            </li>
            <li className="nav-item">
              <Button
                title={'Доходы'}
                handler={() => handleChangeTypeOperation('profit')}
                className={
                  isProfitTypeOperation
                    ? 'btn ms-3 mb-2 btn-secondary active'
                    : 'btn ms-3 mb-2 btn-secondary '
                }
              />
            </li>
          </ul>
        </div>
        {!isProfitTypeOperation && (
          <div className="d-flex">
            <PieChart
              typeOperation={'expense'}
              style={{ height: '10rem', width: '20rem', margin: '1rem', marginLeft: '2rem' }}
            />
            <LineChart
              title={'Расходы'}
              backgroundColor={'rgba(179, 20, 33, 1)'}
              borderColor={'rgba(133,65, 52, 1)'}
            />
          </div>
        )}

        {isProfitTypeOperation && (
          <div className="d-flex">
            <PieChart
              typeOperation={'profit'}
              style={{ height: '10rem', width: '20rem', margin: '1rem', marginLeft: '2rem' }}
            />
            <LineChart
              title={'Доходы'}
              backgroundColor={'rgba(69, 204, 101, 1)'}
              borderColor={'rgba(69, 190, 101, 1)'}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetWithGraphs;