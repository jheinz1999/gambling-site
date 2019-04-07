export const UPDATE_USER = 'UPDATE_USER';
export const UPDATE_CASH = 'UPDATE_CASH';

export const updateUser = user => {

  return {

    type: UPDATE_USER,
    payload: user

  };

}

export const updateCash = cash => {

  return {

    type: UPDATE_CASH,
    payload: cash

  }

}
