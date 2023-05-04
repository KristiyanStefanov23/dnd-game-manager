import { useHistory } from 'react-router-dom';
import api from '../utils/api';

function LogoutButton() {
  const history = useHistory();

  const handleLogout = () => {
    api.logout()
      .then(() => {
        history.push('/login');
      })
      .catch((err) => {
        console.error('Error logging out', err);
      });
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}

export default LogoutButton;
