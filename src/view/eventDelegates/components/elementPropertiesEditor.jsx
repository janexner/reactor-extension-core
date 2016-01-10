import React from 'react';
import Coral from 'coralui-support-react';
import ElementPropertyEditor from './elementPropertyEditor';
import createID from '../../utils/createID';

export const fields = [
  'elementProperties[].id',
  'elementProperties[].name',
  'elementProperties[].value',
  'elementProperties[].valueIsRegex'
];

export default class ElementPropertiesEditor extends React.Component {
  add = event => {
    this.props.elementProperties.addField({
      id: createID(),
      name: '',
      value: ''
    });
  };

  remove = index => {
    this.props.elementProperties.removeField(index);
  };

  render() {
    const { elementProperties } = this.props;

    return (
      <div>
        {elementProperties.map((elementProperty, index) => {
          return <ElementPropertyEditor
            key={elementProperty.id.value}
            {...elementProperty}
            remove={this.remove.bind(null, index)}
            removable={elementProperties.length > 1}
            />
        })}
        <Coral.Button ref="addButton" onClick={this.add}>Add</Coral.Button>
      </div>
    );
  }
}

export let reducers = {
  toValues: (values, options) => {
    values = {
      ...values
    };

    const { config } = options;

    var elementProperties = config.elementProperties || [];

    // Make sure there's always at least one element property. This is just so the view
    // always shows at least one row.
    if (!elementProperties.length) {
      elementProperties.push({
        name: '',
        value: ''
      });
    }

    // ID used as a key when rendering each item.
    elementProperties.forEach(elementProperty => elementProperty.id = createID());

    values.elementProperties = elementProperties;

    return values;
  },
  toConfig: (config, values) => {
    config = {
      ...config
    };

    let {
      elementProperties
    } = values;

    elementProperties = elementProperties.filter(elementProperty => {
      return elementProperty.name;
    }).map(elementProperty => {
      const { name, value, valueIsRegex } = elementProperty;

      elementProperty = {
        name,
        value
      };

      if (valueIsRegex) {
        elementProperty.valueIsRegex = true;
      }

      return elementProperty;
    });

    if (elementProperties.length) {
      config.elementProperties = elementProperties;
    }

    return config;
  }
};
