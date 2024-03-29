import React from 'react';
import PropTypes from 'prop-types';
import CardBankAccount from '../cardBankAccount/CardBankAccount';
import style from './listBankAccount.module.scss';

const ListBankAccounts = ({ bankAccounts, setModalActive, toggleFavourite }) => {
  return (
    <div className={style.bankAccountWrapper}>
      {bankAccounts &&
        bankAccounts.map((bankData) => {
          return (
            <CardBankAccount
              toggleFavourite={toggleFavourite}
              key={bankData._id}
              setModalActive={setModalActive}
              {...bankData}
            />
          );
        })}
    </div>
  );
};

ListBankAccounts.propTypes = {
  bankAccounts: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  setModalActive: PropTypes.func,
  toggleFavourite: PropTypes.func
};

export default ListBankAccounts;
