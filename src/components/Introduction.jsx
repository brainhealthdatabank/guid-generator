import React, { useState, Component } from 'react';
import ReactMarkdown from 'react-markdown';
import IntroductionMarkdown from './Introduction.md';
import DataFlowImage from './dataflow.drawio.svg';

class Introduction extends Component {
  constructor() {
    super();
    this.state = { markdown: '' };
  }

  componentWillMount() {
    // Get the contents from the Markdown file and put them in the React state, so we can reference it in render() below.
    fetch(IntroductionMarkdown).then(res => res.text()).then(text => this.setState({ markdown: text }));
  }

  render() {
    const { markdown } = this.state;

    return (
      <div>
        <ReactMarkdown>{markdown}</ReactMarkdown>;
      </div>
    
    );

  }
}

export default Introduction