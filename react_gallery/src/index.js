import React from 'react';
import ReactDOM from 'react-dom';
import ReactGalleryApp from './App';

ReactDOM.render(
  <ReactGalleryApp page='1' perPage='5' />,
  document.getElementById('react-gallery')
);
