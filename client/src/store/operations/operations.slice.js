import { createSlice } from '@reduxjs/toolkit';
import operationService from '../../services/operations.services';
import { timeStampToMonth } from '../../services/date.services';
import { toast } from 'react-toastify';

export const operationsSlice = createSlice({
  name: 'operations',
  initialState: {
    entities: null,
    isLoading: true,
    error: null,
    lastFetch: null,
    sort: null
  },

  reducers: {
    operationsRequested: (state) => {
      state.isLoading = true;
    },
    operationRequested: (state) => {
      state.isLoading = true;
    },
    operationsRecieved: (state, action) => {
      state.entities = action.payload;
      state.isLoading = false;
    },
    operationsRequestFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    operationRecieved: (state, action) => {
      state.entities = action.payload;
      state.isLoading = false;
    },
    operationCreated: (state, action) => {
      state.entities.push(action.payload);
    },
    operationUpdated: (state, action) => {
      const index = state.entities.findIndex((operation) => {
        return operation._id === action.payload._id;
      });

      state.entities[index] = action.payload;
    },
    operationSortedBySum: (state) => {
      if (!state.sort || state.sort === 'asc') {
        state.entities.sort((a, b) => {
          if (+a.sum < +b.sum) {
            return 1;
          } else {
            return -1;
          }
        });
        state.sort = 'desc';
      } else {
        state.entities.sort((a, b) => {
          if (+a.sum < +b.sum) {
            return -1;
          } else {
            return 1;
          }
        });
        state.sort = 'asc';
      }
    },
    operationSortedByDate: (state, action) => {
      if (!state.sortByDate || state.sortByDate === 'asc') {
        state.entities.sort((a, b) => {
          if (+a.date < +b.date) {
            return 1;
          } else {
            return -1;
          }
        });
        state.sortByDate = 'desc';
      } else {
        state.entities.sort((a, b) => {
          if (+a.date < +b.date) {
            return -1;
          } else {
            return 1;
          }
        });
        state.sortByDate = 'asc';
      }
    },
    operationDeleted: (state, action) => {
      state.entities = state.entities.filter((operation) => {
        return operation._id !== action.payload;
      });
    }
  }
});

const { reducer: operationReducer, actions } = operationsSlice;

const {
  operationsRequested,
  operationsRequestFailed,
  operationsRecieved,
  operationCreated,
  operationUpdated,
  operationDeleted,
  operationSortedBySum,
  operationSortedByDate
} = actions;

export const loadOperationList = (userId) => async (dispatch) => {
  dispatch(operationsRequested());

  try {
    const operations = await operationService.getOperations(userId);
    dispatch(operationsRecieved(operations));
  } catch (error) {
    localStorage.clear();
    // console.log(error);
    // dispatch(operationsRequestFailed(error.message));
  }
};

export const getOperationList = (type) => (state) => {
  if (!type) {
    return state.operations.entities;
  }

  if (state.operations.entities) {
    return state.operations.entities.filter(({ typeOperation }) => type === typeOperation);
  }
};

export const getCountOperation = () => (state) => {
  if (state.operations.entities) {
    return state.operations.entities.length;
  }
};

export const sortOperationsBySum = () => (dispatch) => dispatch(operationSortedBySum());

export const sortOperationsByDate = () => (dispatch) => dispatch(operationSortedByDate());

export const getCountOperations = (title) => (state) => {
  const typeOperation = title === 'Доходы' ? 'profit' : 'expense';
  let length = 0;
  if (state.operations.entities) {
    let arr = state?.operations?.entities.filter((operation) => {
      return operation.typeOperation === typeOperation;
    });
    length = arr.length;
  }
  return length;
};

export const getSumOperations = (title) => (state) => {
  const typeOperation = title === 'Доходы' || title === 'profit' ? 'profit' : 'expense';

  if (state.operations.entities) {
    let sum = [...state.operations.entities]
      .filter((operation) => {
        return operation.typeOperation === typeOperation;
      })
      .map((operation) => operation.sum)
      .reduce((prevVal, curVal) => prevVal + curVal, 0);

    return sum;
  }
};

export const getCountOperationByMounth = (title) => (state) => {
  const typeOperation = title === 'Доходы' ? 'profit' : 'expense';

  let resultArray = new Array(12).fill(0);

  if (state.operations.entities) {
    [...state.operations.entities]
      .filter((operation) => {
        return operation.typeOperation === typeOperation;
      })
      .map((operation) => {
        const index = timeStampToMonth(operation.date);
        resultArray[index - 1] += 1;
      });

    return resultArray;
  }
};

export const getSumOperationByMounth = (title) => (state) => {
  const typeOperation = title === 'Доходы' ? 'profit' : 'expense';

  let resultArray = new Array(12).fill(0);

  if (state.operations.entities) {
    [...state.operations.entities]
      .filter((operation) => {
        return operation.typeOperation === typeOperation;
      })
      .map((operation) => {
        const index = timeStampToMonth(operation.date);
        resultArray[index - 1] += operation.sum;
      });

    return resultArray;
  }
};

export const getOperationsLoadingStatus = () => (state) => state.operations.isLoading;

export const getOperationById = (id) => (state) => {
  if (state.operations.entities) {
    return state.operations.entities.find((o) => o._id == id);
  }
};

export const getOperationByPagination = (operationId, paginationSize) => (state) => {
  if (state.operations.entities && operationId) {
    const operationIndex =
      state.operations.entities.findIndex(({ _id }) => _id === operationId) / paginationSize;

    return Math.floor(operationIndex) + 1;
  }
  return 1;
};

export const createOperation = (data) => async (dispatch) => {
  try {
    const content = await operationService.createOperation(data);
    dispatch(operationCreated(content));
    toast(`Операция на сумму ${content.sum} была создана`);
  } catch (error) {
    toast(error.message);
    dispatch(operationsRequestFailed(error.message));
  }
};

export const updateOperationById = (data) => async (dispatch) => {
  try {
    await operationService.updateOperation(data);
    dispatch(operationUpdated(data));
  } catch (error) {
    dispatch(operationsRequestFailed(error.message));
  }
};

export const deleteOperationById = (id) => async (dispatch) => {
  try {
    await operationService.removeOperation(id);
    dispatch(operationDeleted(id));
  } catch (error) {
    toast(error.message);
    dispatch(operationsRequestFailed(error.message));
  }
};

export const filterTypeOperations = (type) => (state) => {
  if (type === 'Все') {
    return state.operations.entities;
  }

  if (state.operations.entities) {
    return state.operations.entities.filter((o) => o.typeOperation === type);
  }
};

export const countOperationsByCategory = (id) => (state) => {
  if (state.operations.entities) {
    return state.operations.entities.filter(({ category }) => category === id).length;
  }
};

// export const getTotalSum = () => (state) => {
//   if (state.operations.entities) {
//     return [...state.operations.entities].reduce((acc, cur) => acc + cur.sum, 0);
//   }
// };

export default operationReducer;
