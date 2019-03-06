export const UPDATE_USER = 'UPDATE_USER';

export const updateUser = user => {

  return {

    type: UPDATE_USER,
    payload: user

  };

}
