import { useContext } from 'react';
import { AuthContext } from '../context/AuthContextStore';

export const useAuth = () => useContext(AuthContext);
