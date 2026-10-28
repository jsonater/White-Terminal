(function () {
  'use strict';

  var form = document.getElementById('engagement-form');
  var serviceSelect = document.getElementById('service');
  var status = document.getElementById('form-status');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function goToForm(service) {
    if (service) {
      serviceSelect.value = service;
    }
    document.getElementById('contact-form').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    document.getElementById('name').focus({ preventScroll: true });
  }

  document.querySelectorAll('[data-scroll], .select-service').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      goToForm(el.getAttribute('data-service'));
    });
  });

  form.addEventListener('submit', function (e) {
    var action = form.getAttribute('action');
    // Block submission until a real Formspree endpoint is configured.
    if (action.indexOf('YOUR_FORM_ID') !== -1) {
      e.preventDefault();
      status.textContent = 'Form endpoint not configured: set the Formspree ID in index.html.';
      return;
    }
    e.preventDefault();
    status.textContent = 'Sending…';
    fetch(action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(function (res) {
      if (res.ok) {
        form.reset();
        status.textContent = 'Thank you. Your request was sent; we will reply by email.';
      } else {
        status.textContent = 'Submission failed. Please try again.';
      }
    }).catch(function () {
      status.textContent = 'Network error. Please try again.';
    });
  });
}());
