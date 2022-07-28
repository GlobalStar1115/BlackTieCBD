if (!customElements.get('product-form')) {
  customElements.define('product-form', class ProductForm extends HTMLElement {
    constructor() {
      super();

      this.form = this.querySelector('form');
      this.form.querySelector('[name=id]').disabled = false;
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
      this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
      this.cartItems = document.querySelector('cart-items') || document.querySelector('cart-items');
      this.submitButton = this.querySelector('[type="submit"]');
      if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');
    }

    onSubmitHandler(evt) {
      evt.preventDefault();
      if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

      this.handleErrorMessage();

      this.submitButton.setAttribute('aria-disabled', true);
      this.submitButton.classList.add('loading');
      this.querySelector('.loading-overlay__spinner').classList.remove('hidden');

      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];

      const formData = new FormData(this.form);
      if (this.cart) {
        //formData.append('sections', this.cart.getSectionsToRender().map((section) => section.id));
        formData.append('sections', this.cartItems.getSectionsToRender().map((section) => section.id));
        formData.append('sections_url', window.location.pathname);
        this.cart.setActiveElement(document.activeElement);
      }
      config.body = formData;

      fetch(`${routes.cart_add_url}`, config)
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            this.handleErrorMessage(response.description);

            const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
            if (!soldOutMessage) return;
            this.submitButton.setAttribute('aria-disabled', true);
            this.submitButton.querySelector('span').classList.add('hidden');
            soldOutMessage.classList.remove('hidden');
            this.error = true;
            return;
          } else if (!this.cart) {
            window.location = window.routes.cart_url;
            return;
          }

          this.error = false;
          const quickAddModal = this.closest('quick-add-modal');
          if (quickAddModal) {
            document.body.addEventListener('modalClosed', () => {
              setTimeout(() => { this.cart.renderContents(response) });
            }, { once: true });
            quickAddModal.hide(true);
          } else {
            this.cartItems.renderContents(response);
          }
          // Notification for mini cart
          document.querySelector('cart-items')?.onItemAdded();
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          this.submitButton.classList.remove('loading');
          if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
          if (!this.error) this.submitButton.removeAttribute('aria-disabled');
          this.querySelector('.loading-overlay__spinner').classList.add('hidden');
        });
    }

    handleErrorMessage(errorMessage = false) {
      this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
      if (!this.errorMessageWrapper) return;
      this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

      this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

      if (errorMessage) {
        this.errorMessage.textContent = errorMessage;
      }
    }
  });
}

var rcradioButtons = document.querySelectorAll('.recharge-radio');
var selling_plans = document.querySelectorAll('[name="selling_plan"]');

function rcradioButtonChange() {
    if( this.checked ){
        if( this.value == 'onetime' ){
            selling_plans.forEach((selling_plan) => {
                selling_plan.disabled = true;
            });
            var selectselling_plans = document.querySelectorAll('.select-selling_plans .sub-radio-cnt');
            selectselling_plans.forEach((selectselling_plan) => {
              selectselling_plan.style.display = 'none';
            });
            document.querySelector('.subscribe-btn').style.display = 'none';
            document.querySelector('.one-time-btn').style.display = 'block';
        }
        else{
            selling_plans.forEach((selling_plan) => {
                selling_plan.disabled = false;
            });
            var selectselling_plans = document.querySelectorAll('.select-selling_plans .sub-radio-cnt');
            selectselling_plans.forEach((selectselling_plan) => {
              selectselling_plan.style.display = 'block';
            });
            document.querySelector('.subscribe-btn').style.display = 'block';
            document.querySelector('.one-time-btn').style.display = 'none';
        }
    }
}

rcradioButtons.forEach((radioButton) => {
    radioButton.addEventListener( 'change', rcradioButtonChange);
});

if( document.querySelector('.recharge-radio:checked') != null ) {
    document.querySelector('.recharge-radio:checked').dispatchEvent( new Event('change') );
}
var selectsellingSelects = document.querySelectorAll('.select-selling_plans select');
selectsellingSelects.forEach((selectsellingSelect) => {
  selectsellingSelect.addEventListener( 'change', function(){
    var selectedOption = this.value;
    selectsellingSelects.forEach((selectsellingSelect) => {
      selectsellingSelect.value = selectedOption;
    });
  });
});