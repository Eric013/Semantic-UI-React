import React from 'react'
import ComponentExample from 'docs/app/Components/ComponentDoc/ComponentExample'
import ExampleSection from 'docs/app/Components/ComponentDoc/ExampleSection'

const ImageStatesExamples = () => (
  <ExampleSection title='States'>
    <ComponentExample
      title='Hidden'
      description='An image can be hidden'
      examplePath='elements/Image/States/ImageHiddenExample'
    />
    <ComponentExample
      title='Disabled'
      description='An image can show that it is disabled and cannot be selected'
      examplePath='elements/Image/States/ImageDisabledExample'
    />
  </ExampleSection>
)

export default ImageStatesExamples
