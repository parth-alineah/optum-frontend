export const enum MAIN_PATH {
  AUTH = '/auth/*',
  DASHBOARD = '/*',
  UNAUTHORIZED = '/unauthorized',
}
export const enum COMMON_PATH {
  NOTFOUND = '*',
  DEFAULT = '/',
}

export const enum DASHBOARD_PATH {
  DASHBOARD = '/',
}

export const enum AUTH_PATH {
  LOGIN = '/login',
  LOGOUT = '/log-out',
  FORGET_PASSWORD = '/forget-password',
  RESET_PASSWORD = '/reset-password',
  SIGN_UP = '/sign-up',
}
