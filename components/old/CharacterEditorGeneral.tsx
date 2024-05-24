import Character from '../../common/Character';
import Col from './Col';
import Row from './Row';
import TextEditor from './TextEditor';

export default function CharacterEditorGeneral({
  character,
}: {
  character: Character;
}) {
  const { name } = character;
  return (
    <Col>
      <Row>
        <h3>General</h3>
      </Row>
      <Row>
        <TextEditor parent={character} fieldName="name" />
      </Row>
    </Col>
  );
}
