import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { Field, FieldArray } from 'redux-form';

import CoralField from '../components/coralField';
import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';
import MultipleItemEditor from './components/multipleItemEditor';

const renderItem = (field) => (
  <div data-row className="u-inlineBlock">
    <label className="u-gapRight">
      <span className="u-label">Subdomain</span>
      <CoralField
        name={ `${field}.value` }
        component={ Textfield }
        supportValidation
      />
    </label>
    <Field
      name={ `${field}.valueIsRegex` }
      component={ RegexToggle }
      valueFieldName={ `${field}.value` }
    />
  </div>
);

const Subdomain = () => (
  <FieldArray
    name="subdomains"
    renderItem={ renderItem }
    component={ MultipleItemEditor }
  />
);

const formConfig = {
  settingsToFormValues(values, settings) {
    values = {
      ...values,
      ...settings
    };

    if (!values.subdomains) {
      values.subdomains = [];
    }

    if (!values.subdomains.length) {
      values.subdomains.push({});
    }

    return values;
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    const subdomainsErrors = (values.subdomains || []).map(subdomain => {
      const result = {};

      if (!subdomain.value) {
        result.value = 'Please specify a subdomain.';
      }

      return result;
    });

    errors.subdomains = subdomainsErrors;

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(Subdomain);
