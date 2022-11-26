import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './components/Main';
import ChangeNetwork from './components/ChangeNetwork';
function App() {
  ChangeNetwork('0x7b7');
  return (
    <div>
      <Main />
    </div>
  );
}

export default App;
