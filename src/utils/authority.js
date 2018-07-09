// use sessionStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  return sessionStorage.getItem('userRole') ||'guest';
}

export function setAuthority(authority) {
  return sessionStorage.setItem('userRole', authority);
}
