window.ZAITPAY_CONFIG = {
  API_BASE_URL: window.location.hostname === 'localhost' ? 'http://localhost:3333' : 'https://api.zaitpay.com.br', // Certifique-se que seu backend está nesta porta
  ENDPOINTS: {
    login: '/auth/login',
    register: '/auth/register',
    clientes: '/users',
    extrato: '/accounts/statement',
    pix: '/pix/charges',
    boleto: '/boletos',
    paymentLink: '/payment-links',
    transfer: '/transfers/ted'
  }
};