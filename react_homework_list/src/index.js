import React from 'react';
import ReactDOM from 'react-dom';
import HomeworkList from './App';

ReactDOM.render(
  <HomeworkList page='1' perPage='6' />,
  document.getElementById('react-homework-list')
);
