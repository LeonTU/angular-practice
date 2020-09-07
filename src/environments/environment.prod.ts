export const environment = {
  production: true,
  apiKey: 'AIzaSyCRCiJeAw0Jn3jrONTKwTy0E_1__S9bKo8',
  get signUpUrl() { return `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}` },
  get signInUrl() { return `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}` }
};
