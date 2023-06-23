import React, { useState, useRef } from 'react';
import Button from './common/Button';
import { nanoid } from '@reduxjs/toolkit';
import '../../styles/modal.css';
import ModalWindow from './ModalWindow';
import { addOperation } from '../../services/operations.services';
import { Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { createCategory, getCategories } from '../../store/categories/categories.slice';
import * as Yup from 'yup';
import { getActiveBankAccount } from '../../store/bankAccounts/bankAccounts.slice';
import categoryService from '../../services/category.services';
import { createOperation } from '../../store/operations/operations.slice';

const NewOperation = ({ typeOperationForModal, modalActive, setModalActive }) => {
  const actualBankAccount = useSelector(getActiveBankAccount());
  const dispatch = useDispatch();

  let operationData = {
    idBankAccount: '',
    comment: '',
    category: '',
    sum: '',
    addNewCategory: false,
    newCategory: '',
    typeOperation: typeOperationForModal || 'expense',
  };

  const [initialValue, setInitialValue] = useState(operationData);
  // const inputSum = React.createRef();

  // const [modalActive, setModalActive] = useState(false);
  const [operations, setOperations] = useState([]);
  const categories = useSelector(getCategories());

  // const handleChange = ({ target }) => {
  //   setData((prevState) => ({
  //     ...prevState,
  //     [target.name]: target.value,
  //   }));
  // };

  const handleSubmit = async (data) => {
    if (data.addNewCategory && data.newCategory) {
      const categoryData = {
        name: data.newCategory,
        id: nanoid(),
        color: 'rgba(255, 206, 86, 1)',
        icon: '',
        idUser: '',
      };
      dispatch(createCategory(categoryData));
      data.category = categoryData.id;
    }
    data.id = nanoid();
    data.date = Date.now();
    data.idBankAccount = actualBankAccount;
    // Добавить id user(а)

    dispatch(createOperation(data));
    setModalActive(false);
  };

  const operationSchema = Yup.object().shape({
    sum: Yup.string().required('Обязательное поле'),
    // category: Yup.string().required('Обязательное поле'),
    // email: Yup.string().email('Неверный email').required('Обязательное поле'),
  });

  // const handleModal = () => {
  //   // inputSum.current.focus();
  //   setModalActive(!modalActive);
  // };

  const validateNewCategory = (addNewCategory, nameNewCategory) => {
    if (addNewCategory && !nameNewCategory) {
      return 'Обязательное поле';
    }
  };

  const validateCategory = (addNewCategory, input) => {
    if (!addNewCategory && !input) {
      return 'Обязательное поле';
    }
  };

  return (
    <div>
      <ModalWindow active={modalActive} setActive={setModalActive}>
        <Formik
          onSubmit={async (values, actions) => {
            // alert(JSON.stringify(values, null, 2));
            handleSubmit(values);
            // setInitialValue(bankAccountData);
          }}
          validationSchema={operationSchema}
          initialValues={initialValue}
          enableReinitialize={true}>
          {({ errors, touched, handleChange, values }) => (
            <Form>
              <Field
                // innerRef={inputSum}
                type="number"
                name="sum"
                className="form-control"
                placeholder="Сумма"
              />
              {errors.sum && touched.sum ? <div>{errors.sum}</div> : null}
              {/* <span className="ms-1">Категория</span> */}
              {/* <Field className="form-select mb-2 mt-2" name="category"> */}
              {/* <div className="d-flex justify-content-between"> */}
              {!values.addNewCategory && (
                <Field
                  className="form-select mb-2 mt-2"
                  as="select"
                  name="category"
                  validate={() => validateCategory(values.addNewCategory, values.category)}>
                  {/* <select id="selectValue"> */}
                  <option disabled value="">
                    (Выберите категорию)
                  </option>
                  {categories &&
                    categories.map((category) => {
                      return (
                        <>
                          <option key={category.name} value={category.id}>
                            {category.name}
                          </option>
                        </>
                      );
                    })}
                  {/* </select> */}
                </Field>
              )}
              {/* <Button
                  title={'Удалить категорию '}
                  style={{
                    height: '2.3rem',
                    textAlign: 'center',
                    marginTop: '0.45rem',
                    marginLeft: '1rem',
                    width: '15rem',
                  }}
                  className={'btn btn-danger'}
                />
              </div> */}
              {errors.newCategory && touched.newCategory ? <div>{errors.newCategory}</div> : null}
              {errors.category && touched.category ? <div>{errors.category}</div> : null}
              <label className="ms-1 mb-2">
                Добавить новую категорию
                <Field
                  type="checkbox"
                  name="addNewCategory"
                  checked={values.addNewCategory}
                  onChange={handleChange}
                  className="form-check-input ms-2"
                />
              </label>
              {values.addNewCategory && (
                <Field
                  validate={() => validateNewCategory(values.addNewCategory, values.newCategory)}
                  name="newCategory"
                  type="text"
                  className="form-control mb-3"
                  placeholder="Новая категория">
                  {/* {({ field }) => (
                    <div>
                      <label htmlFor="newCategory">Input field:</label>
                      <input id="newCategory" {...field} />
                    </div>
                  )} */}
                </Field>
              )}

              <div>Тип операции</div>
              <div role="group" aria-labelledby="my-radio-group" className="mt-1">
                <div>
                  <Field
                    type="radio"
                    className="form-check-input"
                    name="typeOperation"
                    value="expense"
                  />
                  <span className="ms-2">Расходы</span>
                </div>
                <div>
                  <Field
                    type="radio"
                    className="form-check-input"
                    name="typeOperation"
                    value="profit"
                  />
                  <span className="ms-2">Доходы</span>
                </div>

                {errors.typeAccount && touched.typeAccount ? <div>{errors.typeAccount}</div> : null}
              </div>

              <Field
                as="textarea"
                className="form-control mt-3"
                placeholder="Комментарий"
                name="comment"
              />
              <div>
                <Button title="Добавить" type={'submit'} className={'btn btn-primary mt-3'} />
              </div>
            </Form>
          )}
        </Formik>
      </ModalWindow>
      {/* <Button
        handler={handleModal}
        title={'Добавить операцию'}
        className={'btn btn-primary mt-2'}
      /> */}
    </div>
  );
};

export default NewOperation;
