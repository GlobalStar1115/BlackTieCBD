class AccountsModal extends ModalDialog {
    constructor() {
      super();
      this.modalContent = this.querySelector('#Info-accounts');
      this.overlaySpinner = this.querySelector('.loading-overlay__spinner');
      if (localStorage.getItem('register_side_cart') == 'true' && window.location.pathname == '/') {
        this.show(document.querySelector('[data-modal="#accounts"] button'));
      }
      if (localStorage.getItem('login_side_cart') == 'true' && window.location.pathname == '/') {
        console.log(document.querySelector('[data-modal="#accounts"] button'));
        this.show(document.querySelector('[data-modal="#accounts"] button'));
        localStorage.setItem('login_side_cart', false);
      }
    }

    hide(preventFocus = false) {
      this.modalContent.innerHTML = '';
      if (preventFocus) this.openedBy = null;
      super.hide();
    }

    show(opener) {
      opener.setAttribute('aria-disabled', true);
      opener.classList.add('loading');
      this.overlaySpinner.classList.remove('hidden');
      super.show(opener);

      fetch(opener.getAttribute('data-href'))
        .then((response) => response.text())
        .then((responseText) => {
          const responseHTML = new DOMParser().parseFromString(responseText, 'text/html');
          this.productElement = responseHTML.querySelector('.page__fields--wrapper');
          this.setInnerHTML(this.modalContent, this.productElement.innerHTML);
        })
        .finally(() => {
          opener.removeAttribute('aria-disabled');
          opener.classList.remove('loading');
          this.overlaySpinner.classList.add('hidden');
          this.loginForm = this.querySelector('#customer_login');
          this.registerForm = this.querySelector('#create_customer');
          this.recoverForm = this.querySelector('[action="/account/recover"]');
          this.loginForm.addEventListener('submit', this.onSubmitHandlerLogin.bind(this));
          this.registerForm.addEventListener('submit', this.onSubmitHandlerRegister.bind(this));
          this.recoverForm.addEventListener('submit', this.onSubmitHandlerRecover.bind(this));
        });
    }

    setInnerHTML(element, html) {
      element.innerHTML = html;

      // Reinjects the script tags to allow execution. By default, scripts are disabled when using element.innerHTML.
      element.querySelectorAll('script').forEach(oldScriptTag => {
        const newScriptTag = document.createElement('script');
        Array.from(oldScriptTag.attributes).forEach(attribute => {
          newScriptTag.setAttribute(attribute.name, attribute.value)
        });
        newScriptTag.appendChild(document.createTextNode(oldScriptTag.innerHTML));
        oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
      });      
      if ( localStorage.getItem('register_side_cart') == 'true' ) {
        document.querySelector('[href="#create"]').click();
        localStorage.setItem('register_side_cart', false);
      }
    }
    
    onSubmitHandlerLogin(evt) {
      evt.preventDefault();
      evt.stopImmediatePropagation();
      var submitButton = this.loginForm.querySelector('button');
      if (submitButton.getAttribute('aria-disabled') === 'true') return;
      document.querySelector('.customer_login_error').innerHTML = '';

      submitButton.setAttribute('aria-disabled', true);
      submitButton.classList.add('loading');

      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];

      config.body = new FormData(this.loginForm);
      fetch( this.loginForm .getAttribute('action') , config)
      .then((response) => response.text())
      .then((responseText) => {
        const loginPage = new DOMParser().parseFromString(responseText, 'text/html');
      
        var customer_login_error = loginPage.querySelector('.customer_login_error');
        if( customer_login_error != null ){
          document.querySelector('.customer_login_error').innerHTML = customer_login_error.innerHTML;
          submitButton.setAttribute('aria-disabled', true);
          submitButton.classList.remove('hidden');
        }
        else{
          location.reload();
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        submitButton.classList.remove('loading');
        if (!this.error) submitButton.removeAttribute('aria-disabled');
      });
    }
    
    onSubmitHandlerRegister(evt) {
      evt.preventDefault();
      evt.stopImmediatePropagation();
      var submitButton = this.registerForm.querySelector('button');
      if (submitButton.getAttribute('aria-disabled') === 'true') return;
      document.querySelector('.customer_register_error').innerHTML = '';

      submitButton.setAttribute('aria-disabled', true);
      submitButton.classList.add('loading');

      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];

      config.body = new FormData(this.registerForm);
      fetch( this.registerForm .getAttribute('action') , config)
      .then((response) => response.text())
      .then((responseText) => {
        const loginPage = new DOMParser().parseFromString(responseText, 'text/html');
      
        var customer_register_error = loginPage.querySelector('.customer_register_error');
        if( customer_register_error != null ){
          document.querySelector('.customer_register_error').innerHTML = customer_register_error.innerHTML;
          submitButton.setAttribute('aria-disabled', true);
          submitButton.classList.remove('hidden');
        }
        else{
          location.reload();
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        submitButton.classList.remove('loading');
        if (!this.error) submitButton.removeAttribute('aria-disabled');
      });
    }
    
    onSubmitHandlerRecover(evt) {
      evt.preventDefault();
      evt.stopImmediatePropagation();
      var submitButton = this.recoverForm.querySelector('button');
      if (submitButton.getAttribute('aria-disabled') === 'true') return;
      document.querySelector('.customer_forget_error').innerHTML = '';

      submitButton.setAttribute('aria-disabled', true);
      submitButton.classList.add('loading');

      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];

      config.body = new FormData(this.recoverForm);
      fetch( this.recoverForm.getAttribute('action') , config)
      .then((response) => response.text())
      .then((response) => {
        try {
          response = JSON.parse(response);
          if ( response.status == 429 ) {
            document.querySelector('.customer_forget_error').innerHTML = response.message + ' ' + response.description ;
            return;
          }
        } 
        catch {
          const loginPage = new DOMParser().parseFromString(response, 'text/html');
        
          var recover_success = loginPage.querySelector('.recover_success');
          if( recover_success != null ){
            document.querySelector('.recover_success').innerHTML = recover_success.innerHTML;
            document.querySelector('[action="/account/recover"] [href="#cancel"]').click();
          }
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        submitButton.classList.remove('loading');
        if (!this.error) submitButton.removeAttribute('aria-disabled');
      });
    }
}
  
customElements.define('accounts-modal', AccountsModal);
  