import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper, DataElementSelectorButton } from '@reactor/react-components';

import Field from '../../components/field';
import DataElement from '../dataElement';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import RegexToggle from '../../components/regexToggle';

const getReactComponents = (wrapper) => {
  const nameField =
    wrapper.find(Textfield).filterWhere(n => n.prop('name') === 'name').node;
  const valueField =
    wrapper.find(Textfield).filterWhere(n => n.prop('name') === 'value').node;
  const valueRegexToggle = wrapper.find(RegexToggle).node;
  const nameWrapper = wrapper.find(Field)
    .filterWhere(n => n.prop('name') === 'name').find(ValidationWrapper).node;
  const valueWrapper = wrapper.find(Field)
    .filterWhere(n => n.prop('name') === 'value').find(ValidationWrapper).node;
  const nameButton = wrapper.find(DataElementSelectorButton).node;

  return {
    nameField,
    nameButton,
    valueField,
    valueRegexToggle,
    nameWrapper,
    valueWrapper
  };
};

describe('data element view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    instance = mount(getFormComponent(DataElement, extensionBridge));
  });

  afterAll(() => {
    delete window.extensionBridge;
  });

  it('opens the data element selector from data element button', () => {
    extensionBridge.init();

    const { nameField, nameButton } = getReactComponents(instance);

    spyOn(window.extensionBridge, 'openDataElementSelector').and.callFake(callback => {
      callback('foo');
    });

    nameButton.props.onClick();

    expect(window.extensionBridge.openDataElementSelector).toHaveBeenCalled();
    expect(nameField.props.value).toBe('foo');
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        name: 'foo',
        value: 'bar',
        valueIsRegex: true
      }
    });

    const { nameField, valueField, valueRegexToggle } = getReactComponents(instance);

    expect(nameField.props.value).toBe('foo');
    expect(valueField.props.value).toBe('bar');
    expect(valueRegexToggle.props.value.input.value).toBe('bar');
    expect(valueRegexToggle.props.valueIsRegex.input.value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { nameField, valueField, valueRegexToggle } = getReactComponents(instance);

    nameField.props.onChange('foo');
    valueField.props.onChange('bar');
    valueRegexToggle.props.valueIsRegex.input.onChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      name: 'foo',
      value: 'bar',
      valueIsRegex: true
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { nameWrapper, valueWrapper } = getReactComponents(instance);

    expect(nameWrapper.props.error).toEqual(jasmine.any(String));
    expect(valueWrapper.props.error).toEqual(jasmine.any(String));
  });
});
