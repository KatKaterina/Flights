import ReactDom from 'react-dom';
import '../assets/application.scss';
import init from './init.jsx';

const render = async () => {
  const vdom = await init();
  ReactDom.render(vdom, document.getElementById('flights'));
};

render();