import React from 'react';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

const Loading: React.FC = () => {
  return <Loader type="Puff" color="#46D8D5" height={100} width={40} />;
};

export default Loading;
