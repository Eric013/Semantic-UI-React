import _ from 'lodash'
import React from 'react'

import Confirm from 'src/addons/Confirm/Confirm'
import Modal from 'src/modules/Modal/Modal'
import { keyboardKey } from 'src/lib'
import { sandbox, domEvent, assertBodyContains } from 'test/utils'
import * as common from 'test/specs/commonTests'

// ----------------------------------------
// Wrapper
// ----------------------------------------
let wrapper

// we need to unmount the modal after every test to remove it from the document
// wrap the render methods to update a global wrapper that is unmounted after each test
const wrapperMount = (...args) => (wrapper = mount(...args))
const wrapperShallow = (...args) => (wrapper = shallow(...args))

describe('Confirm', () => {
  beforeEach(() => {
    wrapper = undefined
    document.body.innerHTML = ''
  })

  afterEach(() => {
    if (wrapper && wrapper.unmount) wrapper.unmount()
  })

  common.isConformant(Confirm)

  it('renders a small Modal', () => {
    wrapperShallow(<Confirm />)
    wrapper
      .type()
      .should.equal(Modal)
    wrapper
      .should.have.prop('size', 'small')
  })

  describe('cancelButton', () => {
    it('is "Cancel" by default', () => {
      Confirm.defaultProps.cancelButton
        .should.equal('Cancel')
    })
    it('sets the cancel button text', () => {
      shallow(<Confirm cancelButton='foo' />)
        .find('Button')
        .first()
        .shallow()
        .should.have.text('foo')
    })
  })

  describe('confirmButton', () => {
    it('is "OK" by default', () => {
      Confirm.defaultProps.confirmButton
        .should.equal('OK')
    })
    it('sets the confirm button text', () => {
      shallow(<Confirm confirmButton='foo' />)
        .find('Button[primary]')
        .shallow()
        .should.have.text('foo')
    })
  })

  describe('header', () => {
    it('is not present by default', () => {
      shallow(<Confirm />)
        .should.not.have.descendants('ModalHeader')
    })
    it('sets the header text', () => {
      wrapperShallow(<Confirm header='foo' />)
        .should.have.descendants('ModalHeader')
      wrapper
        .find('ModalHeader')
        .shallow()
        .should.have.text('foo')
    })
  })

  describe('content', () => {
    it('is "Are you sure?" by default', () => {
      wrapperShallow(<Confirm />)
        .should.have.descendants('ModalContent')
      wrapper
        .find('ModalContent')
        .shallow()
        .should.have.text('Are you sure?')
    })
    it('sets the content text', () => {
      wrapperShallow(<Confirm content='foo' />)
        .should.have.descendants('ModalContent')
      wrapper
        .find('ModalContent')
        .shallow()
        .should.have.text('foo')
    })
  })

  describe('onCancel', () => {
    let spy

    beforeEach(() => {
      spy = sandbox.spy()
      wrapperMount(<Confirm onCancel={spy} defaultOpen />)
    })

    it('is called on Cancel button click', () => {
      shallow(<Confirm onCancel={spy} />)
        .find('Button')
        .first()
        .simulate('click')

      spy.should.have.been.calledOnce()
    })

    it('is passed to the Modal onClose prop', () => {
      const func = () => null

      shallow(<Confirm onCancel={func} />)
        .find('Modal')
        .prop('onClose', func)
    })

    it('is called on dimmer click', () => {
      domEvent.click('.ui.dimmer')
      spy.should.have.been.calledOnce()
    })

    it('is called on click outside of the modal', () => {
      domEvent.click(document.querySelector('.ui.modal').parentNode)
      spy.should.have.been.calledOnce()
    })

    it('is not called on click inside of the modal', () => {
      domEvent.click(document.querySelector('.ui.modal'))
      spy.should.not.have.been.calledOnce()
    })

    it('is called on body click', () => {
      domEvent.click('body')
      spy.should.have.been.calledOnce()
    })

    it('is called when pressing escape', () => {
      domEvent.keyDown(document, { key: 'Escape' })
      spy.should.have.been.calledOnce()
    })

    it('is not called when pressing a key other than "Escape"', () => {
      _.each(keyboardKey, (val, key) => {
        // skip Escape key
        if (val === keyboardKey.Escape) return

        domEvent.keyDown(document, { key })
        spy.should.not.have.been.called(`onClose was called when pressing "${key}"`)
      })
    })

    it('is not called when the open prop changes to false', () => {
      wrapper.setProps({ open: false })
      spy.should.not.have.been.called()
    })
  })

  describe('onConfirm', () => {
    it('is called on OK button click', () => {
      const spy = sandbox.spy()
      shallow(<Confirm onConfirm={spy} />)
        .find('Button[primary]')
        .simulate('click')

      spy.should.have.been.calledOnce()
    })
  })

  describe('open', () => {
    it('is not open by default', () => {
      wrapperMount(<Confirm />)
      assertBodyContains('.ui.modal.open', false)
    })

    it('does not show the modal when false', () => {
      wrapperMount(<Confirm open={false} />)
      assertBodyContains('.ui.modal', false)
    })

    it('shows the modal when true', () => {
      wrapperMount(<Confirm open />)
      assertBodyContains('.ui.modal')
    })

    it('shows the modal on changing from false to true', () => {
      wrapperMount(<Confirm open={false} />)
      assertBodyContains('.ui.modal', false)

      wrapper.setProps({ open: true })

      assertBodyContains('.ui.modal')
    })

    it('hides the modal on changing from true to false', () => {
      wrapperMount(<Confirm open />)
      assertBodyContains('.ui.modal')

      wrapper.setProps({ open: false })

      assertBodyContains('.ui.modal', false)
    })
  })
})
