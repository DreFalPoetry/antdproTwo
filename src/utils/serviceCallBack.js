export function callbackDeal(response) {
	if (response.code != null && response.code != undefined) {
		if (response.code == 0) {
			return 'successCallBack';
		} else if (response.code == 1) {
			// const { dispatch } = store;
			// sessionStorage.removeItem('loginUserInfo');
			// setAuthority('guest');
			// reloadAuthorized();
			// dispatch(routerRedux.push('/user/login'));
		} else {
			// notification.error({
			// 	message: 'Request an error',
			// 	description: response.info,
			// });
		}
	}
}