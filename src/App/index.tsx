import React from 'react';
import { Provider } from 'react-redux';
import store from 'store';
import Main from 'views/Main';

const App = () => {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
};

export default App;
