import {useContext} from 'react';
import {AlertContext} from '../contexts/AlertProvider';

const useAlert = () => useContext(AlertContext) ?? {alert: () => {}};

export default useAlert;
