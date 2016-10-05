import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper, DataElementSelectorButton } from '@reactor/react-components';
import CoralField from '../../components/coralField';
import CartAmount from '../cartAmount';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import ComparisonOperatorField from '../components/comparisonOperatorField';

const getReactComponents = (wrapper) => {
  const textFields = wrapper.find(Textfield);
  const coralFields = wrapper.find(CoralField);

  const dataElementField = textFields.filterWhere(n => n.prop('name') === 'dataElement').node;
  const amountField = textFields.filterWhere(n => n.prop('name') === 'amount').node;
  const dataElementButton = wrapper.find(DataElementSelectorButton).node;
  const operatorField = wrapper.find(ComparisonOperatorField).node;
  const dataElementWrapper = coralFields.filterWhere(n => n.prop('name') === 'dataElement')
    .find(ValidationWrapper).node;
  const amountWrapper = coralFields.filterWhere(n => n.prop('name') === 'amount')
    .find(ValidationWrapper).node;

  return {
    dataElementField,
    dataElementButton,
    operatorField,
    amountField,
    dataElementWrapper,
    amountWrapper
  };
};

describe('cart amount view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(CartAmount, extensionBridge));
  });

  it('sets operator to greater than by default', () => {
    extensionBridge.init();

    const { operatorField } = getReactComponents(instance);

    expect(operatorField.props.value).toBe('>');
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        dataElement: 'foo',
        operator: '=',
        amount: 12.50
      }
    });

    const { dataElementField, operatorField, amountField } = getReactComponents(instance);

    expect(dataElementField.props.value).toBe('foo');
    expect(operatorField.props.value).toBe('=');
    expect(amountField.props.value).toBe(12.50);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { dataElementField, operatorField, amountField } = getReactComponents(instance);

    dataElementField.props.onChange('foo');
    operatorField.props.onChange('=');
    amountField.props.onChange('12.50');

    expect(extensionBridge.getSettings()).toEqual({
      dataElement: 'foo',
      operator: '=',
      amount: 12.50
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { dataElementWrapper, amountWrapper } = getReactComponents(instance);

    expect(dataElementWrapper.props.error).toEqual(jasmine.any(String));
    expect(amountWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets error if amount value is not a number', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { amountField, amountWrapper } = getReactComponents(instance);

    amountField.props.onChange('12.abc');

    expect(amountWrapper.props.error).toEqual(jasmine.any(String));
  });
});
