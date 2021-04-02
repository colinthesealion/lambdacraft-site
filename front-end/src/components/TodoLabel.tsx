import { Checkbox } from '@material-ui/core';

interface TodoLabelProps {
  id?: string;
  name: string;
  done: boolean;
}
export default function TodoLabel({ name, done, id }: TodoLabelProps) {
  return (
    <>
      <Checkbox checked={done} disabled value={id} />
      {name}
    </>
  );
}