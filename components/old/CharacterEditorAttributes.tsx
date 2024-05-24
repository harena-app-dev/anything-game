import React from 'react';
import Container from 'react-bootstrap/Container';
import { Button } from 'react-bootstrap';
import Row from './Row';
import Col from './Col';
import AttributeEditor from './AttributeEditor';
// import Col from 'react-bootstrap/Col';

interface Attributes {
  strength?: number;
  dexterity?: number;
  constitution?: number;
  intelligence?: number;
  wisdom?: number;
  charisma?: number;
}
const defaultAttributes: Attributes = {
  strength: 8,
  dexterity: 8,
  constitution: 8,
  intelligence: 8,
  wisdom: 8,
  charisma: 8,
};
function CharacterAttributesView(attributes: Attributes = defaultAttributes) {
  const attributesWithDefaults = {
    ...defaultAttributes,
    ...attributes,
  };
  return (
    <Col>
      <Row>
        <h3>Attributes</h3>
      </Row>
      <Row>
        <h4>Ability points</h4>
      </Row>
      <Row>
        <h4>0</h4>
      </Row>
      {Object.entries(attributesWithDefaults).map(([key]) => (
        <Row key={key}>
          <AttributeEditor parent={attributesWithDefaults} fieldName={key} />
        </Row>
      ))}
    </Col>
  );
}

export default CharacterAttributesView;
