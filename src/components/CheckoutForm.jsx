import React from 'react';
import './CheckoutForm.css';

const CheckoutForm = ({ customer, onChange }) => {
  return (
    <form className="checkout-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Nombre *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={customer.name}
            onChange={onChange}
            required
            placeholder="Tu nombre"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Apellido *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={customer.lastName}
            onChange={onChange}
            required
            placeholder="Tu apellido"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={customer.email}
          onChange={onChange}
          required
          placeholder="tucorreo@ejemplo.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Teléfono *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={customer.phone}
          onChange={onChange}
          required
          placeholder="11 1234-5678"
        />
      </div>

      <div className="form-group">
        <label htmlFor="address">Dirección *</label>
        <input
          type="text"
          id="address"
          name="address"
          value={customer.address}
          onChange={onChange}
          required
          placeholder="Calle y número"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">Ciudad *</label>
          <input
            type="text"
            id="city"
            name="city"
            value={customer.city}
            onChange={onChange}
            required
            placeholder="Ciudad"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="zipCode">Código Postal</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={customer.zipCode}
            onChange={onChange}
            placeholder="CP"
          />
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;