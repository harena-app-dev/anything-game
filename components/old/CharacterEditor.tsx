import React from 'react';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
import Row from './Row';
import Col from './Col';
import Button from './Button';
import CharacterAttributesView from './CharacterEditorAttributes';
import CharacterGeneralView from './CharacterEditorGeneral';
import './CharacterEditor.css';
import CharacterSummary from './CharacterSummary';
import Character from '../../common/Character';

function CharacterEditor({ character }: { character: Character }) {
  const [view, setView] = React.useState(
    <CharacterGeneralView character={character} />,
  );
  return (
    <Row>
      <Col>
        <Button
          onClick={() =>
            setView(<CharacterGeneralView character={character} />)
          }
        >
          General
        </Button>
        <Button onClick={() => setView(<CharacterAttributesView />)}>
          Attributes
        </Button>
      </Col>
      <Col>{view}</Col>
      <div className="col" style={{ margin: '0px 0px 0px auto' }}>
        3
      </div>
    </Row>
  );
}

export default CharacterEditor;
