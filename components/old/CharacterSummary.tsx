import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function CharacterSummary() {
  const attributeAcronyms = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  return (
    <Container>
      <Row className="g-1">
        {attributeAcronyms.map((acronym) => (
          <Col key={acronym}>{acronym}</Col>
        ))}
      </Row>
    </Container>
  );
}

export default CharacterSummary;
