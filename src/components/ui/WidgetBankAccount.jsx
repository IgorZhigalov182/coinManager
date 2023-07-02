import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOperationList } from '../../store/operations/operations.slice';
import {
  favouritedBankAccountById,
  getActiveBankAccount,
  getBankAccountDisplayNameById,
  getBankAccountList,
} from '../../store/bankAccounts/bankAccounts.slice';
import bankAccountService, { getMostUsedBankAccount } from '../../services/bankAccount.services';

const WidgetBankAccount = () => {
  const dispatch = useDispatch();
  const operations = useSelector(getOperationList());
  let bankAccounts = useSelector(getBankAccountList());
  const activeBankAccountId = useSelector(getActiveBankAccount());
  const activeBankAccountName = useSelector(getBankAccountDisplayNameById(activeBankAccountId));
  const mostUsedBankAccountId = getMostUsedBankAccount(operations);

  console.log(mostUsedBankAccountId);

  const namesMostUsedBankAccount = mostUsedBankAccountId
    .map((bankAccount) => {
      let name = useSelector(getBankAccountDisplayNameById(bankAccount[0]));

      if (name != '') {
        return { name: name, id: bankAccount[0] };
      }
    })
    .filter((bankAccount) => bankAccount);

  const handleActiveBankAccount = async (bankAccountId) => {
    try {
      bankAccountService.resetFavouritesBankAccount(bankAccounts);
      bankAccountService.doBankAccountFavourite(bankAccountId, bankAccounts);
      dispatch(favouritedBankAccountById(bankAccountId));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="col-4 mt-2">
        <h5>Активный банковский аккаунт</h5>
        <div className="list-group" id="list-tab" role="tablist">
          {namesMostUsedBankAccount.map((bankAccount) => {
            return (
              <a
                key={bankAccount._id}
                className={
                  bankAccount.name === activeBankAccountName
                    ? 'list-group-item list-group-item-action active'
                    : 'list-group-item list-group-item-action'
                }
                id="list-home-list"
                data-bs-toggle="list"
                role="button"
                onClick={() => handleActiveBankAccount(bankAccount._id)}
                aria-controls="list-home">
                {bankAccount.name}
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default WidgetBankAccount;
