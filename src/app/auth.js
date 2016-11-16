import AccountStore from './stores/AccountStore';
import CategoryStore from './stores/CategoryStore';
import ChangeStore from './stores/ChangeStore';
import CurrencyStore from './stores/CurrencyStore';
import TransactionStore from './stores/TransactionStore';
import UserStore from './stores/UserStore';

import axios from 'axios';

let isInit = false;

class Auth {

	loggedIn() {
		return localStorage.getItem('token') !== null;
	}

	initialize() {
		if (isInit) {
			return Promise.resolve();
		}

		return axios.all([
			AccountStore.initialize(),
			CurrencyStore.initialize(),
			CategoryStore.initialize(),
			UserStore.initialize(),
			ChangeStore.initialize(),
			TransactionStore.initialize(),
		]).then(() => {
			// Avoid multi initialization
			isInit = true;
		});
	}

	isInitialize() {
		return isInit;
	}

	logout() {
		return axios.all([
			AccountStore.reset(),
			CategoryStore.reset(),
			CurrencyStore.reset(),
			UserStore.reset(),
			TransactionStore.reset(),
		]).then(() => {
			localStorage.removeItem('token');
		});

	}

}

let AuthInstance = new Auth();

export default AuthInstance;
