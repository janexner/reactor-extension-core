/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

import { fireEvent, render } from '@testing-library/react';
import {
  sharedTestingElements,
  isButtonValid
} from '@test-helpers/react-testing-library';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import CustomCode, { formConfig } from '../customCode';
import bootstrap from '../../bootstrap';

describe('custom code event view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(CustomCode, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets error if source is empty', () => {
    expect(extensionBridge.validate()).toBe(false);

    expect(
      isButtonValid(sharedTestingElements.customCodeEditor.getTriggerButton())
    ).toBeFalse();
  });

  it('allows user to provide custom code', () => {
    spyOn(extensionBridge, 'openCodeEditor').and.callFake(() => ({
      then(resolve) {
        resolve('foo bar');
      }
    }));

    extensionBridge.init({
      settings: {
        source: 'foo'
      }
    });

    fireEvent.click(sharedTestingElements.customCodeEditor.getTriggerButton());

    expect(extensionBridge.getSettings()).toEqual({
      source: 'foo bar'
    });
  });
});
