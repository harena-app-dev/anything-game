import * as React from 'react';

export default function StringEditor({
  parent,
  fieldName,
}: {
  parent: any;
  fieldName: string;
}) {
  const [state, setState] = React.useState(parent[fieldName]);
  const input = (
    <label>
      {fieldName}
      <input
        className="form-control"
        type="text"
        value={state}
        onChange={(e) => {
          setState(e.target.value);
          parent[fieldName] = e.target.value;
        }}
      />
    </label>
  );
  return input;
}
